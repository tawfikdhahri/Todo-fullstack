import jwt from "jsonwebtoken";
import { UserModel } from "../../models";
import { compare } from "bcryptjs";

export default {
  Query: {
    users: async () => {
      return await UserModel.find();
    },
    me: async (_, __, { user }) => {
      return await UserModel.findById(user.id);
    },
  },
  Mutation: {
    signIn: async (_, args): Promise<any> => {
      const user = await UserModel.findOne({ email: args.email });

      if (!user) {
        return Promise.reject({
          message: "User does not exist",
        });
      } else {
        console.log(user);

        const isMatch = await compare(args.password, user.password);
        if (!isMatch) {
          return Promise.reject({
            massage: "Password incorrect",
          });
        } else {
          const token = await jwt.sign({ id: user._id, ...args }, process.env.SECRET_KEY, {
            expiresIn: process.env.EXPIRESIN,
            mutatePayload: true,
          });

          if (token) {
            return Promise.resolve({
              accessToken: token,
            });
          }
        }
      }
    },

    signUp: async (_, args): Promise<any> => {
      const exist = await UserModel.findOne({ email: args.user.email });
      console.log({ exist });

      if (exist) {
        return Promise.reject({
          message: "User is already exist",
        });
      } else {
        const doc = new UserModel(args.user);
        const user = await doc.save();
        return user;
      }
    },
  },
};
