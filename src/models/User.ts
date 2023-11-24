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
  },
  coverImage: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  dob: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
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
  createdAt: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});

const UserModel = model("Users", Users);

export default UserModel;
