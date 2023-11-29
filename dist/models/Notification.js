"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyNotificationModel = exports.LikeNotificationModel = exports.FollowNotificationModel = exports.DirectMessageNotificationModel = exports.GenericNotificationModel = exports.NotificationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    type: {
        type: String,
        enum: [
            "genericnotifications",
            "directmessagenotifications",
            "follownotifications",
            "likenotifications",
            "replynotifications",
        ],
        required: true,
    },
    notificationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "type",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const NotificationModel = mongoose_1.default.model("Notifications", notificationSchema);
exports.NotificationModel = NotificationModel;
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
const GenericNotificationModel = mongoose_1.default.model("GenericNotifications", genericNotificationSchema);
exports.GenericNotificationModel = GenericNotificationModel;
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
const DirectMessageNotificationModel = mongoose_1.default.model("DirectMessageNotifications", directMessageNotificationSchema);
exports.DirectMessageNotificationModel = DirectMessageNotificationModel;
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
const FollowNotificationModel = mongoose_1.default.model("FollowNotifications", followNotificationSchema);
exports.FollowNotificationModel = FollowNotificationModel;
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
const LikeNotificationModel = mongoose_1.default.model("LikeNotifications", likeNotificationSchema);
exports.LikeNotificationModel = LikeNotificationModel;
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
const ReplyNotificationModel = mongoose_1.default.model("ReplyNotifications", replyNotificationSchema);
exports.ReplyNotificationModel = ReplyNotificationModel;
