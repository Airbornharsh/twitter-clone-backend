"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OtherTweet = (tweet) => {
    const otherTweet = (0, express_1.Router)();
    tweet.use("/other", otherTweet);
};
exports.default = OtherTweet;
