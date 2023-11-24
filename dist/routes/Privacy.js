"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const Privacy = (user) => {
    const privacy = (0, express_1.Router)();
    user.use("/privacy", privacy);
    privacy.put("/", Controllers_1.default.UpdatePrivacyHandler);
    privacy.put("/pending/:id", Controllers_1.default.UpdatePendingUserController);
    privacy.put("/allowing/:id", Controllers_1.default.UpdateAllowingUserController);
    privacy.put("/blocking/:id", Controllers_1.default.UpdateBlockingUserController);
    privacy.put("/unblocking/:id", Controllers_1.default.UpdateUnblockingUserController);
    privacy.put("/following/:id", Controllers_1.default.UpdateFollowingUserController);
    privacy.put("/unfollowing/:id", Controllers_1.default.UpdateUnfollowingUserController);
    privacy.put("/follower/remove/:id", Controllers_1.default.UpdateRemoveFollowerController);
};
exports.default = Privacy;
