import { Request, Response } from "express";
import UserModel from "../models/User";

export const AddUserController = async (req: Request, res: Response) => {
  const user = req.body;
  const newUser = new UserModel(user);
  const result = await newUser.save();
  res.status(200).json({ message: "User added successfully!", user: result });
};

export const GetUserController = async (req: Request, res: Response) => {
  const email = req.params.email;

  const user = await UserModel.findOne({ email });
  res.status(200).json({ message: "User fetched successfully!", user });
};
