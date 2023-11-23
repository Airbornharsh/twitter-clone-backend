"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
const ErrorResponse = (res, code, error) => {
    console.log(error);
    res.status(code).json({
        error: error.message || "Server Error",
    });
};
exports.ErrorResponse = ErrorResponse;
