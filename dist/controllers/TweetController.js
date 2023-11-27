"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTweetController = exports.GetTweetsController = exports.AddTweetController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const Tweet_1 = __importDefault(require("../models/Tweet"));
const User_1 = __importDefault(require("../models/User"));
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
        const tweets = (await user.populate("tweets")).tweets;
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
