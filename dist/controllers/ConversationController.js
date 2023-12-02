"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadMessageController = exports.SendMessageController = exports.GetConservationController = exports.GetUserConservationController = exports.GetConservationsController = exports.CreateConversationController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const User_1 = __importDefault(require("../models/User"));
const Conversation_1 = require("../models/Conversation");
const Firebase_1 = require("../config/Firebase");
const CreateConversationController = async (req, res) => {
    try {
        const email = req.get("email");
        const { userId } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const user2 = await User_1.default.findOne({ _id: userId });
        if (!user2) {
            res.status(400).json({ message: "User not found!" });
            return;
        }
        if (user2.private &&
            user._id.toString() !== user2._id.toString() &&
            !user2.allowed.includes(user._id)) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const conversationExist = await Conversation_1.ConversationModel.findOne({
            members: { $all: [user._id, user2._id] },
        });
        if (conversationExist) {
            res.status(200).json({
                message: "Conversation exist!",
                conversation: conversationExist,
            });
            return;
        }
        const conversation = await Conversation_1.ConversationModel.create({
            members: [user2._id, user._id],
        });
        await user
            .updateOne({ $addToSet: { conversations: conversation._id } })
            .exec();
        await user2
            .updateOne({ $addToSet: { conversations: conversation._id } })
            .exec();
        const message = await Conversation_1.MessageModel.create({
            conversationId: conversation._id,
            message: "Conversation started!",
            sender: user._id,
            reciever: user2._id,
        });
        const conversationRef = Firebase_1.firestoreDb
            .collection("conversations")
            .doc(conversation._id.toString());
        await conversationRef.collection("messages").add({
            message: "Conversation started!",
            messageId: message._id.toString(),
            sender: user._id.toString(),
            reciever: user2._id.toString(),
            createdAt: Date.now(),
        });
        res
            .status(200)
            .json({ message: "Conversation created successfully!", conversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.CreateConversationController = CreateConversationController;
const GetConservationsController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const conversations = await Conversation_1.ConversationModel.find({
            members: { $in: [user._id] },
        }).populate({
            path: "members",
            select: "name userName profileImage",
        });
        res.status(200).json({ message: "Conversations found!", conversations });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetConservationsController = GetConservationsController;
const GetUserConservationController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const conversationId = req.params.id;
        const conversation = await Conversation_1.ConversationModel.findOne({
            _id: conversationId,
            members: { $in: [user._id] },
        })
            .populate({
            path: "members",
            select: "name userName profileImage",
        })
            .select("members createdAt");
        if (!conversation) {
            res.status(404).json({ message: "Conversation not found!" });
            return;
        }
        res.status(200).json({ message: "Conversation found!", conversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetUserConservationController = GetUserConservationController;
const GetConservationController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const conversationId = req.params.id;
        const conversation = await Conversation_1.ConversationModel.findOne({
            _id: conversationId,
            members: { $in: [user._id] },
        }).populate([
            {
                path: "members",
                select: "name userName profileImage",
            },
            {
                path: "messages",
                populate: [
                    {
                        path: "sender",
                        select: "name userName profileImage",
                    },
                    {
                        path: "reciever",
                        select: "name userName profileImage",
                    },
                ],
                options: {
                    limit: 20,
                    sort: { createdAt: -1 },
                },
            },
        ]);
        if (!conversation) {
            res.status(404).json({ message: "Conversation not found!" });
            return;
        }
        res.status(200).json({ message: "Conversation found!", conversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetConservationController = GetConservationController;
const SendMessageController = async (req, res) => {
    try {
        const email = req.get("email");
        const conversationId = req.params.id;
        const { message, messageMedia, recieverId } = req.body;
        console.log(recieverId);
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const reciever = await User_1.default.findOne({ _id: recieverId });
        if (!reciever) {
            res.status(404).json({ message: "Reciever not found!" });
            return;
        }
        const conversation = await Conversation_1.ConversationModel.findOne({
            _id: conversationId,
            members: { $in: [user._id] },
        });
        if (!conversation) {
            res.status(404).json({ message: "Conversation not found!" });
            return;
        }
        const newMessage = await Conversation_1.MessageModel.create({
            conversationId,
            message,
            messageMedia,
            sender: user._id,
            reciever: reciever._id,
        });
        await conversation.updateOne({
            $push: { messages: newMessage._id },
        });
        const conversationRef = Firebase_1.firestoreDb
            .collection("conversations")
            .doc(conversationId);
        await conversationRef.collection("messages").add({
            message,
            messageMedia,
            messageId: newMessage._id.toString(),
            sender: user._id.toString(),
            reciever: reciever._id.toString(),
            read: false,
            createdAt: Date.now(),
        });
        res.status(200).json({ message: "Message sent successfully!", newMessage });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.SendMessageController = SendMessageController;
const ReadMessageController = async (req, res) => {
    try {
        const email = req.get("email");
        const conversationId = req.params.id;
        const messageId = req.params.messageId;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const conversation = await Conversation_1.ConversationModel.findOne({
            _id: conversationId,
            members: { $in: [user._id] },
        });
        if (!conversation) {
            res.status(404).json({ message: "Conversation not found!" });
            return;
        }
        const message = await Conversation_1.MessageModel.findOne({
            _id: messageId,
            conversationId,
        });
        if (!message) {
            res.status(404).json({ message: "Message not found!" });
            return;
        }
        await message.updateOne({ read: true });
        res.status(200).json({ message: "Message read successfully!" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.ReadMessageController = ReadMessageController;
