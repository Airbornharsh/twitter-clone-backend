"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const OtherTweet = (tweet) => {
    const otherTweet = (0, express_1.Router)();
    tweet.use("/other", otherTweet);
    otherTweet.get("/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetAllOtherTweetController);
    otherTweet.get("/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetOtherTweetController);
    otherTweet.get("/list/:otherUserId", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetOtherTweetsController);
    otherTweet.get("/list/replies/:otherUserId", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetOtherTweetsRepliesController);
};
exports.default = OtherTweet;
