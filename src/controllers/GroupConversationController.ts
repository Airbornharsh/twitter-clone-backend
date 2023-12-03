import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import { firestoreDb } from "../config/Firebase";
import UserModel from "../models/User";
import {
  GroupConversationMessageModel,
  GroupConversationModel,
} from "../models/GroupConversation";

export const CreateGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const email = req.get("email");
    const { name, members } = req.body;

    const user = await UserModel.findOne({ email });

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

    const membersExist = await UserModel.find({ _id: { $in: members } });

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

    const groupConversation = await GroupConversationModel.create({
      groupName: name,
      groupAdmin: [user._id],
      groupMembers: [...members, user._id],
    });

    await user
      .updateOne({ $addToSet: { groupConversations: groupConversation._id } })
      .exec();

    await UserModel.updateMany(
      { _id: { $in: members } },
      { $addToSet: { groupConversations: groupConversation._id } }
    );

    const groupMessage = await GroupConversationMessageModel.create({
      groupId: groupConversation._id,
      message: `${user.name} created this group`,
      sender: user._id,
    });

    const groupConversationRef = firestoreDb
      .collection("groupConversations")
      .doc(groupConversation._id.toString());

    await groupConversationRef.collection("groupMessages").add({
      groupMessageId: groupMessage._id.toString(),
      groupMessage: groupMessage.message,
      sender: groupMessage.sender.toString(),
      createdAt: new Date(groupMessage.createdAt).getTime(),
    });

    res.status(200).json({ message: "Group created!", groupConversation });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
