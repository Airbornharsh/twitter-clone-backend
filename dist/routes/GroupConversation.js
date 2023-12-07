"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const GroupConversation = (conversation) => {
    const group = (0, express_1.Router)();
    conversation.use("/group", group);
    //admin
    group.post("/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AdminCreateGroupConversationController);
    group.get("/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetGroupConversationsController);
    group.get("/search/:name", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.SearchGroupConversationController);
    group.get("/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetGroupConversationController);
    group.put("/update/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AdminUpdateGroupConversationController);
    group.put("/add/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AdminAddGroupConversationMemberController);
    group.put("/remove/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AdminRemoveGroupConversationMemberController);
    group.put("/makeadmin/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AdminAddGroupConversationAdminController);
    group.put("/removeadmin/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AdminRemoveGroupConversationAdminController);
    group.patch("/allow/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AdminAllowGroupConversationController);
    group.patch("/deny/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AdminDenyGroupConversationController);
    group.delete("/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.AdminDeleteGroupConversationController);
    group.put("/leave/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.LeaveGroupConversationController);
    group.put("/join/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.JoinGroupConversationController);
    group.post("/message/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.SendMessageToGroupConversationController);
    group.get("/video/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetGroupVideoTokenConversationController);
    // group.patch("/read/:id", Controllers.ReadGroupMessageController);
};
exports.default = GroupConversation;
