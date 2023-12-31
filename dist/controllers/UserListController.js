"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOtherFollowersUsersController = exports.GetOtherFollowingUsersController = exports.GetFollowersUsersController = exports.GetFollowingUsersController = exports.GetPendingUsersController = exports.GetBlockedUsersController = exports.GetAllowedUsersController = exports.GetUsersController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const User_1 = __importDefault(require("../models/User"));
const UserHelper_1 = require("../helpers/UserHelper");
const GetUsersController = async (req, res) => {
    try {
        const user = res.locals.user;
        const search = req.query.search.trim();
        const users = await User_1.default.find({
            _id: { $ne: user._id },
            name: { $regex: search, $options: "i" },
        });
        const tempUsers = (0, UserHelper_1.ConvertUserListToPrivateList)(users, user);
        res
            .status(200)
            .json({ message: "Users fetched successfully!", users: tempUsers });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetUsersController = GetUsersController;
const GetAllowedUsersController = async (req, res) => {
    try {
        const user = res.locals.user;
        const users = await User_1.default.find({
            _id: { $in: user.allowed, $ne: user._id },
        });
        const tempUsers = (0, UserHelper_1.ConvertUserListToPrivateList)(users, user);
        res.status(200).json({
            message: "Allowed Users fetched successfully!",
            users: tempUsers,
        });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetAllowedUsersController = GetAllowedUsersController;
const GetBlockedUsersController = async (req, res) => {
    try {
        const user = res.locals.user;
        const users = await User_1.default.find({
            _id: { $in: user.blocked, $ne: user._id },
        });
        const tempUsers = (0, UserHelper_1.ConvertUserListToPrivateList)(users, user);
        res.status(200).json({
            message: "Blocked Users fetched successfully!",
            users: tempUsers,
        });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetBlockedUsersController = GetBlockedUsersController;
const GetPendingUsersController = async (req, res) => {
    try {
        const user = res.locals.user;
        const users = await User_1.default.find({
            _id: { $in: user.pending, $ne: user._id },
        });
        const tempUsers = (0, UserHelper_1.ConvertUserListToPrivateList)(users, user);
        res.status(200).json({
            message: "Pending Users fetched successfully!",
            users: tempUsers,
        });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetPendingUsersController = GetPendingUsersController;
const GetFollowingUsersController = async (req, res) => {
    try {
        const user = res.locals.user;
        const users = await User_1.default.find({
            _id: { $in: user.following, $ne: user._id },
        });
        const tempUsers = (0, UserHelper_1.ConvertUserListToPrivateList)(users, user);
        res.status(200).json({
            message: "Following Users fetched successfully!",
            users: tempUsers,
        });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetFollowingUsersController = GetFollowingUsersController;
const GetFollowersUsersController = async (req, res) => {
    try {
        const user = res.locals.user;
        const users = await User_1.default.find({
            _id: { $in: user.followers, $ne: user._id },
        });
        const tempUsers = (0, UserHelper_1.ConvertUserListToPrivateList)(users, user);
        res.status(200).json({
            message: "Followers Users fetched successfully!",
            users: tempUsers,
        });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetFollowersUsersController = GetFollowersUsersController;
const GetOtherFollowingUsersController = async (req, res) => {
    try {
        const user = res.locals.user;
        const otherUserId = req.params.id;
        const otherUser = await User_1.default.findOne({ _id: otherUserId });
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        if (!otherUser?.private) {
            const users = await User_1.default.find({
                _id: { $in: otherUser.following },
            });
            const tempUsers = (0, UserHelper_1.ConvertUserListToPrivateList)(users, user);
            res.status(200).json({ message: "User Found!", users: tempUsers });
            return;
        }
        if (user.following.some((id) => id.toString() === otherUserId)) {
            const users = await User_1.default.find({
                _id: { $in: otherUser.following },
            });
            const tempUsers = (0, UserHelper_1.ConvertUserListToPrivateList)(users, user);
            res.status(200).json({ message: "User Found!", users: tempUsers });
            return;
        }
        res.status(401).json({ message: "User not allowed!", users: [] });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetOtherFollowingUsersController = GetOtherFollowingUsersController;
const GetOtherFollowersUsersController = async (req, res) => {
    try {
        const user = res.locals.user;
        const otherUserId = req.params.id;
        const otherUser = await User_1.default.findOne({ _id: otherUserId });
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        if (!otherUser?.private) {
            const users = await User_1.default.find({
                _id: { $in: otherUser.followers },
            });
            const tempUsers = (0, UserHelper_1.ConvertUserListToPrivateList)(users, user);
            res.status(200).json({ message: "User Found!", users: tempUsers });
            return;
        }
        if (user.following.some((id) => id.toString() === otherUserId)) {
            const users = await User_1.default.find({
                _id: { $in: otherUser.followers },
            });
            const tempUsers = (0, UserHelper_1.ConvertUserListToPrivateList)(users, user);
            res.status(200).json({ message: "User Found!", users: tempUsers });
            return;
        }
        res.status(401).json({ message: "User not allowed!", users: [] });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetOtherFollowersUsersController = GetOtherFollowersUsersController;
