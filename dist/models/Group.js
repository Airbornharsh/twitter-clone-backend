"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMessageModel = exports.GroupModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GroupSchema = new mongoose_1.default.Schema({
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
const GroupModel = mongoose_1.default.model("Groups", GroupSchema);
exports.GroupModel = GroupModel;
const GroupMessageSchema = new mongoose_1.default.Schema({
    groupId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const GroupMessageModel = mongoose_1.default.model("GroupMessages", GroupMessageSchema);
exports.GroupMessageModel = GroupMessageModel;
