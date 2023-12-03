"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinGroupConversationController = exports.LeaveGroupConversationController = exports.AdminDeleteGroupConversationController = exports.AdminDenyGroupConversationController = exports.AdminAllowGroupConversationController = exports.AdminRemoveGroupConversationAdminController = exports.AdminAddGroupConversationAdminController = exports.AdminRemoveGroupConversationMemberController = exports.AdminAddGroupConversationMemberController = exports.AdminUpdateGroupConversationController = exports.SendMessageToGroupConversationController = exports.GetGroupConversationController = exports.SearchGroupConversationController = exports.GetGroupConversationsController = exports.AdminCreateGroupConversationController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const Firebase_1 = require("../config/Firebase");
const User_1 = __importDefault(require("../models/User"));
const GroupConversation_1 = require("../models/GroupConversation");
const AdminCreateGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { groupName, members } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!groupName) {
            res.status(400).json({ message: "Group Name is required!" });
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
            groupName: groupName,
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
exports.AdminCreateGroupConversationController = AdminCreateGroupConversationController;
const GetGroupConversationsController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const groupConversations = await GroupConversation_1.GroupConversationModel.find({
            groupMembers: user._id,
        });
        if (!groupConversations) {
            res.status(400).json({ message: "No group conversations found!" });
            return;
        }
        res.status(200).json({ groupConversations });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetGroupConversationsController = GetGroupConversationsController;
const SearchGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const name = req.params.name ? req.params.name : "";
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed" });
            return;
        }
        const groupConversations = await GroupConversation_1.GroupConversationModel.find({
            groupName: { $regex: name, $options: "i" },
        });
        res.status(200).json({ groupConversations });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.SearchGroupConversationController = SearchGroupConversationController;
const GetGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
            groupMembers: user._id,
        })
            .select("groupName groupDescription groupImage groupAdmin groupMembers createdAt")
            .populate({
            path: "groupAdmin",
            select: "name userName profileImage",
        })
            .populate({
            path: "groupMembers",
            select: "name userName profileImage",
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
            return;
        }
        res.status(200).json({ groupConversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetGroupConversationController = GetGroupConversationController;
const SendMessageToGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const message = req.body.message ? req.body.message : "";
        const messageMedia = req.body.messageMedia ? req.body.messageMedia : [];
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        if (!message) {
            res.status(400).json({ message: "Message is required!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
            groupMembers: user._id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
            return;
        }
        if (!groupConversation.groupMembers.includes(user._id)) {
            res.status(400).json({ message: "You are not a member!" });
            return;
        }
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: message,
            messageMedia: messageMedia,
            sender: user._id,
        });
        const groupConversationRef = Firebase_1.firestoreDb
            .collection("groupConversations")
            .doc(groupConversation._id.toString());
        await groupConversationRef.collection("groupMessages").add({
            groupMessageId: groupMessage._id.toString(),
            groupMessage: groupMessage.message,
            messageMedia: groupMessage.messageMedia,
            readBy: [],
            sender: groupMessage.sender.toString(),
            createdAt: new Date(groupMessage.createdAt).getTime(),
        });
        res.status(200).json({ message: "Message sent!", groupMessage });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.SendMessageToGroupConversationController = SendMessageToGroupConversationController;
// export const ReadGroupMessageController: RequestHandler = async (req, res) => {
//   try {
//     const email = req.get("email");
//     const { id } = req.params;
//     const { messageId } = req.body;
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       res.status(401).json({ message: "User not allowed!" });
//       return;
//     }
//     if (!id) {
//       res.status(400).json({ message: "Conversation Id is required!" });
//       return;
//     }
//     if (!messageId) {
//       res.status(400).json({ message: "Message Id is required!" });
//       return;
//     }
//     const groupConversation = await GroupConversationModel.findOne({
//       _id: id,
//       groupMembers: user._id,
//     });
//     if (!groupConversation) {
//       res.status(400).json({ message: "Conversation not found!" });
//       return;
//     }
//     if (!groupConversation.groupMembers.includes(user._id)) {
//       res.status(400).json({ message: "You are not a member!" });
//       return;
//     }
//     const groupMessage = await GroupConversationMessageModel.findOne({
//       _id: messageId,
//       groupId: id,
//     });
//     if (!groupMessage) {
//       res.status(400).json({ message: "Message not found!" });
//       return;
//     }
//     if (groupMessage.sender.toString() === user._id.toString()) {
//       res.status(400).json({ message: "You are the sender!" });
//       return;
//     }
//     if (groupMessage.readBy.includes(user._id)) {
//       res.status(400).json({ message: "Message already read!" });
//       return;
//     }
//     await groupMessage.updateOne({
//       $addToSet: { readBy: user._id },
//     });
//     const groupConversationRef = firestoreDb
//       .collection("groupConversations")
//       .doc(groupConversation._id.toString());
//     const groupMessageRef = groupConversationRef
//       .collection("groupMessages")
//       .doc(messageId);
//     await groupMessageRef.update({
//       readBy: [...groupMessage.readBy, user._id.toString()],
//     });
//     res.status(200).json({ message: "Message read!" });
//   } catch (e) {
//     ErrorResponse(res, 500, e);
//   }
// };
const AdminUpdateGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const groupName = req.body.groupName ? req.body.groupName : "";
        const groupDescription = req.body.groupDescription
            ? req.body.groupDescription
            : "";
        const groupImage = req.body.groupImage ? req.body.groupImage : "";
        const groupData = {};
        Object.assign(groupData, groupName ? { groupName } : {});
        Object.assign(groupData, groupDescription ? { groupDescription } : {});
        Object.assign(groupData, groupImage ? { groupImage } : {});
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
            return;
        }
        const groupAdmin = groupConversation.groupAdmin;
        if (!groupAdmin.includes(user._id)) {
            res.status(400).json({ message: "You are not an admin!" });
            return;
        }
        await groupConversation.updateOne(groupData);
        let customMessage = `${user.name} changed the group`;
        let check = false;
        if (groupName) {
            customMessage += ` name to ${groupName}`;
            check = true;
        }
        if (groupDescription) {
            if (check) {
                customMessage += ",";
            }
            customMessage += ` description to ${groupDescription}`;
        }
        if (groupImage) {
            if (check) {
                customMessage += ",";
            }
            customMessage += ` image`;
        }
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: customMessage,
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
        res.status(200).json({ message: "Group updated!", groupConversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AdminUpdateGroupConversationController = AdminUpdateGroupConversationController;
const AdminAddGroupConversationMemberController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const { members } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        if (!members) {
            res.status(400).json({ message: "Members is required!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
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
        const groupAdmin = groupConversation.groupAdmin;
        if (!groupAdmin.includes(user._id)) {
            res.status(400).json({ message: "You are not an admin!" });
            return;
        }
        await groupConversation.updateOne({
            $addToSet: { groupMembers: { $each: members } },
        });
        await User_1.default.updateMany({ _id: { $in: members } }, { $addToSet: { groupConversations: groupConversation._id } });
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: `${user.name} added ${members.length} member${members.length > 1 ? "s" : ""}`,
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
        res.status(200).json({ message: "Members added!", groupConversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AdminAddGroupConversationMemberController = AdminAddGroupConversationMemberController;
const AdminRemoveGroupConversationMemberController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const { members } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        if (!members) {
            res.status(400).json({ message: "Members is required!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
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
        const groupAdmin = groupConversation.groupAdmin;
        if (!groupAdmin.includes(user._id)) {
            res.status(400).json({ message: "You are not an admin!" });
            return;
        }
        await groupConversation.updateOne({
            $pull: { groupMembers: { $in: members } },
        });
        await User_1.default.updateMany({ _id: { $in: members } }, { $pull: { groupConversations: groupConversation._id } });
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: `${user.name} removed ${members.length} member${members.length > 1 ? "s" : ""}`,
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
        res.status(200).json({ message: "Members removed!", groupConversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AdminRemoveGroupConversationMemberController = AdminRemoveGroupConversationMemberController;
const AdminAddGroupConversationAdminController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const { members } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        if (!members) {
            res.status(400).json({ message: "Members is required!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
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
        const groupAdmin = groupConversation.groupAdmin;
        if (!groupAdmin.includes(user._id)) {
            res.status(400).json({ message: "You are not an admin!" });
            return;
        }
        await groupConversation.updateOne({
            $addToSet: { groupAdmin: { $each: members } },
        });
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: `${user.name} added ${members.length} admin${members.length > 1 ? "s" : ""}`,
            sender: user._id,
        });
        const groupConversationRef = Firebase_1.firestoreDb
            .collection("groupConversations")
            .doc(groupConversation._id.toString());
        await groupConversationRef.collection("groupMessages").add({
            groupMessageId: groupMessage._id.toString(),
            groupMessage: groupMessage.message,
            sender: groupMessage.sender.toString(),
        });
        res.status(200).json({ message: "Admin added!", groupConversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AdminAddGroupConversationAdminController = AdminAddGroupConversationAdminController;
const AdminRemoveGroupConversationAdminController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const { members } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        if (!members) {
            res.status(400).json({ message: "Members is required!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
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
        const groupAdmin = groupConversation.groupAdmin;
        if (!groupAdmin.includes(user._id)) {
            res.status(400).json({ message: "You are not an admin!" });
            return;
        }
        await groupConversation.updateOne({
            $pull: { groupAdmin: { $in: members } },
        });
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: `${user.name} removed ${members.length} admin${members.length > 1 ? "s" : ""}`,
            sender: user._id,
        });
        const groupConversationRef = Firebase_1.firestoreDb
            .collection("groupConversations")
            .doc(groupConversation._id.toString());
        await groupConversationRef.collection("groupMessages").add({
            groupMessageId: groupMessage._id.toString(),
            groupMessage: groupMessage.message,
            sender: groupMessage.sender.toString(),
        });
        res.status(200).json({ message: "Admin removed!", groupConversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AdminRemoveGroupConversationAdminController = AdminRemoveGroupConversationAdminController;
const AdminAllowGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const { userId } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        if (!userId) {
            res.status(400).json({ message: "User Id is required!" });
            return;
        }
        const otherUser = await User_1.default.findOne({ _id: userId });
        if (!otherUser) {
            res.status(400).json({ message: "User not found!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
            return;
        }
        const groupAdmin = groupConversation.groupAdmin;
        if (!groupAdmin.includes(user._id)) {
            res.status(400).json({ message: "You are not an admin!" });
            return;
        }
        const requestedMembers = groupConversation.requestedMembers;
        if (requestedMembers.length < 1) {
            res.status(400).json({ message: "No requested members!" });
            return;
        }
        if (!requestedMembers.includes(userId)) {
            res.status(400).json({ message: "User not requested!" });
            return;
        }
        await groupConversation.updateOne({
            $pull: { requestedMembers: userId },
            $addToSet: { groupMembers: userId },
        });
        await User_1.default.updateOne({ _id: userId }, { $addToSet: { groupConversations: groupConversation._id } });
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: `${user.name} allowed ${otherUser.name}`,
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
        res.status(200).json({ message: "User allowed!", groupConversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AdminAllowGroupConversationController = AdminAllowGroupConversationController;
const AdminDenyGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const { userId } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        if (!userId) {
            res.status(400).json({ message: "User Id is required!" });
            return;
        }
        const otherUser = await User_1.default.findOne({ _id: userId });
        if (!otherUser) {
            res.status(400).json({ message: "User not found!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
            return;
        }
        const groupAdmin = groupConversation.groupAdmin;
        if (!groupAdmin.includes(user._id)) {
            res.status(400).json({ message: "You are not an admin!" });
            return;
        }
        const requestedMembers = groupConversation.requestedMembers;
        if (requestedMembers.length < 1) {
            res.status(400).json({ message: "No requested members!" });
            return;
        }
        if (!requestedMembers.includes(userId)) {
            res.status(400).json({ message: "User not requested!" });
            return;
        }
        await groupConversation.updateOne({
            $pull: { requestedMembers: userId },
        });
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: `${user.name} denied ${otherUser.name}`,
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
        res.status(200).json({ message: "User denied!", groupConversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AdminDenyGroupConversationController = AdminDenyGroupConversationController;
const AdminDeleteGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
            return;
        }
        const groupAdmin = groupConversation.groupAdmin;
        if (!groupAdmin.includes(user._id)) {
            res.status(400).json({ message: "You are not an admin!" });
            return;
        }
        await User_1.default.updateMany({ _id: { $in: groupConversation.groupMembers } }, { $pull: { groupConversations: groupConversation._id } });
        await groupConversation.deleteOne();
        await GroupConversation_1.GroupConversationMessageModel.deleteMany({
            groupId: groupConversation._id,
        });
        const groupConversationRef = Firebase_1.firestoreDb
            .collection("groupConversations")
            .doc(groupConversation._id.toString());
        await groupConversationRef.delete();
        res.status(200).json({ message: "Group deleted!" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AdminDeleteGroupConversationController = AdminDeleteGroupConversationController;
const LeaveGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
            return;
        }
        const groupAdmin = groupConversation.groupAdmin;
        if (groupAdmin.includes(user._id)) {
            res.status(400).json({ message: "You are an admin!" });
            return;
        }
        await groupConversation.updateOne({
            $pull: { groupMembers: user._id },
        });
        await user.updateOne({
            $pull: { groupConversations: groupConversation._id },
        });
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: `${user.name} left the group`,
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
        res.status(200).json({ message: "You left the group!" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.LeaveGroupConversationController = LeaveGroupConversationController;
const JoinGroupConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { id } = req.params;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!id) {
            res.status(400).json({ message: "Conversation Id is required!" });
            return;
        }
        const groupConversation = await GroupConversation_1.GroupConversationModel.findOne({
            _id: id,
        });
        if (!groupConversation) {
            res.status(400).json({ message: "Conversation not found!" });
            return;
        }
        if (groupConversation.requestedMembers.includes(user._id)) {
            res.status(400).json({ message: "You already requested!" });
            return;
        }
        if (groupConversation.groupMembers.includes(user._id)) {
            res.status(400).json({ message: "You are already a member!" });
            return;
        }
        await groupConversation.updateOne({
            $addToSet: { requestedMembers: user._id },
        });
        const groupMessage = await GroupConversation_1.GroupConversationMessageModel.create({
            groupId: groupConversation._id,
            message: `${user.name} requested to group`,
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
        res.status(200).json({ message: "You Requested to join the group!" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.JoinGroupConversationController = JoinGroupConversationController;
