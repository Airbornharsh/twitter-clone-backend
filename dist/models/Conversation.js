"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = exports.ConversationModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const ConservationSchema = new mongoose_2.Schema({
    members: [
        {
            type: mongoose_2.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
    ],
    messages: [
        {
            type: mongoose_2.Schema.Types.ObjectId,
            ref: "Messages",
            default: [],
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const ConversationModel = (0, mongoose_1.model)("Conversations", ConservationSchema);
exports.ConversationModel = ConversationModel;
const MessageModelSchema = new mongoose_2.Schema({
    conversationId: {
        type: mongoose_2.Schema.Types.ObjectId,
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
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    reciever: {
        type: mongoose_2.Schema.Types.ObjectId,
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
const MessageModel = (0, mongoose_1.model)("Messages", MessageModelSchema);
exports.MessageModel = MessageModel;
