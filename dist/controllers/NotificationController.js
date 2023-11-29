"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNotificationsController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Notification_1 = require("../models/Notification");
const GetNotificationsController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const notifications = await Notification_1.NotificationModel.find({ to: user._id });
        const genericNotificationIds = [];
        const directMessageNotificationIds = [];
        const followNotificationIds = [];
        const likeNotificationIds = [];
        const replyNotificationIds = [];
        notifications.forEach((notification) => {
            if (notification.type === "genericnotifications") {
                genericNotificationIds.push(notification.notificationId);
            }
            else if (notification.type === "directmessagenotifications") {
                directMessageNotificationIds.push(notification.notificationId);
            }
            else if (notification.type === "follownotifications") {
                followNotificationIds.push(notification.notificationId);
            }
            else if (notification.type === "likenotifications") {
                likeNotificationIds.push(notification.notificationId);
            }
            else if (notification.type === "replynotifications") {
                replyNotificationIds.push(notification.notificationId);
            }
        });
        const genericNotifications = await Notification_1.GenericNotificationModel.find({
            _id: { $in: genericNotificationIds },
        }).populate("from");
        const directMessageNotifications = await Notification_1.DirectMessageNotificationModel.find({
            _id: { $in: directMessageNotificationIds },
        }).populate("from");
        const followNotifications = await Notification_1.FollowNotificationModel.find({
            _id: { $in: followNotificationIds },
        }).populate("from");
        const likeNotifications = await Notification_1.LikeNotificationModel.find({
            _id: { $in: likeNotificationIds },
        }).populate([
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
        ]);
        const replyNotifications = await Notification_1.ReplyNotificationModel.find({
            _id: { $in: replyNotificationIds },
        }).populate([
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
        ]);
        const allNotifications = [
            ...genericNotifications,
            ...directMessageNotifications,
            ...followNotifications,
            ...likeNotifications,
            ...replyNotifications,
        ];
        const sortedNotifications = allNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        res.status(200).json({
            message: "Notifications found!",
            notifications: sortedNotifications,
        });
    }
    catch (e) { }
};
exports.GetNotificationsController = GetNotificationsController;
