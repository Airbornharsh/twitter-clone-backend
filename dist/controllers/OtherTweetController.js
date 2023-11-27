"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOtherTweetController = exports.GetOtherTweetsController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const User_1 = __importDefault(require("../models/User"));
const Tweet_1 = __importDefault(require("../models/Tweet"));
const TweetHelper_1 = require("../helpers/TweetHelper");
const GetOtherTweetsController = async (req, res) => {
    try {
        const email = req.get("email");
        const otherUserId = req.params.otherUserId;
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
        if (!(0, TweetHelper_1.isAuthorised)(user, otherUser)) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const tweets = (await otherUser.populate("tweets")).tweets;
        res.status(200).json({ message: "Tweets fetched successfully!", tweets });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetOtherTweetsController = GetOtherTweetsController;
const GetOtherTweetController = async (req, res) => {
    try {
        const email = req.get("email");
        const otherTweetId = req.params.id;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        const tweet = await Tweet_1.default.findById(otherTweetId);
        if (!tweet) {
            res.status(404).json({ message: "Tweet not found!" });
            return;
        }
        const otherUser = await User_1.default.findById(tweet.userId);
        if (!otherUser) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        if (!(0, TweetHelper_1.isAuthorised)(user, otherUser)) {
            res.status(401).json({ message: "User not allowed!" });
            return;
        }
        res.status(200).json({ message: "Tweet found!", tweet });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetOtherTweetController = GetOtherTweetController;
