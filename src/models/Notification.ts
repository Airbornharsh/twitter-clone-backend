import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  type: {
    type: String,
    enum: ["generic", "directMessage", "follow", "like", "reply"],
    required: true,
  },
  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notifications", notificationSchema);

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

const GenericNotification = mongoose.model(
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

const DirectMessageNotification = mongoose.model(
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

const FollowNotification = mongoose.model(
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

const LikeNotification = mongoose.model(
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

const ReplyNotification = mongoose.model(
  "ReplyNotifications",
  replyNotificationSchema
);

export {
  Notification,
  GenericNotification,
  DirectMessageNotification,
  FollowNotification,
  LikeNotification,
  ReplyNotification,
};
