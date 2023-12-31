import { RequestHandler } from "express";
import UserModel from "../models/User";
import { ErrorResponse } from "../helpers/ErrorHelper";
import {
  FollowNotificationModel,
  NotificationModel,
} from "../models/Notification";

export const UpdatePrivacyHandler: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const privacy = req.body.private;

    await UserModel.findOneAndUpdate({ _id: user._id }, { private: privacy });

    res.status(200).json({ message: "Updated the Private" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateAllowingUserController: RequestHandler = async (
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

    await user.updateOne({
      $addToSet: { allowed: otherUserId, followers: otherUserId },
      $pull: { pending: otherUserId, blocked: otherUserId },
    });

    await otherUser.updateOne({
      $addToSet: { allowedBy: user._id, following: user._id },
      $pull: { pendingBy: user._id, blockedBy: user._id },
    });

    res.status(200).json({ message: "Updated the Allowed User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdatePendingUserController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const otherUserId = req.params.id;

    const otherUser = await UserModel.findOne({ _id: otherUserId });

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    await user.updateOne({
      $addToSet: { pendingBy: otherUserId },
      $pull: { allowedBy: otherUserId, blockedBy: otherUserId },
    });

    await otherUser.updateOne({
      $addToSet: { pending: user._id },
      $pull: { allowed: user._id, blocked: user._id },
    });

    res.status(200).json({ message: "Updated the Pending User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateDenyingUserController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const otherUserId = req.params.id;

    const otherUser = await UserModel.findOne({ _id: otherUserId });

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    await user.updateOne({
      $pull: { pending: otherUserId },
    });

    await otherUser.updateOne({
      $pull: { pendingBy: user._id },
    });

    res.status(200).json({ message: "Updated the Denied User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateUnpendingUserController: RequestHandler = async (
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

    await user.updateOne({
      $pull: { pendingBy: otherUserId },
    });

    await otherUser.updateOne({
      $pull: { pending: user._id },
    });

    res.status(200).json({ message: "Updated the Cancelled Pending User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateBlockingUserController: RequestHandler = async (
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

    await user.updateOne({
      $addToSet: { blocked: otherUserId },
      $pull: {
        pending: otherUserId,
        allowed: otherUserId,
        following: otherUserId,
        followers: otherUserId,
      },
    });

    await otherUser.updateOne({
      $addToSet: { blockedBy: user._id },
      $pull: {
        pendingBy: user._id,
        allowedBy: user._id,
        following: user._id,
        followers: user._id,
      },
    });

    res.status(200).json({ message: "Updated the Blocked User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateUnblockingUserController: RequestHandler = async (
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

    await user.updateOne({
      $pull: { blocked: otherUserId },
    });

    await otherUser.updateOne({
      $pull: { blockedBy: user._id },
    });

    res.status(200).json({ message: "Updated the Unblocked User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateFollowingUserController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const otherUserId = req.params.id;

    const otherUser = await UserModel.findById(otherUserId);

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    if (otherUser.private) {
      await otherUser.updateOne({
        $addToSet: { pending: user._id },
      });

      await user.updateOne({
        $addToSet: { pendingBy: otherUser._id },
      });

      res
        .status(200)
        .json({ message: "Updated the Followed User", pending: true });
      return;
    }

    await user.updateOne({
      $addToSet: { following: otherUserId },
      $pull: {
        blocked: otherUserId,
        allowed: otherUserId,
        pending: otherUserId,
      },
    });

    await otherUser.updateOne({
      $addToSet: { followers: user._id },
      $pull: {
        blockedBy: user._id,
        allowedBy: user._id,
        pendingBy: user._id,
      },
    });

    const FollowNotification = await FollowNotificationModel.create({
      from: user._id,
    });

    const notification = await NotificationModel.create({
      to: otherUser._id,
      followNotification: FollowNotification._id,
    });

    await UserModel.findByIdAndUpdate(otherUser._id, {
      $push: { notifications: notification._id },
    });

    res
      .status(200)
      .json({ message: "Updated the Followed User", pending: false });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateUnfollowingUserController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const otherUserId = req.params.id;

    const otherUser = await UserModel.findById(otherUserId);

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    await user.updateOne({
      $pull: { following: otherUserId },
    });

    await otherUser.updateOne({
      $pull: { followers: user._id },
    });

    res.status(200).json({ message: "Updated the Unfollowed User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateRemoveFollowerController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const otherUserId = req.params.id;

    const otherUser = await UserModel.findById(otherUserId);

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    await user.updateOne({ $pull: { followers: otherUserId } });

    await otherUser.updateOne({ $pull: { following: user._id } });

    res.status(200).json({ message: "Updated the Unfollowed User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
