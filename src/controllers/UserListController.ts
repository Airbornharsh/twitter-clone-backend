import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import UserModel from "../models/User";

export const GetUsersController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const search = (req.query.search as string).trim();

    const user = req.get("email");

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const users = await UserModel.find({
      email: { $ne: email },
      private: false,
      name: { $regex: search as string, $options: "i" },
    });

    res.status(200).json({ message: "Users fetched successfully!", users });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetAllowedUsersController : RequestHandler = async (req, res) => {
  try{
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if(!user){
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const users = await UserModel.find({
      _id: { $in: user.allowed },
    });

    res.status(200).json({ message: "Allowed Users fetched successfully!", users });
  }catch(e){
    ErrorResponse(res, 500, e);
  }
}