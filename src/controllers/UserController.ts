import { RequestHandler } from "express";
import UserModel from "../models/User";
import PrivacyUserModel from "../models/PrivacyUser";
import { ErrorResponse } from "../helpers/ErrorHelper";

export const AddUserController: RequestHandler = async (req, res) => {
  try {
    const user = req.body;
    const newUser = new UserModel(user);
    const result = await newUser.save();
    res.status(200).json({ message: "User added successfully!", user: result });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetUserController: RequestHandler = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await UserModel.findOne({ email });
    res.status(200).json({ message: "User fetched successfully!", user });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetOtherUserController: RequestHandler = async (req, res) => {
  try {
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
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdatePrivacyHandler: RequestHandler = async (req, res) => {
  try {
    const email = req.params.email;
    const privacy = req.body.private;

    await UserModel.findOneAndUpdate({ email }, { private: privacy });

    res.status(200).json({ message: "Updated the Private" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateUserHandler: RequestHandler = async (req, res) => {
  try {
    const email = req.params.email;
    const { name, age, profileImage, coverImage, bio, dob, location, website } =
      req.body;

    const data = {};

    // name && (data.name = name);
    Object.assign(
      data,
      name && { name },
      age && { age },
      profileImage && { profileImage },
      coverImage && { coverImage },
      bio && { bio },
      dob && { dob },
      location && { location },
      website && { website }
    );

    await UserModel.findOneAndUpdate({ email }, data);

    res.status(200).json({ message: "Updated the User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
