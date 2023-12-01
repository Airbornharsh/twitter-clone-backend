import { model } from "mongoose";
import { Schema } from "mongoose";

const ConservationSchema = new Schema({
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Messages",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ConversationModel = model("Conversations", ConservationSchema);

const MessageModelSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversations",
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
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  recieve: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MessageModel = model("Messages", MessageModelSchema);

export { ConversationModel, MessageModel };
