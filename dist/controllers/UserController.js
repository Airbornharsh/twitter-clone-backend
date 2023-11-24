"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserHandler = exports.GetOtherUserController = exports.GetUserController = exports.AddUserController = void 0;
const User_1 = __importDefault(require("../models/User"));
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const AddUserController = async (req, res) => {
    try {
        const user = req.body;
        const checkUser = await User_1.default.findOne({ email: user.email });
        if (checkUser) {
            res.status(200).json({ message: "User already exists!" });
            return;
        }
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
        const otherEmail = req.params.id;
        const user = await User_1.default.findOne({ email });
        const otherUser = await User_1.default.findOne({ email: otherEmail });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        if (!otherUser?.private) {
            res.status(200).json({ message: "User Found!", user: otherUser });
            return;
        }
        let userCheck = false;
        const privateUser = {
            _id: otherUser?._id,
            name: "Private User",
            email: "",
            userName: "Private User",
            profileImage: "",
            coverImage: "",
            bio: "",
            dob: "",
            location: "",
            website: "",
        };
        user?.allowed.forEach((u) => {
            if (u.toString() === otherUser?._id.toString()) {
                userCheck = true;
                return;
            }
        });
        userCheck &&
            res.status(200).json({ message: "User Found!", user: otherUser });
        user?.pending.forEach((u) => {
            if (u.toString() === otherUser?._id.toString()) {
                userCheck = false;
                return;
            }
        });
        user?.blocked.forEach((u) => {
            if (u.toString() === otherUser?._id.toString()) {
                userCheck = false;
                return;
            }
        });
        if (!userCheck)
            res.status(200).json({ message: "User not allowed!", user: privateUser });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetOtherUserController = GetOtherUserController;
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
