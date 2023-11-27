"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Tweet = (router) => {
    const tweet = (0, express_1.Router)();
    router.use("/post", tweet);
    tweet.post("/");
};
exports.default = Tweet;
