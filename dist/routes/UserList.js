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
    list.get("/pending/", Controllers_1.default.GetPendingUsersController);
    list.get("/allowed/", Controllers_1.default.GetAllowedUsersController);
    list.get("/blocked/", Controllers_1.default.GetBlockedUsersController);
};
exports.default = UserList;