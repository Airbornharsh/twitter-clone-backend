"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNotificationsController = void 0;
const Notification_1 = require("../models/Notification");
const GetNotificationsController = async (req, res) => {
    try {
        const user = res.locals.user;
        const notifications = await Notification_1.NotificationModel.find({ to: user._id })
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
    }
    catch (e) { }
};
exports.GetNotificationsController = GetNotificationsController;
