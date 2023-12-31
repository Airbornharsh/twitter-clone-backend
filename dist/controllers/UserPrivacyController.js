"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRemoveFollowerController = exports.UpdateUnfollowingUserController = exports.UpdateFollowingUserController = exports.UpdateUnblockingUserController = exports.UpdateBlockingUserController = exports.UpdateUnpendingUserController = exports.UpdateDenyingUserController = exports.UpdatePendingUserController = exports.UpdateAllowingUserController = exports.UpdatePrivacyHandler = void 0;
const User_1 = __importDefault(require("../models/User"));
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const Notification_1 = require("../models/Notification");
const UpdatePrivacyHandler = async (req, res) => {
    try {
        const user = res.locals.user;
        const privacy = req.body.private;
        await User_1.default.findOneAndUpdate({ _id: user._id }, { private: privacy });
        res.status(200).json({ message: "Updated the Private" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdatePrivacyHandler = UpdatePrivacyHandler;
const UpdateAllowingUserController = async (req, res) => {
    try {
        const user = res.locals.user;
        const otherUserId = req.params.id;
        const otherUser = await User_1.default.findOne({ _id: otherUserId });
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        await user.updateOne({
            $addToSet: { allowed: otherUserId, followers: otherUserId },
            $pull: { pending: otherUserId, blocked: otherUserId },
        });
        await otherUser.updateOne({
            $addToSet: { allowedBy: user._id, following: user._id },
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
        const user = res.locals.user;
        const otherUserId = req.params.id;
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
const UpdateDenyingUserController = async (req, res) => {
    try {
        const user = res.locals.user;
        const otherUserId = req.params.id;
        const otherUser = await User_1.default.findOne({ _id: otherUserId });
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        await user.updateOne({
            $pull: { pending: otherUserId },
        });
        await otherUser.updateOne({
            $pull: { pendingBy: user._id },
        });
        res.status(200).json({ message: "Updated the Denied User" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateDenyingUserController = UpdateDenyingUserController;
const UpdateUnpendingUserController = async (req, res) => {
    try {
        const user = res.locals.user;
        const otherUserId = req.params.id;
        const otherUser = await User_1.default.findOne({ _id: otherUserId });
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        await user.updateOne({
            $pull: { pendingBy: otherUserId },
        });
        await otherUser.updateOne({
            $pull: { pending: user._id },
        });
        res.status(200).json({ message: "Updated the Cancelled Pending User" });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateUnpendingUserController = UpdateUnpendingUserController;
const UpdateBlockingUserController = async (req, res) => {
    try {
        const user = res.locals.user;
        const otherUserId = req.params.id;
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
        const user = res.locals.user;
        const otherUserId = req.params.id;
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
        const user = res.locals.user;
        const otherUserId = req.params.id;
        const otherUser = await User_1.default.findById(otherUserId);
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        if (otherUser.private) {
            await otherUser.updateOne({
                $addToSet: { pending: user._id },
            });
            await user.updateOne({
                $addToSet: { pendingBy: otherUser._id },
            });
            res
                .status(200)
                .json({ message: "Updated the Followed User", pending: true });
            return;
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
        const FollowNotification = await Notification_1.FollowNotificationModel.create({
            from: user._id,
        });
        const notification = await Notification_1.NotificationModel.create({
            to: otherUser._id,
            followNotification: FollowNotification._id,
        });
        await User_1.default.findByIdAndUpdate(otherUser._id, {
            $push: { notifications: notification._id },
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
        const user = res.locals.user;
        const otherUserId = req.params.id;
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
        const user = res.locals.user;
        const otherUserId = req.params.id;
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
