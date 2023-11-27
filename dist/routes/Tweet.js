"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const Tweet = (router) => {
    const tweet = (0, express_1.Router)();
    router.use("/tweet", tweet);
    tweet.post("/", Controllers_1.default.AddTweetController);
};
exports.default = Tweet;
