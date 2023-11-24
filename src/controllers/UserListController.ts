import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import UserModel from "../models/User";

export const GetUsersController: RequestHandler = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ message: "Users fetched successfully!", users });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};
