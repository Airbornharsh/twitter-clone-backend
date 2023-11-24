import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import UserModel from "../models/User";

export const GetUsersController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const search = (req.query.search as string).trim();

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const users = await UserModel.find({
      email: { $ne: email },
      name: { $regex: search as string, $options: "i" },
    });

    const tempUsers = users.map((u) => {
      if (!u.private || u.allowed.some((a) => a.equals(user._id))) {
        return {
          _id: u._id,
          name: u.name,
          userName: u.userName,
          email: u.email,
          bio: u.bio,
          profileImage: u.profileImage,
          coverImage: u.coverImage,
          dob: u.dob,
          location: u.location,
          website: u.website,
          private: u.private,
          followers: u.followers,
          following: u.following,
          allowed: u.allowed,
          allowedBy: u.allowedBy,
          blocked: u.blocked,
          blockedBy: u.blockedBy,
          pending: u.pending,
          pendingBy: u.pendingBy,
          createdAt: u.createdAt,
        };
      } else
        return {
          _id: u._id,
          name: u.name,
          userName: u.userName,
          email: "",
          bio: "",
          profileImage: "",
          coverImage: "",
          dob: "",
          location: "",
          website: "",
          private: true,
          followers: [],
          following: [],
          allowed: u.allowed,
          allowedBy: [],
          blocked: u.blocked,
          blockedBy: [],
          pending: [],
          pendingBy: [],
          createdAt: u.createdAt,
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
