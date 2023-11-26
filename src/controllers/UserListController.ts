import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import UserModel from "../models/User";
import { ConvertUserListToPrivateList } from "../helpers/UserHelper";

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

    const tempUsers = ConvertUserListToPrivateList(users, user);

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

    const tempUsers = ConvertUserListToPrivateList(users, user);

    res.status(200).json({
      message: "Allowed Users fetched successfully!",
      users: tempUsers,
    });
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

    const tempUsers = ConvertUserListToPrivateList(users, user);

    res.status(200).json({
      message: "Blocked Users fetched successfully!",
      users: tempUsers,
    });
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

    const tempUsers = ConvertUserListToPrivateList(users, user);

    res.status(200).json({
      message: "Pending Users fetched successfully!",
      users: tempUsers,
    });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetFollowingUsersController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const users = await UserModel.find({
      _id: { $in: user.following },
    });

    const tempUsers = ConvertUserListToPrivateList(users, user);

    res.status(200).json({
      message: "Following Users fetched successfully!",
      users: tempUsers,
    });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetFollowersUsersController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const users = await UserModel.find({
      _id: { $in: user.followers },
    });

    const tempUsers = ConvertUserListToPrivateList(users, user);

    res.status(200).json({
      message: "Followers Users fetched successfully!",
      users: tempUsers,
    });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetOtherFollowingUsersController: RequestHandler = async (
  req,
  res
) => {
  try {
    const email = req.get("email");
    const otherUserId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const otherUser = await UserModel.findOne({ _id: otherUserId });

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    if (!otherUser?.private) {
      const users = await UserModel.find({
        _id: { $in: otherUser.following },
      });

      const tempUsers = ConvertUserListToPrivateList(users, user);

      res.status(200).json({ message: "User Found!", tempUsers });
      return;
    }

    if (user.following.some((id) => id.toString() === otherUserId)) {
      const users = await UserModel.find({
        _id: { $in: otherUser.following },
      });

      const tempUsers = ConvertUserListToPrivateList(users, user);

      res.status(200).json({ message: "User Found!", users: tempUsers });
      return;
    }

    res.status(401).json({ message: "User not allowed!", users: [] });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
