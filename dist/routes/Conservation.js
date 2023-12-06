"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const GroupConversation_1 = __importDefault(require("./GroupConversation"));
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const Conservation = (user) => {
    const conservation = (0, express_1.Router)();
    user.use("/conversation", conservation);
    (0, GroupConversation_1.default)(conservation);
    conservation.post("/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.CreateConversationController);
    conservation.get("/", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetConservationsController);
    conservation.get("/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetConservationController);
    conservation.get("/user/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.GetUserConservationController);
    conservation.put("/send/:id", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.SendMessageController);
    conservation.put("/read/:id/:messageId", AuthMiddleware_1.AuthenticateUser, Controllers_1.default.ReadMessageController);
    // conservation.delete("/:id", Controllers.DeleteConservationController);
};
exports.default = Conservation;
