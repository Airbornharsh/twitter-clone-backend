"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const OtherTweet_1 = __importDefault(require("./OtherTweet"));
const Tweet = (router) => {
    const tweet = (0, express_1.Router)();
    router.use("/tweet", tweet);
    (0, OtherTweet_1.default)(tweet);
    tweet.post("/", Controllers_1.default.AddTweetController);
    tweet.get("/", Controllers_1.default.GetTweetsController);
    tweet.get("/replies", Controllers_1.default.GetTweetsRepliesController);
    tweet.get("/:id", Controllers_1.default.GetTweetController);
    tweet.patch("/like/:id", Controllers_1.default.UpdateTweetLikeController);
    tweet.patch("/bookmark/:id", Controllers_1.default.UpdateTweetBookmarkController);
    tweet.post("/reply/:id", Controllers_1.default.AddTweetReplyHandler);
};
exports.default = Tweet;
