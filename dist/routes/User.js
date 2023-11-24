"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const User = (user) => {
    user.post("/", Controllers_1.default.AddUserController);
    user.get("/", Controllers_1.default.GetUserController);
    user.get("/other/:id", Controllers_1.default.GetOtherUserController);
    user.put("/", Controllers_1.default.UpdateUserHandler);
    user.put("/privacy/", Controllers_1.default.UpdatePrivacyHandler);
    user.put("/privacy/allowed/:id", Controllers_1.default.UpdateAllowedUserController);
    user.put("/privacy/pending/:id", Controllers_1.default.UpdatePendingUserController);
    user.put("/privacy/blocked/:id", Controllers_1.default.UpdateBlockedUserController);
    user.put("/privacy/unblocked/:id", Controllers_1.default.UpdateUnblockedUserController);
    user.put("/privacy/unallowed/:id", Controllers_1.default.UpdateFollowedUserController);
    // user.get("/list/", GetUsersController);
    // user.get("/pending/", GetPendingUsersController);
    // user.get("/allowed/", GetAllowedUsersController);
    // user.get("/blocked/", GetBlockedUsersController);
};
exports.default = User;
