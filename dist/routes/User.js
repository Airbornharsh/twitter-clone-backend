"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const Privacy_1 = __importDefault(require("./Privacy"));
const UserList_1 = __importDefault(require("./UserList"));
const User = (router) => {
    const user = (0, express_1.Router)();
    router.use("/user", user);
    user.post("/", Controllers_1.default.AddUserController);
    user.get("/", Controllers_1.default.GetUserController);
    user.get("/other/:id", Controllers_1.default.GetOtherUserController);
    user.put("/", Controllers_1.default.UpdateUserHandler);
    (0, Privacy_1.default)(user);
    (0, UserList_1.default)(user);
};
exports.default = User;
