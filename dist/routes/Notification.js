"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const Notification = (user) => {
    const notification = (0, express_1.Router)();
    user.use("/notification", notification);
    notification.get("/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetNotificationsController);
};
exports.default = Notification;
