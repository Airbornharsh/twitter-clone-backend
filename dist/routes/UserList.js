"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const UserList = (user) => {
    const list = (0, express_1.Router)();
    user.use("/list", list);
    list.get("/", Controllers_1.default.GetUsersController);
    // user.get("/list/", GetUsersController);
    // user.get("/pending/", GetPendingUsersController);
    // user.get("/allowed/", GetAllowedUsersController);
    // user.get("/blocked/", GetBlockedUsersController);
};
exports.default = UserList;
