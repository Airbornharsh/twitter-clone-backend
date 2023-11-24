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
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const users = await User_1.default.find({
            email: { $ne: email },
            name: { $regex: search, $options: "i" },
        });
        const tempUsers = users.map((u) => {
            if (!u.private || u.allowed.some((a) => a.equals(user._id))) {
                return {
                    _id: u._id,
                    name: u.name,
                    userName: u.userName,
                    email: u.email,
                    bio: u.bio,
                    profileImage: u.profileImage,
                    coverImage: u.coverImage,
                    dob: u.dob,
                    location: u.location,
                    website: u.website,
                    private: u.private,
                    followers: u.followers,
                    following: u.following,
                    allowed: u.allowed,
                    allowedBy: u.allowedBy,
                    blocked: u.blocked,
                    blockedBy: u.blockedBy,
                    pending: u.pending,
                    pendingBy: u.pendingBy,
                    createdAt: u.createdAt,
                };
            }
            else
                return {
                    _id: u._id,
                    name: u.name,
                    userName: u.userName,
                    email: "",
                    bio: "",
                    profileImage: "",
                    coverImage: "",
                    dob: "",
                    location: "",
                    website: "",
                    private: true,
                    followers: [],
                    following: [],
                    allowed: u.allowed,
                    allowedBy: [],
                    blocked: u.blocked,
                    blockedBy: [],
                    pending: [],
                    pendingBy: [],
                    createdAt: u.createdAt,
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
