"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUser = void 0;
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const User_1 = __importDefault(require("../models/User"));
const Firebase_1 = require("../config/Firebase");
const AuthenticateUser = async (req, res, next) => {
    try {
        const token = req.get("token");
        if (!token) {
            res.status(401).json({ message: "Unauthorized!" });
            return;
        }
        const decodedToken = await Firebase_1.firebaseAuth.verifyIdToken(token);
        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized!" });
            return;
        }
        const user = await User_1.default.findOne({ email: decodedToken.email });
        if (!user) {
            res.status(401).json({ message: "Unauthorized!" });
            return;
        }
        res.locals.user = user;
        next();
    }
    catch (e) {
        (0, ErrorHelper_1.ErrorResponse)(res, 500, e);
    }
};
exports.AuthenticateUser = AuthenticateUser;
