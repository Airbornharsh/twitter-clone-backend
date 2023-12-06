"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const Privacy = (user) => {
    const privacy = (0, express_1.Router)();
    user.use("/privacy", privacy);
    privacy.put("/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdatePrivacyHandler);
    privacy.put("/pending/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdatePendingUserController);
    privacy.put("/unpending/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdateUnpendingUserController);
    privacy.put("/allowing/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdateAllowingUserController);
    privacy.put("/denying/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdateDenyingUserController);
    privacy.put("/blocking/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdateBlockingUserController);
    privacy.put("/unblocking/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdateUnblockingUserController);
    privacy.put("/following/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdateFollowingUserController);
    privacy.put("/unfollowing/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.UpdateUnfollowingUserController);
    privacy.put("/follower/remove/:id", Controllers_1.default.UpdateRemoveFollowerController);
};
exports.default = Privacy;
