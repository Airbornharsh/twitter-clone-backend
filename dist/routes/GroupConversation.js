"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const GroupConversation = (conversation) => {
    const group = (0, express_1.Router)();
    conversation.use("/group", group);
    //admin
    group.post("/", Controllers_1.default.CreateGroupConversationController);
    group.put("/add/:id", Controllers_1.default.AddGroupConversationMemberController);
    group.put("/remove/:id", Controllers_1.default.RemoveGroupConversationMemberController);
    group.put("/admin/:id", Controllers_1.default.AddGroupConversationAdminController);
    group.delete("/admin/:id", Controllers_1.default.RemoveGroupConversationAdminController);
    //user
    group.put("/leave/:id", Controllers_1.default.LeaveGroupConversationController);
};
exports.default = GroupConversation;
