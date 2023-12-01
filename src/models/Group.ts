import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  groupDescription: {
    type: String,
    default: "",
  },
  groupImage: {
    type: String,
    default: "",
  },
  groupAdmin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  ],
  groupMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: [],
    },
  ],
  requestedMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GroupModel = mongoose.model("Groups", GroupSchema);

const GroupMessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Groups",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  messageMedia: {
    type: String,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  readBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GroupMessageModel = mongoose.model("GroupMessages", GroupMessageSchema);

export { GroupModel, GroupMessageModel };
