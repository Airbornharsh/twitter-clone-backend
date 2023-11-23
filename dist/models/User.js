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
    },
    coverImage: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    dob: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    website: {
        type: String,
        required: false,
    },
});
const UserModel = (0, mongoose_1.model)("Users", Users);
exports.default = UserModel;
