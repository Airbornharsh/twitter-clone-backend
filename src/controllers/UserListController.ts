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
      name: { $regex: search as string, $options: "i" },
    });

    const tempUsers = users.map((user) => {
      if (!user.private)
        return {
          _id: user._id,
          name: user.name,
          userName: user.userName,
          email: user.email,
          bio: user.bio,
          profieImage: user.profileImage,
          coverImage: user.coverImage,
          dob: user.dob,
          location: user.location,
          website: user.website,
          private: user.private,
          followers: user.followers,
          following: user.following,
          allowed: user.allowed,
          allowedBy: user.allowedBy,
          blocked: user.blocked,
          blockedBy: user.blockedBy,
          pending: user.pending,
          pendingBy: user.pendingBy,
          createdAt: user.createdAt,
        };
      else
        return {
          _id: user._id,
          name: user.name,
          userName: user.userName,
          email: "",
          bio: "",
          profieImage: "",
          coverImage: "",
          dob: "",
          location: "",
          website: "",
          private: true,
          followers: [],
          following: [],
          allowed: user.allowed,
          allowedBy: [],
          blocked: user.blocked,
          blockedBy: [],
          pending: [],
          pendingBy: [],
          createdAt: user.createdAt,
        };
    });

    res
      .status(200)
      .json({ message: "Users fetched successfully!", users: tempUsers });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetAllowedUsersController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const users = await UserModel.find({
      _id: { $in: user.allowed },
    });

    res
      .status(200)
      .json({ message: "Allowed Users fetched successfully!", users });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetBlockedUsersController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const users = await UserModel.find({
      _id: { $in: user.blocked },
    });

    res
      .status(200)
      .json({ message: "Blocked Users fetched successfully!", users });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetPendingUsersController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const users = await UserModel.find({
      _id: { $in: user.pending },
    });

    res
      .status(200)
      .json({ message: "Pending Users fetched successfully!", users });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
