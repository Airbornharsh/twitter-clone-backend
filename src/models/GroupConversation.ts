import mongoose from "mongoose";

const GroupConversationSchema = new mongoose.Schema({
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

const GroupConversationModel = mongoose.model(
  "GroupConversations",
  GroupConversationSchema
);

const GroupConversationMessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupConversations",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  messageMedia: [
    {
      type: String,
      default: [],
    },
  ],
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

const GroupConversationMessageModel = mongoose.model(
  "GroupConversationMessages",
  GroupConversationMessageSchema
);

export { GroupConversationModel, GroupConversationMessageModel };
