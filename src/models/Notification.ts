import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  genericNotification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GenericNotifications",
    default: null,
  },
  directMessageNotification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DirectMessageNotifications",
    default: null,
  },
  followNotification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FollowNotifications",
    default: null,
  },
  likeNotification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LikeNotifications",
    default: null,
  },
  replyNotification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReplyNotifications",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NotificationModel = mongoose.model("Notifications", notificationSchema);

const genericNotificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
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

const GenericNotificationModel = mongoose.model(
  "GenericNotifications",
  genericNotificationSchema
);

const directMessageNotificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
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

const DirectMessageNotificationModel = mongoose.model(
  "DirectMessageNotifications",
  directMessageNotificationSchema
);

const followNotificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FollowNotificationModel = mongoose.model(
  "FollowNotifications",
  followNotificationSchema
);

const likeNotificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  tweetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweets",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LikeNotificationModel = mongoose.model(
  "LikeNotifications",
  likeNotificationSchema
);

const replyNotificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  tweetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweets",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReplyNotificationModel = mongoose.model(
  "ReplyNotifications",
  replyNotificationSchema
);

export {
  NotificationModel,
  GenericNotificationModel,
  DirectMessageNotificationModel,
  FollowNotificationModel,
  LikeNotificationModel,
  ReplyNotificationModel,
};
