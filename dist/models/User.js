"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Users = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    userName: {
        type: String,
        trim: true,
        default: "",
    },
    age: {
        type: Number,
        required: false,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    private: {
        type: Boolean,
        required: false,
        default: false,
    },
    profileImage: {
        type: String,
        required: false,
        default: "",
    },
    coverImage: {
        type: String,
        required: false,
        default: "",
    },
    bio: {
        type: String,
        required: false,
        default: "",
    },
    dob: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
        default: "",
    },
    website: {
        type: String,
        required: false,
        default: "",
    },
    followers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
            default: [],
        },
    ],
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
            default: [],
        },
    ],
    blocked: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
            default: [],
        },
    ],
    allowed: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
            default: [],
        },
    ],
    pending: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
            default: [],
        },
    ],
    blockedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
            default: [],
        },
    ],
    allowedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
            default: [],
        },
    ],
    pendingBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
            default: [],
        },
    ],
    createdAt: {
        type: Date,
        required: false,
        default: Date.now(),
    },
    tweets: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Tweets",
            default: [],
        },
    ],
    likedTweets: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Tweets",
            default: [],
        },
    ],
    bookmarkedTweets: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Tweets",
            default: [],
        },
    ],
    retweetedTweets: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Tweets",
            default: [],
        },
    ],
});
const UserModel = (0, mongoose_1.model)("Users", Users);
exports.default = UserModel;
