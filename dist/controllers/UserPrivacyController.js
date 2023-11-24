"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRemoveFollowerController = exports.UpdateUnfollowingUserController = exports.UpdateFollowingUserController = exports.UpdateUnblockingUserController = exports.UpdateBlockingUserController = exports.UpdatePendingUserController = exports.UpdateAllowingUserController = exports.UpdatePrivacyHandler = void 0;
const User_1 = __importDefault(require("../models/User"));
const ErrorHelper_1 = require("../helpers/ErrorHelper");
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
const UpdateAllowingUserController = async (req, res) => {
    try {
        const email = req.get("email");
        const otherUserId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const otherUser = await User_1.default.findOne({ _id: otherUserId });
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        await user.updateOne({
            $addToSet: { allowed: otherUserId, following: otherUserId },
            $pull: { pending: otherUserId, blocked: otherUserId },
        });
        await otherUser.updateOne({
            $addToSet: { allowedBy: user._id, followers: user._id },
            $pull: { pendingBy: user._id, blockedBy: user._id },
        });
        res.status(200).json({ message: "Updated the Allowed User" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateAllowingUserController = UpdateAllowingUserController;
const UpdatePendingUserController = async (req, res) => {
    try {
        const email = req.get("email");
        const otherUserId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const otherUser = await User_1.default.findOne({ _id: otherUserId });
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        await user.updateOne({
            $addToSet: { pendingBy: otherUserId },
            $pull: { allowedBy: otherUserId, blockedBy: otherUserId },
        });
        await otherUser.updateOne({
            $addToSet: { pending: user._id },
            $pull: { allowed: user._id, blocked: user._id },
        });
        res.status(200).json({ message: "Updated the Pending User" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdatePendingUserController = UpdatePendingUserController;
const UpdateBlockingUserController = async (req, res) => {
    try {
        const email = req.get("email");
        const otherUserId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const otherUser = await User_1.default.findOne({ _id: otherUserId });
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        await user.updateOne({
            $addToSet: { blocked: otherUserId },
            $pull: {
                pending: otherUserId,
                allowed: otherUserId,
                following: otherUserId,
                followers: otherUserId,
            },
        });
        await otherUser.updateOne({
            $addToSet: { blockedBy: user._id },
            $pull: {
                pendingBy: user._id,
                allowedBy: user._id,
                following: user._id,
                followers: user._id,
            },
        });
        res.status(200).json({ message: "Updated the Blocked User" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateBlockingUserController = UpdateBlockingUserController;
const UpdateUnblockingUserController = async (req, res) => {
    try {
        const email = req.get("email");
        const otherUserId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const otherUser = await User_1.default.findOne({ _id: otherUserId });
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        await user.updateOne({
            $pull: { blocked: otherUserId },
        });
        await otherUser.updateOne({
            $pull: { blockedBy: user._id },
        });
        res.status(200).json({ message: "Updated the Unblocked User" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateUnblockingUserController = UpdateUnblockingUserController;
const UpdateFollowingUserController = async (req, res) => {
    try {
        const email = req.get("email");
        const otherUserId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const otherUser = await User_1.default.findById(otherUserId);
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        if (otherUser.private) {
            let userCheck = false;
            user.allowed.forEach((u) => {
                if (u.toString() === otherUser._id.toString()) {
                    userCheck = true;
                    return;
                }
            });
            if (!userCheck) {
                await user.updateOne({
                    $addToSet: { pending: otherUserId },
                });
                await otherUser.updateOne({
                    $addToSet: { pendingBy: user._id },
                });
                res
                    .status(200)
                    .json({ message: "Updated the Followed User", pending: true });
                return;
            }
        }
        await user.updateOne({
            $addToSet: { following: otherUserId },
            $pull: {
                blocked: otherUserId,
                allowed: otherUserId,
                pending: otherUserId,
            },
        });
        await otherUser.updateOne({
            $addToSet: { followers: user._id },
            $pull: {
                blockedBy: user._id,
                allowedBy: user._id,
                pendingBy: user._id,
            },
        });
        res
            .status(200)
            .json({ message: "Updated the Followed User", pending: false });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateFollowingUserController = UpdateFollowingUserController;
const UpdateUnfollowingUserController = async (req, res) => {
    try {
        const email = req.get("email");
        const otherUserId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const otherUser = await User_1.default.findById(otherUserId);
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        await user.updateOne({
            $pull: { following: otherUserId },
        });
        await otherUser.updateOne({
            $pull: { followers: user._id },
        });
        res.status(200).json({ message: "Updated the Unfollowed User" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateUnfollowingUserController = UpdateUnfollowingUserController;
const UpdateRemoveFollowerController = async (req, res) => {
    try {
        const email = req.get("email");
        const otherUserId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const otherUser = await User_1.default.findById(otherUserId);
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        await user.updateOne({ $pull: { followers: otherUserId } });
        await otherUser.updateOne({ $pull: { following: user._id } });
        res.status(200).json({ message: "Updated the Unfollowed User" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateRemoveFollowerController = UpdateRemoveFollowerController;
