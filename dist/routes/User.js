"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("../controllers/UserController");
const User = (user) => {
    user.post("/", UserController_1.AddUserController);
    user.get("/", UserController_1.GetUserController);
    user.get("/other/:id", UserController_1.GetOtherUserController);
    user.put("/privacy/", UserController_1.UpdatePrivacyHandler);
    // user.get("/list/", GetUsersController);
    // user.get("/pending/", GetPendingUsersController);
    // user.get("/allowed/", GetAllowedUsersController);
    // user.get("/blocked/", GetBlockedUsersController);
    // user.put("/", UpdateUserHandler);
};
exports.default = User;
