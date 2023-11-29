import { RequestHandler } from "express";
import UserModel from "../models/User";
import {
  DirectMessageNotificationModel,
  FollowNotificationModel,
  GenericNotificationModel,
  LikeNotificationModel,
  NotificationModel,
  ReplyNotificationModel,
} from "../models/Notification";

export const GetNotificationsController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const notifications = await NotificationModel.find({ to: user._id });

    const genericNotificationIds: any[] = [];
    const directMessageNotificationIds: any[] = [];
    const followNotificationIds: any[] = [];
    const likeNotificationIds: any[] = [];
    const replyNotificationIds: any[] = [];

    notifications.forEach((notification) => {
      if (notification.type === "genericnotifications") {
        genericNotificationIds.push(notification.notificationId);
      } else if (notification.type === "directmessagenotifications") {
        directMessageNotificationIds.push(notification.notificationId);
      } else if (notification.type === "follownotifications") {
        followNotificationIds.push(notification.notificationId);
      } else if (notification.type === "likenotifications") {
        likeNotificationIds.push(notification.notificationId);
      } else if (notification.type === "replynotifications") {
        replyNotificationIds.push(notification.notificationId);
      }
    });

    const genericNotifications = await GenericNotificationModel.find({
      _id: { $in: genericNotificationIds },
    }).populate("from");

    const directMessageNotifications =
      await DirectMessageNotificationModel.find({
        _id: { $in: directMessageNotificationIds },
      }).populate("from");

    const followNotifications = await FollowNotificationModel.find({
      _id: { $in: followNotificationIds },
    }).populate("from");

    const likeNotifications = await LikeNotificationModel.find({
      _id: { $in: likeNotificationIds },
    }).populate(["from", "tweetId"]);

    const replyNotifications = await ReplyNotificationModel.find({
      _id: { $in: replyNotificationIds },
    }).populate(["from", "tweetId"]);

    const allNotifications = [
      ...genericNotifications,
      ...directMessageNotifications,
      ...followNotifications,
      ...likeNotifications,
      ...replyNotifications,
    ];

    const sortedNotifications = allNotifications.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    res.status(200).json({
      message: "Notifications found!",
      notifications: sortedNotifications,
    });
  } catch (e) {}
};
