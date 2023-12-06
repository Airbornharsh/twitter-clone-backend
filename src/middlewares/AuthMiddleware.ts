import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import UserModel from "../models/User";
import { firebaseAuth } from "../config/Firebase";

export const AuthenticateUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.get("token");

    if (!token) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const decodedToken = await firebaseAuth.verifyIdToken(token);

    if (!decodedToken) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const user = await UserModel.findOne({ email: decodedToken.email });

    if (!user) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    res.locals.user = user;
    next();
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};
