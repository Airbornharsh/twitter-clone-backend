"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const UserList = (user) => {
    const list = (0, express_1.Router)();
    user.use("/list", list);
    list.get("/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetUsersController);
    list.get("/pending/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetPendingUsersController);
    list.get("/allowed/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetAllowedUsersController);
    list.get("/blocked/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetBlockedUsersController);
    list.get("/following/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetFollowingUsersController);
    list.get("/followers/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetFollowersUsersController);
    list.get("/following/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetOtherFollowingUsersController);
    list.get("/followers/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetOtherFollowersUsersController);
};
exports.default = UserList;
