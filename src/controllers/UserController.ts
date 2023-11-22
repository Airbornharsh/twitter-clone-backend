import { RequestHandler } from "express";
import UserModel from "../models/User";
import PrivacyUserModel from "../models/PrivacyUser";
import { ErrorResponse } from "../helpers/ErrorHelper";

export const AddUserController: RequestHandler = async (req, res) => {
  try {
    const user = req.body;
    const newUser = new UserModel(user);
    const result = await newUser.save();
    res.status(200).json({ message: "User added successfully!", user: result });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetUserController: RequestHandler = async (req, res) => {
  try {
    const email = req.query.email;

    const user = await UserModel.findOne({ email });
    res.status(200).json({ message: "User fetched successfully!", user });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetOtherUserController: RequestHandler = async (req, res) => {
  try {
    const email = req.query.email;
    const otherEmail = req.query.otherEmail;

    const user = await UserModel.findOne({ email });
    const otherUser = await UserModel.findOne({ email: otherEmail });

    if (!otherUser?.private) {
      res.status(200).json({ message: "User Found!", user: otherUser });
      return;
    }

    const PrivacyUser = await PrivacyUserModel.findOne({
      userId: user?._id,
      otherUserId: otherUser?._id,
    });

    if (!PrivacyUser) {
      const newPrivacyUser = new PrivacyUserModel({
        userId: user?._id,
        otherUserId: otherUser?._id,
      });
      await newPrivacyUser.save();
    }

    if (PrivacyUser?.allowed) {
      res.status(200).json({ message: "User fetched successfully!", user });
    } else {
      res.status(401).json({ message: "User not allowed!" });
    }
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdatePrivacyHandler: RequestHandler = async (req, res) => {
  try {
    const email = req.query.email;
    const privacy = req.body.private;

    await UserModel.findOneAndUpdate({ email }, { private: privacy });

    res.status(200).json({ message: "Updated the Private" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateUserHandler: RequestHandler = async (req, res) => {
  try {
    const email = req.query.email;
    const { name, age, profileImage, coverImage, bio, dob, location, website } =
      req.body;

    const data = {};

    // name && (data.name = name);
    Object.assign(
      data,
      name && { name },
      age && { age },
      profileImage && { profileImage },
      coverImage && { coverImage },
      bio && { bio },
      dob && { dob },
      location && { location },
      website && { website }
    );

    await UserModel.findOneAndUpdate({ email }, data);

    res.status(200).json({ message: "Updated the User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetUsersController: RequestHandler = async (req, res) => {
  try {
    const email = req.query.email;

    const user = await UserModel.findOne({ email });

    const oldUsers = await UserModel.find({
      email: { $ne: email },
    }).lean();

    const userIds: string[] = [];

    oldUsers.forEach((user: { _id: any }) => {
      userIds.push(user._id.toString());
    });

    const users = await PrivacyUserModel.find({
      userId: user?._id,
    })
      .populate("otherUserId")
      .lean();

    const addedUsers: string[] = [];

    const tempUsers = users.map((user: { allowed: any; otherUserId: any }) => {
      addedUsers.push(user.otherUserId._id.toString());
      if (!user.allowed) {
        return {
          _id: user.otherUserId._id,
          allowed: user.allowed,
          name: "Private User",
          userName: "Private User",
          profileImage: "",
          coverImage: "",
          bio: "",
          dob: "",
          location: "",
          website: "",
        };
      } else {
        return {
          _id: user.otherUserId._id,
          allowed: user.allowed,
          name: user.otherUserId.name,
          userName: user.otherUserId.userName,
          profileImage: user.otherUserId.profileImage,
          coverImage: user.otherUserId.coverImage,
          bio: user.otherUserId.bio,
          dob: user.otherUserId.dob,
          location: user.otherUserId.location,
          website: user.otherUserId.website,
        };
      }
    });

    const filteredUsers = userIds.filter((u: string) => {
      return !addedUsers.includes(u);
    });

    const newUsers = await UserModel.find({
      _id: { $in: filteredUsers },
    }).lean();

    const tempNewUsers = newUsers.map((user: { _id: any }) => {
      return {
        _id: user._id,
        allowed: false,
        name: "Private User",
        userName: "Private User",
        profileImage: "",
        coverImage: "",
        bio: "",
        dob: "",
        location: "",
        website: "",
      };
    });

    const allUsers = [...tempUsers, ...tempNewUsers];

    res
      .status(200)
      .json({ message: "Users fetched successfully!", users: allUsers });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetAllowedUsersController: RequestHandler = async (req, res) => {
  try {
    const email = req.query.email;

    const user = await UserModel.findOne({ email });

    const users = await PrivacyUserModel.find({
      userId: user?._id,
      allowed: true,
    })
      .populate("otherUserId")
      .lean();

    const allowedUsers = users.map((user: { otherUserId: any }) => {
      return {
        _id: user.otherUserId._id,
        name: user.otherUserId.name,
        email: user.otherUserId.email,
        userName: user.otherUserId.userName,
        profileImage: user.otherUserId.profileImage,
        coverImage: user.otherUserId.coverImage,
        bio: user.otherUserId.bio,
        dob: user.otherUserId.dob,
        location: user.otherUserId.location,
        website: user.otherUserId.website,
      };
    });

    res
      .status(200)
      .json({ message: "Users fetched successfully!", users: allowedUsers });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
