"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFollowersUsersController = exports.GetFollowingUsersController = exports.GetPendingUsersController = exports.GetBlockedUsersController = exports.GetAllowedUsersController = exports.GetUsersController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const User_1 = __importDefault(require("../models/User"));
const UserHelper_1 = require("../helpers/UserHelper");
const GetUsersController = async (req, res) => {
    try {
        const email = req.get("email");
        const search = req.query.search.trim();
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const users = await User_1.default.find({
            email: { $ne: email },
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
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const users = await User_1.default.find({
            _id: { $in: user.allowed },
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
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const users = await User_1.default.find({
            _id: { $in: user.blocked },
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
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const users = await User_1.default.find({
            _id: { $in: user.pending },
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
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const users = await User_1.default.find({
            _id: { $in: user.following },
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
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const users = await User_1.default.find({
            _id: { $in: user.followers },
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
