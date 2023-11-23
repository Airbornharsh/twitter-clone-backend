"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PrivacyUser = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    allowed: {
        type: Boolean,
        required: true,
        default: false,
    },
    otherUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
});
const PrivacyUserModel = (0, mongoose_1.model)("PrivacyUsers", PrivacyUser);
exports.default = PrivacyUserModel;
