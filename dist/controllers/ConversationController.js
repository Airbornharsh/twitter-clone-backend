"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConversationController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const User_1 = __importDefault(require("../models/User"));
const Conversation_1 = require("../models/Conversation");
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
            res
                .status(200)
                .json({
                message: "Conversation exist!",
                conversation: conversationExist,
            });
            return;
        }
        const conversation = await Conversation_1.ConversationModel.create({
            members: [user._id, user2._id],
        });
        await user.updateOne({ $push: { conversations: conversation._id } }).exec();
        await user2
            .updateOne({ $push: { conversations: conversation._id } })
            .exec();
        res
            .status(200)
            .json({ message: "Conversation created successfully!", conversation });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.CreateConversationController = CreateConversationController;
