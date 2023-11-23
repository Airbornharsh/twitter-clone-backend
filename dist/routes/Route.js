"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("./User"));
const Post_1 = __importDefault(require("./Post"));
const Route = (router) => {
    router.get("/", (req, res) => {
        res.send("Hello World!");
    });
    const user = (0, express_1.Router)();
    const post = (0, express_1.Router)();
    router.use("/user", user);
    router.use("/post", post);
    (0, User_1.default)(user);
    (0, Post_1.default)(post);
};
exports.default = Route;
