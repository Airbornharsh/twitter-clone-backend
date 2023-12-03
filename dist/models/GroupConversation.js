"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupConversationMessageModel = exports.GroupConversationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GroupConversationSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
    ],
    groupMembers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users",
            default: [],
        },
    ],
    requestedMembers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users",
            default: [],
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const GroupConversationModel = mongoose_1.default.model("GroupConversations", GroupConversationSchema);
exports.GroupConversationModel = GroupConversationModel;
const GroupConversationMessageSchema = new mongoose_1.default.Schema({
    groupId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    readBy: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const GroupConversationMessageModel = mongoose_1.default.model("GroupConversationMessages", GroupConversationMessageSchema);
exports.GroupConversationMessageModel = GroupConversationMessageModel;
