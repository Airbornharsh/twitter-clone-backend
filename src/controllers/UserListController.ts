import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import UserModel from "../models/User";
import { ConvertUserListToPrivateList } from "../helpers/UserHelper";

export const GetUsersController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const search = (req.query.search as string).trim();

    const users = await UserModel.find({
      _id: { $ne: user._id },
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
    const user = res.locals.user;

    const users = await UserModel.find({
      _id: { $in: user.allowed, $ne: user._id },
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
    const user = res.locals.user;

    const users = await UserModel.find({
      _id: { $in: user.blocked, $ne: user._id },
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
    const user = res.locals.user;

    const users = await UserModel.find({
      _id: { $in: user.pending, $ne: user._id },
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
    const user = res.locals.user;

    const users = await UserModel.find({
      _id: { $in: user.following, $ne: user._id },
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
    const user = res.locals.user;

    const users = await UserModel.find({
      _id: { $in: user.followers, $ne: user._id },
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
    const user = res.locals.user;
    const otherUserId = req.params.id;

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

      res.status(200).json({ message: "User Found!", users: tempUsers });
      return;
    }

    if (user.following.some((id: any) => id.toString() === otherUserId)) {
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

export const GetOtherFollowersUsersController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const otherUserId = req.params.id;

    const otherUser = await UserModel.findOne({ _id: otherUserId });

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    if (!otherUser?.private) {
      const users = await UserModel.find({
        _id: { $in: otherUser.followers },
      });

      const tempUsers = ConvertUserListToPrivateList(users, user);

      res.status(200).json({ message: "User Found!", users: tempUsers });
      return;
    }

    if (user.following.some((id:any) => id.toString() === otherUserId)) {
      const users = await UserModel.find({
        _id: { $in: otherUser.followers },
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
