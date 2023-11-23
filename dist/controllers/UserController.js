"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBlockedUsersController = exports.GetAllowedUsersController = exports.GetUsersController = exports.UpdateUserHandler = exports.UpdatePrivacyHandler = exports.GetOtherUserController = exports.GetUserController = exports.AddUserController = void 0;
const User_1 = __importDefault(require("../models/User"));
const PrivacyUser_1 = __importDefault(require("../models/PrivacyUser"));
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const AddUserController = async (req, res) => {
    try {
        const user = req.body;
        const newUser = new User_1.default(user);
        const result = await newUser.save();
        res.status(200).json({ message: "User added successfully!", user: result });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AddUserController = AddUserController;
const GetUserController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        res.status(200).json({ message: "User fetched successfully!", user });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetUserController = GetUserController;
const GetOtherUserController = async (req, res) => {
    try {
        const email = req.get("email");
        const otherEmail = req.params.otherEmail;
        const user = await User_1.default.findOne({ email });
        const otherUser = await User_1.default.findOne({ email: otherEmail });
        if (!otherUser?.private) {
            res.status(200).json({ message: "User Found!", user: otherUser });
            return;
        }
        const PrivacyUser = await PrivacyUser_1.default.findOne({
            userId: user?._id,
            otherUserId: otherUser?._id,
        });
        if (!PrivacyUser) {
            const newPrivacyUser = new PrivacyUser_1.default({
                userId: user?._id,
                otherUserId: otherUser?._id,
            });
            await newPrivacyUser.save();
        }
        if (PrivacyUser?.allowed) {
            res.status(200).json({ message: "User fetched successfully!", user });
        }
        else {
            res.status(401).json({ message: "User not allowed!" });
        }
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetOtherUserController = GetOtherUserController;
const UpdatePrivacyHandler = async (req, res) => {
    try {
        const email = req.get("email");
        const privacy = req.body.private;
        await User_1.default.findOneAndUpdate({ email }, { private: privacy });
        res.status(200).json({ message: "Updated the Private" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdatePrivacyHandler = UpdatePrivacyHandler;
const UpdateUserHandler = async (req, res) => {
    try {
        const email = req.get("email");
        const { name, age, profileImage, coverImage, bio, dob, location, website } = req.body;
        const data = {};
        // name && (data.name = name);
        Object.assign(data, name && { name }, age && { age }, profileImage && { profileImage }, coverImage && { coverImage }, bio && { bio }, dob && { dob }, location && { location }, website && { website });
        await User_1.default.findOneAndUpdate({ email }, data);
        res.status(200).json({ message: "Updated the User" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateUserHandler = UpdateUserHandler;
const GetUsersController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        const oldUsers = await User_1.default.find({
            email: { $ne: email },
        }).lean();
        const userIds = [];
        oldUsers.forEach((user) => {
            userIds.push(user._id.toString());
        });
        const users = await PrivacyUser_1.default.find({
            userId: user?._id,
        })
            .populate("otherUserId")
            .lean();
        const addedUsers = [];
        const tempUsers = users.map((user) => {
            addedUsers.push(user.otherUserId._id.toString());
            if (!user.allowed) {
                return {
                    _id: user.otherUserId._id,
                    allowed: user.allowed,
                    private: user.otherUserId.private,
                    name: "Private User",
                    userName: "Private User",
                    profileImage: "",
                    coverImage: "",
                    bio: "",
                    dob: "",
                    location: "",
                    website: "",
                };
            }
            else {
                return {
                    _id: user.otherUserId._id,
                    allowed: user.allowed,
                    private: user.otherUserId.private,
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
        const filteredUsers = userIds.filter((u) => {
            return !addedUsers.includes(u);
        });
        const newUsers = await User_1.default.find({
            _id: { $in: filteredUsers },
        }).lean();
        const tempNewUsers = newUsers.map((user) => {
            if (user.private)
                return {
                    _id: user._id,
                    allowed: false,
                    private: user.private,
                    name: "Private User",
                    userName: "Private User",
                    profileImage: "",
                    coverImage: "",
                    bio: "",
                    dob: "",
                    location: "",
                    website: "",
                };
            else
                return {
                    _id: user._id,
                    allowed: false,
                    private: user.private,
                    name: user.name,
                    userName: user.userName,
                    profileImage: user.profileImage,
                    coverImage: user.coverImage,
                    bio: user.bio,
                    dob: user.dob,
                    location: user.location,
                    website: user.website,
                };
        });
        const allUsers = [...tempUsers, ...tempNewUsers];
        res
            .status(200)
            .json({ message: "Users fetched successfully!", users: allUsers });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetUsersController = GetUsersController;
const GetAllowedUsersController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        const users = await PrivacyUser_1.default.find({
            userId: user?._id,
            allowed: true,
        })
            .populate("otherUserId")
            .lean();
        const privateIds = [];
        // const tempUsers = [];
        let allowedUsers = [];
        users.forEach((user) => {
            if (!user.otherUserId.private) {
                allowedUsers.push({
                    _id: user.otherUserId._id,
                    name: user.otherUserId.name,
                    email: user.otherUserId.email,
                    private: user.otherUserId.private,
                    userName: user.otherUserId.userName,
                    profileImage: user.otherUserId.profileImage,
                    coverImage: user.otherUserId.coverImage,
                    bio: user.otherUserId.bio,
                    dob: user.otherUserId.dob,
                    location: user.otherUserId.location,
                    website: user.otherUserId.website,
                });
            }
            else {
                privateIds.push(user.otherUserId._id.toString());
            }
        });
        const tempPrivacyUsers = await PrivacyUser_1.default.find({
            otherUserId: { $in: privateIds },
        })
            .populate("otherUserId")
            .lean();
        const tempUsers = tempPrivacyUsers.map((user) => {
            if (!user.allowed) {
                return {
                    _id: user.otherUserId._id,
                    allowed: user.allowed,
                    private: user.otherUserId.private,
                    name: "Private User",
                    userName: "Private User",
                    profileImage: "",
                    coverImage: "",
                    bio: "",
                    dob: "",
                    location: "",
                    website: "",
                };
            }
            else {
                return {
                    _id: user.otherUserId._id,
                    allowed: user.allowed,
                    private: user.otherUserId.private,
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
        allowedUsers = [...allowedUsers, ...tempUsers];
        res
            .status(200)
            .json({ message: "Users fetched successfully!", users: allowedUsers });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetAllowedUsersController = GetAllowedUsersController;
const GetBlockedUsersController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        const users = await PrivacyUser_1.default.find({
            userId: user?._id,
            allowed: false,
        })
            .populate("otherUserId")
            .lean();
        const privateIds = [];
        // const tempUsers = [];
        let blockedUsers = [];
        users.forEach((user) => {
            if (!user.otherUserId.private) {
                blockedUsers.push({
                    _id: user.otherUserId._id,
                    name: user.otherUserId.name,
                    email: user.otherUserId.email,
                    private: user.otherUserId.private,
                    userName: user.otherUserId.userName,
                    profileImage: user.otherUserId.profileImage,
                    coverImage: user.otherUserId.coverImage,
                    bio: user.otherUserId.bio,
                    dob: user.otherUserId.dob,
                    location: user.otherUserId.location,
                    website: user.otherUserId.website,
                });
            }
            else {
                privateIds.push(user.otherUserId._id.toString());
            }
        });
        const tempPrivacyUsers = await PrivacyUser_1.default.find({
            otherUserId: { $in: privateIds },
        })
            .populate("otherUserId")
            .lean();
        const tempUsers = tempPrivacyUsers.map((user) => {
            if (!user.allowed) {
                return {
                    _id: user.otherUserId._id,
                    allowed: user.allowed,
                    private: user.otherUserId.private,
                    name: "Private User",
                    userName: "Private User",
                    profileImage: "",
                    coverImage: "",
                    bio: "",
                    dob: "",
                    location: "",
                    website: "",
                };
            }
            else {
                return {
                    _id: user.otherUserId._id,
                    allowed: user.allowed,
                    private: user.otherUserId.private,
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
        blockedUsers = [...blockedUsers, ...tempUsers];
        res
            .status(200)
            .json({ message: "Users fetched successfully!", users: blockedUsers });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetBlockedUsersController = GetBlockedUsersController;
