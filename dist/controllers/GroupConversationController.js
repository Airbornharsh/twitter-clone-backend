"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGroupConversationController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const Firebase_1 = require("../config/Firebase");
const User_1 = __importDefault(require("../models/User"));
const GroupConversation_1 = require("../models/GroupConversation");
const CreateGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { name, members } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!name) {
            res.status(400).json({ message: "Name is required!" });
            return;
        }
        if (!members) {
            res.status(400).json({ message: "Members is required!" });
            return;
        }
        const membersExist = await User_1.default.find({ _id: { $in: members } });
        if (!membersExist) {
            res.status(400).json({ message: "Members not found!" });
            return;
        }
        if (members.length < 1) {
            res.status(400).json({ message: "Members must be more than 1!" });
            return;
        }
        if (members.length > 100) {
            res.status(400).json({ message: "Members must be less than 100!" });
            return;
        }
        if (members.includes(user._id)) {
            res.status(400).json({ message: "Members must not include you!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.create({
            groupName: name,
            groupAdmin: [user._id],
            groupMembers: [...members, user._id],
        });
        await user
            .updateOne({ $addToSet: { groupConversations: groupConversation._id } })
            .exec();
        await User_1.default.updateMany({ _id: { $in: members } }, { $addToSet: { groupConversations: groupConversation._id } });
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: `${user.name} created this group`,
            sender: user._id,
        });
        const groupConversationRef = Firebase_1.firestoreDb
            .collection("groupConversations")
            .doc(groupConversation._id.toString());
        await groupConversationRef.collection("groupMessages").add({
            groupMessageId: groupMessage._id.toString(),
            groupMessage: groupMessage.message,
            sender: groupMessage.sender.toString(),
            createdAt: new Date(groupMessage.createdAt).getTime(),
        });
        res.status(200).json({ message: "Group created!", groupConversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.CreateGroupConversationController = CreateGroupConversationController;
