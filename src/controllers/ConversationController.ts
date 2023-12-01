import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import UserModel from "../models/User";
import { ConversationModel, MessageModel } from "../models/Conversation";

export const CreateConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const email = req.get("email");
    const { userId } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const user2 = await UserModel.findOne({ _id: userId });

    if (!user2) {
      res.status(400).json({ message: "User not found!" });
      return;
    }

    if (
      user2.private &&
      user._id.toString() !== user2._id.toString() &&
      !user2.allowed.includes(user._id)
    ) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const conversationExist = await ConversationModel.findOne({
      members: { $all: [user._id, user2._id] },
    });

    if (conversationExist) {
      res.status(200).json({
        message: "Conversation exist!",
        conversation: conversationExist,
      });
      return;
    }

    const conversation = await ConversationModel.create({
      members: [user._id, user2._id],
    });

    await user.updateOne({ $push: { conversations: conversation._id } }).exec();

    await user2
      .updateOne({ $push: { conversations: conversation._id } })
      .exec();

    res
      .status(200)
      .json({ message: "Conversation created successfully!", conversation });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetConservationsController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const conversations = await ConversationModel.find({
      members: { $in: [user._id] },
    }).populate({
      path: "members",
      select: "name userName profileImage",
    });

    res.status(200).json({ message: "Conversations found!", conversations });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetConservationController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const conversationId = req.params.id;

    const conversation = await ConversationModel.findOne({
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
            path: "recieve",
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
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const SendMessageController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const conversationId = req.params.id;
    const { message, messageMedia, recieverId } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const reciever = await UserModel.findOne({ _id: recieverId });

    if (!reciever) {
      res.status(404).json({ message: "Reciever not found!" });
      return;
    }

    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      members: { $in: [user._id] },
    });

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found!" });
      return;
    }

    const newMessage = await MessageModel.create({
      conversationId,
      message,
      messageMedia,
      sender: user._id,
      reciever: reciever._id,
    });

    await conversation.updateOne({
      $push: { messages: newMessage._id },
    });

    res.status(200).json({ message: "Message sent successfully!", newMessage });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
