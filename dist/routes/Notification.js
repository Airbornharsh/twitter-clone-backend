"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Notification = (user) => {
    const notification = (0, express_1.Router)();
    user.use("/notification", notification);
    notification.get("/", (req, res) => {
        res.json({ message: "Hello from notification!" });
    });
};
exports.default = Notification;
