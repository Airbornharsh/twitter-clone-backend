import { Request, Response } from "express";
import UserModel from "../models/User";
import PrivacyUserModel from "../models/PrivacyUser";

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

export const GetOtherUserController = async (req: Request, res: Response) => {
  const email = req.params.email;
  const otherEmail = req.params.otherEmail;

  const user = await UserModel.findOne({ email });
  const otherUser = await UserModel.findOne({ email: otherEmail });

  if (!otherUser?.private) {
    res.status(200).json({ message: "User Found!", user: otherUser });
    return;
  }

  const PrivacyUser = await PrivacyUserModel.findOne({
    userId: user?._id,
    otherUserId: otherUser?._id,
  });

  if (!PrivacyUser) {
    const newPrivacyUser = new PrivacyUserModel({
      userId: user?._id,
      otherUserId: otherUser?._id,
    });
    await newPrivacyUser.save();
  }

  if (PrivacyUser?.allowed) {
    res.status(200).json({ message: "User fetched successfully!", user });
  } else {
    res.status(401).json({ message: "User not allowed!" });
  }
};
