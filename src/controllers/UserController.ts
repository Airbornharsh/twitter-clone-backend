import { RequestHandler } from "express";
import UserModel from "../models/User";
import { ErrorResponse } from "../helpers/ErrorHelper";

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
    const email = req.get("email");

    const user = await UserModel.findOne({ email });
    res.status(200).json({ message: "User fetched successfully!", user });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetOtherUserController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const otherEmail = req.params.id;

    const user = await UserModel.findOne({ email });
    const otherUser = await UserModel.findOne({ email: otherEmail });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    if (!otherUser?.private) {
      res.status(200).json({ message: "User Found!", user: otherUser });
      return;
    }

    let userCheck = false;
    const privateUser = {
      _id: otherUser?._id,
      name: "Private User",
      email: "",
      userName: "Private User",
      profileImage: "",
      coverImage: "",
      bio: "",
      dob: "",
      location: "",
      website: "",
    };

    user?.allowed.forEach((u: any) => {
      if (u.toString() === otherUser?._id.toString()) {
        userCheck = true;
        return;
      }
    });

    userCheck &&
      res.status(200).json({ message: "User Found!", user: otherUser });

    user?.pending.forEach((u: any) => {
      if (u.toString() === otherUser?._id.toString()) {
        userCheck = false;
        return;
      }
    });

    user?.blocked.forEach((u: any) => {
      if (u.toString() === otherUser?._id.toString()) {
        userCheck = false;
        return;
      }
    });

    if (!userCheck)
      res.status(200).json({ message: "User not allowed!", user: privateUser });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateUserHandler: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
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
