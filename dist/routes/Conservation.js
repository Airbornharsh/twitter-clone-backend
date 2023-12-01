"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Controllers_1 = __importDefault(require("../controllers/Controllers"));
const Conservation = (user) => {
    const conservation = (0, express_1.Router)();
    user.use("/conversation", conservation);
    conservation.post("/", Controllers_1.default.CreateConversationController);
    conservation.get("/", Controllers_1.default.GetConservationsController);
    conservation.get("/:id", Controllers_1.default.GetConservationController);
    // conservation.put("/:id", Controllers.UpdateConservationController);
    // conservation.delete("/:id", Controllers.DeleteConservationController);
};
exports.default = Conservation;
