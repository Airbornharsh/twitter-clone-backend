"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const OtherTweet = (tweet) => {
    const otherTweet = (0, express_1.Router)();
    tweet.use("/other", otherTweet);
    otherTweet.get("/:id", Controllers_1.default.GetOtherTweetController);
    otherTweet.get("/list/:otherUserId", Controllers_1.default.GetOtherTweetsController);
};
exports.default = OtherTweet;
