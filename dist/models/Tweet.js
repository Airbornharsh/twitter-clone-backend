"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Tweets = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    tweetMedia: [
        {
            type: String,
            required: false,
        },
    ],
    email: {
        type: String,
        required: true,
        trim: true,
    },
    likedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    bookmarkedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    reply: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tweets",
        default: null,
    },
    tweetReply: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Tweets",
        },
    ],
});
const TweetModel = (0, mongoose_1.model)("Tweets", Tweets);
exports.default = TweetModel;
