"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersController = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const User_1 = __importDefault(require("../models/User"));
const GetUsersController = async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.status(200).json({ message: "Users fetched successfully!", users });
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.GetUsersController = GetUsersController;
