"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let conn;
const connectDB = async () => {
    try {
        exports.DB = conn = await mongoose_1.default.connect(process.env.DB_URI || "mongodb://localhost:27017/database");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
    finally {
        return { conn };
    }
};
exports.default = connectDB;
