"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyNotification = exports.LikeNotification = exports.FollowNotification = exports.DirectMessageNotification = exports.GenericNotification = exports.Notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    type: {
        type: String,
        enum: ["generic", "directMessage", "follow", "like", "reply"],
        required: true,
    },
    notificationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Notification = mongoose_1.default.model("Notifications", notificationSchema);
exports.Notification = Notification;
const genericNotificationSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const GenericNotification = mongoose_1.default.model("GenericNotifications", genericNotificationSchema);
exports.GenericNotification = GenericNotification;
const directMessageNotificationSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const DirectMessageNotification = mongoose_1.default.model("DirectMessageNotifications", directMessageNotificationSchema);
exports.DirectMessageNotification = DirectMessageNotification;
const followNotificationSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const FollowNotification = mongoose_1.default.model("FollowNotifications", followNotificationSchema);
exports.FollowNotification = FollowNotification;
const likeNotificationSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    tweetId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tweets",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const LikeNotification = mongoose_1.default.model("LikeNotifications", likeNotificationSchema);
exports.LikeNotification = LikeNotification;
const replyNotificationSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    tweetId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tweets",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const ReplyNotification = mongoose_1.default.model("ReplyNotifications", replyNotificationSchema);
exports.ReplyNotification = ReplyNotification;
