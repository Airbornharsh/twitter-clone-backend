"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
const Tweet_1 = __importDefault(require("./Tweet"));
const Route = (router) => {
    router.get("/", (req, res) => {
        res.send("Hello World!");
    });
    (0, User_1.default)(router);
    (0, Tweet_1.default)(router);
};
exports.default = Route;
