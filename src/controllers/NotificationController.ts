import { RequestHandler } from "express";
import UserModel from "../models/User";
import {
  NotificationModel,
} from "../models/Notification";

export const GetNotificationsController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const notifications = await NotificationModel.find({ to: user._id })
      .populate([
        {
          path: "genericNotification",
          model: "GenericNotifications",
          populate: [
            {
              path: "from",
              model: "Users",
              select: ["name", "userName", "profileImage", "createdAt"],
            },
          ],
        },
        {
          path: "directMessageNotification",
          model: "DirectMessageNotifications",
          populate: [
            {
              path: "from",
              model: "Users",
              select: ["name", "userName", "profileImage", "createdAt"],
            },
          ],
        },
        {
          path: "followNotification",
          model: "FollowNotifications",
          populate: [
            {
              path: "from",
              model: "Users",
              select: ["name", "userName", "profileImage", "createdAt"],
            },
          ],
        },
        {
          path: "likeNotification",
          model: "LikeNotifications",
          populate: [
            {
              path: "from",
              model: "Users",
              select: ["name", "userName", "profileImage", "createdAt"],
            },
            {
              path: "tweetId",
              model: "Tweets",
              select: ["title", "tweetMedia", "createdAt"],
            },
          ],
        },
        {
          path: "replyNotification",
          model: "ReplyNotifications",
          populate: [
            {
              path: "from",
              model: "Users",
              select: ["name", "userName", "profileImage", "createdAt"],
            },
            {
              path: "tweetId",
              model: "Tweets",
              select: ["title", "tweetMedia", "createdAt"],
            },
          ],
        },
      ])
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      message: "Notifications found!",
      notifications: notifications,
    });
  } catch (e) {}
};
