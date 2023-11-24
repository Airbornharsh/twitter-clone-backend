"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("../controllers/UserController");
const User = (user) => {
    user.post("/", UserController_1.AddUserController);
    user.get("/", UserController_1.GetUserController);
    user.get("/other/:id", UserController_1.GetOtherUserController);
    user.put("/", UserController_1.UpdateUserHandler);
    user.put("/privacy/", UserController_1.UpdatePrivacyHandler);
    user.put("/privacy/allowed/:id", UserController_1.UpdateAllowedUserController);
    user.put("/privacy/pending/:id", UserController_1.UpdatePendingUserController);
    // user.get("/list/", GetUsersController);
    // user.get("/pending/", GetPendingUsersController);
    // user.get("/allowed/", GetAllowedUsersController);
    // user.get("/blocked/", GetBlockedUsersController);
};
exports.default = User;
