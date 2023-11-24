"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPendingUsersController = exports.GetBlockedUsersController = exports.GetAllowedUsersController = exports.GetUsersController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const User_1 = __importDefault(require("../models/User"));
const GetUsersController = async (req, res) => {
    try {
        const email = req.get("email");
        const search = req.query.search.trim();
        const user = req.get("email");
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const users = await User_1.default.find({
            email: { $ne: email },
            name: { $regex: search, $options: "i" },
        });
        const tempUsers = users.map((user) => {
            if (!user.private)
                return {
                    _id: user._id,
                    name: user.name,
                    userName: user.userName,
                    email: user.email,
                    bio: user.bio,
                    profieImage: user.profileImage,
                    coverImage: user.coverImage,
                    dob: user.dob,
                    location: user.location,
                    website: user.website,
                    private: user.private,
                    followers: user.followers,
                    following: user.following,
                    allowed: user.allowed,
                    allowedBy: user.allowedBy,
                    blocked: user.blocked,
                    blockedBy: user.blockedBy,
                    pending: user.pending,
                    pendingBy: user.pendingBy,
                    createdAt: user.createdAt,
                };
            else
                return {
                    _id: user._id,
                    name: user.name,
                    userName: user.userName,
                    email: "",
                    bio: "",
                    profieImage: "",
                    coverImage: "",
                    dob: "",
                    location: "",
                    website: "",
                    private: true,
                    followers: [],
                    following: [],
                    allowed: user.allowed,
                    allowedBy: [],
                    blocked: user.blocked,
                    blockedBy: [],
                    pending: [],
                    pendingBy: [],
                    createdAt: user.createdAt,
                };
        });
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
        res
            .status(200)
            .json({ message: "Allowed Users fetched successfully!", users });
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
        res
            .status(200)
            .json({ message: "Blocked Users fetched successfully!", users });
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
        res
            .status(200)
            .json({ message: "Pending Users fetched successfully!", users });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetPendingUsersController = GetPendingUsersController;
