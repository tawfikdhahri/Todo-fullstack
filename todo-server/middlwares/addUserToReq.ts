import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user";
import jwt from "jsonwebtoken";

export interface IRequest extends Request {
  locals?: any;
}

export const addUserToReq = (req: IRequest, res: Response, next: NextFunction): any => {
  req.locals = {};

  //add locals to req

  const authorization: string = req.headers.authorization;
  const params: any = {
    authorization,
  };

  verifyUser(params)
    .then((user: IUser): any => {
      req.locals.user = user;
      next();
    })
    .catch((e): void => {
      next();
    });
};

const verifyUser = ({ authorization, secretKey = process.env.SECRET_KEY }: any): Promise<IUser> => {
  return jwt.verify(
    authorization,
    secretKey,
    (err: any, user: IUser): Promise<IUser> => {
      if (err) {
        return Promise.reject("unauthorized");
      } else {
        return Promise.resolve(user);
      }
    }
  );
};
