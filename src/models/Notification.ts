import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "type",
    required: true,
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
