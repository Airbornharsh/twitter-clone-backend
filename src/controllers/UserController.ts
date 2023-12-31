import { RequestHandler } from "express";
import UserModel from "../models/User";
import { ErrorResponse } from "../helpers/ErrorHelper";
import { ConvertUserToPrivate } from "../helpers/UserHelper";

export const AddUserController: RequestHandler = async (req, res) => {
  try {
    const user = req.body;

    const checkUser = await UserModel.findOne({ email: user.email });

    if (checkUser) {
      res.status(200).json({ message: "User already exists!" });
      return;
    }

    const newUser = new UserModel(user);
    const result = await newUser.save();
    res.status(200).json({ message: "User added successfully!", user: result });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetUserController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;

    res.status(200).json({ message: "User fetched successfully!", user });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetOtherUserController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const otherUserId = req.params.id;

    const otherUser = await UserModel.findOne({ _id: otherUserId });

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    if (!otherUser?.private) {
      res.status(200).json({ message: "User Found!", user: otherUser });
      return;
    }

    const privateUser = ConvertUserToPrivate(otherUser, user);

    res.status(200).json({ message: "User Found!", user: privateUser });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateUserHandler: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
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

    await UserModel.findOneAndUpdate({ email: user.email }, data);

    res.status(200).json({ message: "Updated the User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
