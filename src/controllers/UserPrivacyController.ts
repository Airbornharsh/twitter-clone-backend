import { RequestHandler } from "express";
import UserModel from "../models/User";
import { ErrorResponse } from "../helpers/ErrorHelper";

export const UpdatePrivacyHandler: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const privacy = req.body.private;

    await UserModel.findOneAndUpdate({ email }, { private: privacy });

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

export const UpdateBlockingUserController: RequestHandler = async (
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
    const email = req.get("email");
    const otherUserId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const otherUser = await UserModel.findById(otherUserId);

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    if (otherUser.private) {
      // let userCheck = false;

      // user.allowed.forEach((u: any) => {
      //   if (u.toString() === otherUser._id.toString()) {
      //     userCheck = true;
      //     return;
      //   }
      // });

      // if (!userCheck) {
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
      // }
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
    const email = req.get("email");
    const otherUserId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

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
    const email = req.get("email");
    const otherUserId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

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
