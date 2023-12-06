import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import { firestoreDb } from "../config/Firebase";
import UserModel from "../models/User";
import {
  GroupConversationMessageModel,
  GroupConversationModel,
} from "../models/GroupConversation";
import firebase from "firebase/compat/app";

export const AdminCreateGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const { groupName } = req.body;
    const groupDescription = req.body.groupDescription
      ? req.body.groupDescription
      : "";
    const groupImage = req.body.groupImage ? req.body.groupImage : "";
    const members = req.body.members ? req.body.members : [];

    if (!groupName) {
      res.status(400).json({ message: "Group Name is required!" });
      return;
    }

    if (members) {
      if (members.length > 100) {
        res.status(400).json({ message: "Members must be less than 100!" });
        return;
      }

      const membersExist = await UserModel.find({ _id: { $in: members } });

      if (!membersExist) {
        res.status(400).json({ message: "Members not found!" });
        return;
      }
    }

    if (members.includes(user._id)) {
      res.status(400).json({ message: "Members must not include you!" });
      return;
    }

    const groupConversation = await GroupConversationModel.create({
      groupName: groupName,
      groupDescription: groupDescription,
      groupImage: groupImage,
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

export const GetGroupConversationsController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;

    const groupConversations = await GroupConversationModel.find({
      groupMembers: user._id,
    });

    if (!groupConversations) {
      res.status(400).json({ message: "No group conversations found!" });
      return;
    }

    res.status(200).json({ groupConversations });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const SearchGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const name = req.params.name ? req.params.name : "";

    const groupConversations = await GroupConversationModel.find({
      groupName: { $regex: name, $options: "i" },
    });

    res.status(200).json({ groupConversations });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Conversation Id is required!" });
      return;
    }

    const groupConversation = await GroupConversationModel.findOne({
      _id: id,
      groupMembers: user._id,
    })
      .select(
        "groupName groupDescription groupImage groupAdmin groupMembers requestedMembers createdAt"
      )
      .populate({
        path: "groupAdmin",
        select: "name userName profileImage",
      })
      .populate({
        path: "groupMembers",
        select: "name userName profileImage",
      })
      .populate({
        path: "requestedMembers",
        select: "name userName profileImage",
      });

    if (!groupConversation) {
      res.status(400).json({ message: "Conversation not found!" });
      return;
    }

    res.status(200).json({ groupConversation });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const SendMessageToGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;
    const message = req.body.message ? req.body.message : "";
    const messageMedia = req.body.messageMedia ? req.body.messageMedia : [];

    if (!id) {
      res.status(400).json({ message: "Conversation Id is required!" });
      return;
    }

    if (!message) {
      res.status(400).json({ message: "Message is required!" });
      return;
    }

    const groupConversation = await GroupConversationModel.findOne({
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

    const groupMessage = await GroupConversationMessageModel.create({
      groupId: groupConversation._id,
      message: message,
      messageMedia: messageMedia,
      sender: user._id,
    });

    const groupConversationRef = firestoreDb
      .collection("groupConversations")
      .doc(groupConversation._id.toString());

    await groupConversationRef.collection("groupMessages").add({
      groupMessageId: groupMessage._id.toString(),
      groupMessage: groupMessage.message,
      messageMedia: groupMessage.messageMedia as string[],
      readBy: [] as string[],
      sender: groupMessage.sender.toString(),
      createdAt: new Date(groupMessage.createdAt).getTime(),
    });

    res.status(200).json({ message: "Message sent!", groupMessage });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

// export const ReadGroupMessageController: RequestHandler = async (req, res) => {
//   try {
  //   const user = res.locals.user;
  //   const { id } = req.params;
//     const { messageId } = req.body;

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

export const AdminUpdateGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
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

    if (!id) {
      res.status(400).json({ message: "Conversation Id is required!" });
      return;
    }

    const groupConversation = await GroupConversationModel.findOne({
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

    const groupMessage = await GroupConversationMessageModel.create({
      groupId: groupConversation._id,
      message: customMessage,
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

    res.status(200).json({ message: "Group updated!", groupConversation });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const AdminAddGroupConversationMemberController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;
    const { members } = req.body;

    if (!id) {
      res.status(400).json({ message: "Conversation Id is required!" });
      return;
    }

    if (!members) {
      res.status(400).json({ message: "Members is required!" });
      return;
    }

    const groupConversation = await GroupConversationModel.findOne({
      _id: id,
    });

    if (!groupConversation) {
      res.status(400).json({ message: "Conversation not found!" });
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

    const groupAdmin = groupConversation.groupAdmin;

    if (!groupAdmin.includes(user._id)) {
      res.status(400).json({ message: "You are not an admin!" });
      return;
    }

    await groupConversation.updateOne({
      $addToSet: { groupMembers: { $each: members } },
    });

    await UserModel.updateMany(
      { _id: { $in: members } },
      { $addToSet: { groupConversations: groupConversation._id } }
    );

    const groupMessage = await GroupConversationMessageModel.create({
      groupId: groupConversation._id,
      message: `${user.name} added ${members.length} member${
        members.length > 1 ? "s" : ""
      }`,
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

    res.status(200).json({ message: "Members added!", groupConversation });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const AdminRemoveGroupConversationMemberController: RequestHandler =
  async (req, res) => {
    try {
      const user = res.locals.user;
      const { id } = req.params;
      const { members } = req.body;

      if (!id) {
        res.status(400).json({ message: "Conversation Id is required!" });
        return;
      }

      if (!members) {
        res.status(400).json({ message: "Members is required!" });
        return;
      }

      const groupConversation = await GroupConversationModel.findOne({
        _id: id,
      });

      if (!groupConversation) {
        res.status(400).json({ message: "Conversation not found!" });
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

      const groupAdmin = groupConversation.groupAdmin;

      if (!groupAdmin.includes(user._id)) {
        res.status(400).json({ message: "You are not an admin!" });
        return;
      }

      await groupConversation.updateOne({
        $pull: { groupMembers: { $in: members }, groupAdmin: { $in: members } },
      });

      await UserModel.updateMany(
        { _id: { $in: members } },
        { $pull: { groupConversations: groupConversation._id } }
      );

      const groupMessage = await GroupConversationMessageModel.create({
        groupId: groupConversation._id,
        message: `${user.name} removed ${members.length} member${
          members.length > 1 ? "s" : ""
        }`,
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

      res.status(200).json({ message: "Members removed!", groupConversation });
    } catch (e) {
      ErrorResponse(res, 500, e);
    }
  };

export const AdminAddGroupConversationAdminController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;
    const { members } = req.body;

    if (!id) {
      res.status(400).json({ message: "Conversation Id is required!" });
      return;
    }

    if (!members) {
      res.status(400).json({ message: "Members is required!" });
      return;
    }

    const groupConversation = await GroupConversationModel.findOne({
      _id: id,
    });

    if (!groupConversation) {
      res.status(400).json({ message: "Conversation not found!" });
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

    const groupAdmin = groupConversation.groupAdmin;

    if (!groupAdmin.includes(user._id)) {
      res.status(400).json({ message: "You are not an admin!" });
      return;
    }

    await groupConversation.updateOne({
      $addToSet: { groupAdmin: { $each: members } },
    });

    const groupMessage = await GroupConversationMessageModel.create({
      groupId: groupConversation._id,
      message: `${user.name} added ${members.length} admin${
        members.length > 1 ? "s" : ""
      }`,
      sender: user._id,
    });

    const groupConversationRef = firestoreDb
      .collection("groupConversations")
      .doc(groupConversation._id.toString());

    await groupConversationRef.collection("groupMessages").add({
      groupMessageId: groupMessage._id.toString(),
      groupMessage: groupMessage.message,
      sender: groupMessage.sender.toString(),
    });

    res.status(200).json({ message: "Admin added!", groupConversation });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const AdminRemoveGroupConversationAdminController: RequestHandler =
  async (req, res) => {
    try {
      const user = res.locals.user;
      const { id } = req.params;
      const { members } = req.body;

      if (!id) {
        res.status(400).json({ message: "Conversation Id is required!" });
        return;
      }

      if (!members) {
        res.status(400).json({ message: "Members is required!" });
        return;
      }

      const groupConversation = await GroupConversationModel.findOne({
        _id: id,
      });

      if (!groupConversation) {
        res.status(400).json({ message: "Conversation not found!" });
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

      const groupAdmin = groupConversation.groupAdmin;

      if (!groupAdmin.includes(user._id)) {
        res.status(400).json({ message: "You are not an admin!" });
        return;
      }

      await groupConversation.updateOne({
        $pull: { groupAdmin: { $in: members } },
      });

      const groupMessage = await GroupConversationMessageModel.create({
        groupId: groupConversation._id,
        message: `${user.name} removed ${members.length} admin${
          members.length > 1 ? "s" : ""
        }`,
        sender: user._id,
      });

      const groupConversationRef = firestoreDb
        .collection("groupConversations")
        .doc(groupConversation._id.toString());

      await groupConversationRef.collection("groupMessages").add({
        groupMessageId: groupMessage._id.toString(),
        groupMessage: groupMessage.message,
        sender: groupMessage.sender.toString(),
      });

      res.status(200).json({ message: "Admin removed!", groupConversation });
    } catch (e) {
      ErrorResponse(res, 500, e);
    }
  };

export const AdminAllowGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;
    const { userId } = req.body;

    if (!id) {
      res.status(400).json({ message: "Conversation Id is required!" });
      return;
    }

    if (!userId) {
      res.status(400).json({ message: "User Id is required!" });
      return;
    }

    const otherUser = await UserModel.findOne({ _id: userId });

    if (!otherUser) {
      res.status(400).json({ message: "User not found!" });
      return;
    }

    const groupConversation = await GroupConversationModel.findOne({
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

    await UserModel.updateOne(
      { _id: userId },
      { $addToSet: { groupConversations: groupConversation._id } }
    );

    const groupMessage = await GroupConversationMessageModel.create({
      groupId: groupConversation._id,
      message: `${user.name} allowed ${otherUser.name}`,
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

    res.status(200).json({ message: "User allowed!", groupConversation });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const AdminDenyGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;
    const { userId } = req.body;

    if (!id) {
      res.status(400).json({ message: "Conversation Id is required!" });
      return;
    }

    if (!userId) {
      res.status(400).json({ message: "User Id is required!" });
      return;
    }

    const otherUser = await UserModel.findOne({ _id: userId });

    if (!otherUser) {
      res.status(400).json({ message: "User not found!" });
      return;
    }

    const groupConversation = await GroupConversationModel.findOne({
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

    const groupMessage = await GroupConversationMessageModel.create({
      groupId: groupConversation._id,
      message: `${user.name} denied ${otherUser.name}`,
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

    res.status(200).json({ message: "User denied!", groupConversation });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const AdminDeleteGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Conversation Id is required!" });
      return;
    }

    const groupConversation = await GroupConversationModel.findOne({
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

    await UserModel.updateMany(
      { _id: { $in: groupConversation.groupMembers } },
      { $pull: { groupConversations: groupConversation._id } }
    );

    await groupConversation.deleteOne();

    await GroupConversationMessageModel.deleteMany({
      groupId: groupConversation._id,
    });

    const groupConversationRef = firestoreDb
      .collection("groupConversations")
      .doc(groupConversation._id.toString());

    await groupConversationRef.delete();

    res.status(200).json({ message: "Group deleted!" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const LeaveGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Conversation Id is required!" });
      return;
    }

    const groupConversation = await GroupConversationModel.findOne({
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

    const groupMessage = await GroupConversationMessageModel.create({
      groupId: groupConversation._id,
      message: `${user.name} left the group`,
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

    res.status(200).json({ message: "You left the group!" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const JoinGroupConversationController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Conversation Id is required!" });
      return;
    }

    const groupConversation = await GroupConversationModel.findOne({
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

    const groupMessage = await GroupConversationMessageModel.create({
      groupId: groupConversation._id,
      message: `${user.name} requested to group`,
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

    res.status(200).json({ message: "You Requested to join the group!" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
