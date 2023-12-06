"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const OtherTweet_1 = __importDefault(require("./OtherTweet"));
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const Tweet = (router) => {
    const tweet = (0, express_1.Router)();
    router.use("/tweet", tweet);
    (0, OtherTweet_1.default)(tweet);
    tweet.post("/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AddTweetController);
    tweet.get("/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetTweetsController);
    tweet.get("/replies", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetTweetsRepliesController);
    tweet.get("/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetTweetController);
    tweet.patch("/like/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdateTweetLikeController);
    tweet.patch("/bookmark/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdateTweetBookmarkController);
    tweet.post("/reply/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AddTweetReplyHandler);
};
exports.default = Tweet;
