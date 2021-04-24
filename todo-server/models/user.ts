import { Schema, model, Document } from "mongoose";

import bcrypt from "bcryptjs";
import { createdAt } from "./schemaHooks";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: number;
}
export const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    id: String,
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },

    // ****             ****
    password: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Number,
      index: true,
    },
  },
  {
    id: true,
    _id: true,
  }
);

createdAt(userSchema);
const SALT_ROUND: number = Number.parseInt(process.env.BCRYPT_SALT_ROUND, 10);

// USER SCHEMA HOOKS
userSchema.pre<any>("save", function (this: IUser) {
  return bcrypt.hash(this.password, SALT_ROUND).then((hash) => {
    this.password = hash;
  });
});

// DEFINE NEW METHOD TO CHECK PASSWORD
userSchema.methods.comparePassword = function (candidatePassword, cb): void {
  bcrypt.compare(candidatePassword, this.password, (err: any, isMatch: boolean): void => {
    cb(err, isMatch);
  });
};

export default model<IUser>("User", userSchema);
