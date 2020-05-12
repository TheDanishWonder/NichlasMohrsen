"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
  See this article for details about custom errors:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
*/
class ApiError extends Error {
    constructor(msg, errorCode) {
        super(msg);
        this.errorCode = errorCode;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
        this.name = 'ApiError';
        this.errorCode = errorCode || 500;
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=apiError.js.map