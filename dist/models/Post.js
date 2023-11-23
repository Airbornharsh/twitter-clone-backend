"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Posts = new mongoose_1.Schema({
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
    name: {
        type: String,
        required: true,
    },
    postImage: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
});
const PostModel = (0, mongoose_1.model)("Posts", Posts);
exports.default = PostModel;
