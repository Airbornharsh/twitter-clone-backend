"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTweetBookmarkController = exports.UpdateTweetLikeController = exports.AddTweetReplyHandler = exports.GetTweetsRepliesController = exports.GetTweetController = exports.GetTweetsController = exports.AddTweetController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const Tweet_1 = __importDefault(require("../models/Tweet"));
const User_1 = __importDefault(require("../models/User"));
const TweetHelper_1 = require("../helpers/TweetHelper");
const Notification_1 = require("../models/Notification");
const AddTweetController = async (req, res) => {
    try {
        const email = req.get("email");
        const { title, tweetMedia } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        if (!title) {
            res.status(400).json({ message: "Title is required!" });
            return;
        }
        if ((0, TweetHelper_1.filterTweet)(title).includes("🤐")) {
            res.status(400).json({ message: "Tweet contains bad words!" });
            return;
        }
        if (tweetMedia && typeof tweetMedia !== "object" && tweetMedia.length > 4) {
            res.status(400).json({ message: "Media cannot be more than 4!" });
            return;
        }
        const tweet = await Tweet_1.default.create({
            userId: user._id,
            email: user.email,
            title,
            tweetMedia,
        });
        await user.updateOne({ $push: { tweets: tweet._id } }).exec();
        res.status(200).json({ message: "Tweet added successfully!", tweet });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AddTweetController = AddTweetController;
const GetTweetsController = async (req, res) => {
    try {
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const tweets = (await user.populate("tweets")).tweets
            .sort((a, b) => b.createdAt - a.createdAt)
            .filter((tweet) => !tweet.reply);
        res.status(200).json({ message: "Tweets fetched successfully!", tweets });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetTweetsController = GetTweetsController;
const GetTweetController = async (req, res) => {
    try {
        const email = req.get("email");
        const tweetId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const tweet = await Tweet_1.default.findOne({ _id: tweetId, userId: user._id });
        if (!tweet) {
            res.status(404).json({ message: "Tweet not found!" });
            return;
        }
        res.status(200).json({ message: "Tweet fetched successfully!", tweet });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetTweetController = GetTweetController;
const GetTweetsRepliesController = async (req, res) => {
    try {
        console.log("Water");
        const email = req.get("email");
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const tweets = (await user.populate("retweetedTweets")).retweetedTweets.sort((a, b) => b.createdAt - a.createdAt);
        res.status(200).json({ message: "Tweets fetched successfully!", tweets });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetTweetsRepliesController = GetTweetsRepliesController;
const AddTweetReplyHandler = async (req, res) => {
    try {
        const email = req.get("email");
        const tweetId = req.params.id;
        const { title, tweetMedia } = req.body;
        if (!title) {
            res.status(400).json({ message: "Title is required!" });
            return;
        }
        if ((0, TweetHelper_1.filterTweet)(title).includes("🤐")) {
            res.status(400).json({ message: "Tweet contains bad words!" });
            return;
        }
        if (tweetMedia && typeof tweetMedia !== "object" && tweetMedia.length > 4) {
            res.status(400).json({ message: "Media cannot be more than 4!" });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const tweet = await Tweet_1.default.findById(tweetId);
        if (!tweet) {
            res.status(404).json({ message: "Tweet not found!" });
            return;
        }
        const replyTweet = await Tweet_1.default.create({
            userId: user._id,
            email: user.email,
            title,
            tweetMedia,
            reply: tweetId,
        });
        await user
            .updateOne({
            $push: { tweets: replyTweet._id, retweetedTweets: replyTweet._id },
        })
            .exec();
        await tweet.updateOne({ $push: { tweetReply: replyTweet._id } }).exec();
        const replyNotification = await Notification_1.ReplyNotificationModel.create({
            from: user._id,
            tweetId,
        });
        const notification = await Notification_1.NotificationModel.create({
            to: tweet.userId,
            tweetId,
            type: "replynotifications",
            notificationId: replyNotification._id,
        });
        await User_1.default.findByIdAndUpdate(tweet.userId, {
            $push: { notifications: notification._id },
        }).exec();
        res
            .status(200)
            .json({ message: "Tweet reply added successfully!", tweet: replyTweet });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AddTweetReplyHandler = AddTweetReplyHandler;
const UpdateTweetLikeController = async (req, res) => {
    try {
        const email = req.get("email");
        const tweetId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const tweet = await Tweet_1.default.findById(tweetId);
        if (!tweet) {
            res.status(404).json({ message: "Tweet not found!" });
            return;
        }
        const isLiked = tweet.likedBy.includes(user._id);
        if (isLiked) {
            await tweet.updateOne({ $pull: { likedBy: user._id } }).exec();
            await user.updateOne({ $pull: { likedTweets: tweet._id } }).exec();
        }
        else {
            await tweet.updateOne({ $push: { likedBy: user._id } }).exec();
            await user.updateOne({ $push: { likedTweets: tweet._id } }).exec();
            const likeNotification = await Notification_1.LikeNotificationModel.create({
                from: user._id,
                tweetId,
            });
            const notification = await Notification_1.NotificationModel.create({
                to: tweet.userId,
                tweetId,
                type: "likenotifications",
                notificationId: likeNotification._id,
            });
            await User_1.default.findByIdAndUpdate(tweet.userId, {
                $push: { notifications: notification._id },
            }).exec();
        }
        res
            .status(200)
            .json({ message: "Tweet updated successfully!", isLiked: !isLiked });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateTweetLikeController = UpdateTweetLikeController;
const UpdateTweetBookmarkController = async (req, res) => {
    try {
        const email = req.get("email");
        const tweetId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const tweet = await Tweet_1.default.findById(tweetId);
        if (!tweet) {
            res.status(404).json({ message: "Tweet not found!" });
            return;
        }
        const isBookmarked = tweet.bookmarkedBy.includes(user._id);
        if (isBookmarked) {
            await tweet.updateOne({ $pull: { bookmarkedBy: user._id } }).exec();
            await user.updateOne({ $pull: { bookmarkedTweets: tweet._id } }).exec();
        }
        else {
            await tweet.updateOne({ $push: { bookmarkedBy: user._id } }).exec();
            await user.updateOne({ $push: { bookmarkedTweets: tweet._id } }).exec();
        }
        res.status(200).json({
            message: "Tweet updated successfully!",
            isBookmarked: !isBookmarked,
        });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.UpdateTweetBookmarkController = UpdateTweetBookmarkController;
