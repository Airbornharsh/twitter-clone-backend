"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Group = (conversation) => {
    const group = (0, express_1.Router)();
    conversation.use("/group", group);
    // group.post("/", Controllers.CreateGroupController);
};
exports.default = Group;
