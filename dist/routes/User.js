"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("../controllers/UserController");
const User = (user) => {
    user.get("/", UserController_1.GetUserController);
    user.get("/:otherEmail", UserController_1.GetOtherUserController);
    user.get("/list/", UserController_1.GetUsersController);
    user.get("/allowed/", UserController_1.GetAllowedUsersController);
    user.get("/blocked/", UserController_1.GetBlockedUsersController);
    user.post("/", UserController_1.AddUserController);
    user.put("/", UserController_1.UpdateUserHandler);
    user.put("/privacy/", UserController_1.UpdatePrivacyHandler);
};
exports.default = User;
