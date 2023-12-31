import { Schema, model } from "mongoose";

const Users = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    trim: true,
    default: "",
  },
  age: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  private: {
    type: Boolean,
    required: false,
    default: false,
  },
  profileImage: {
    type: String,
    required: false,
    default: "",
  },
  coverImage: {
    type: String,
    required: false,
    default: "",
  },
  bio: {
    type: String,
    required: false,
    default: "",
  },
  dob: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
    default: "",
  },
  website: {
    type: String,
    required: false,
    default: "",
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: [],
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: [],
    },
  ],
  blocked: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: [],
    },
  ],
  allowed: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: [],
    },
  ],
  pending: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: [],
    },
  ],
  blockedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: [],
    },
  ],
  allowedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: [],
    },
  ],
  pendingBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: [],
    },
  ],
  tweets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tweets",
      default: [],
    },
  ],
  likedTweets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tweets",
      default: [],
    },
  ],
  bookmarkedTweets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tweets",
      default: [],
    },
  ],
  retweetedTweets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tweets",
      default: [],
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notifications",
      default: [],
    },
  ],
  conversations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Conversations",
      default: [],
    },
  ],
  groupConversations: [
    {
      type: Schema.Types.ObjectId,
      ref: "GroupConversations",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});

const UserModel = model("Users", Users);

export default UserModel;
