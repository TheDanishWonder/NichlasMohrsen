"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const expressWinston = __importStar(require("express-winston"));
const path_1 = __importDefault(require("path"));
let requestLoggerTransports = [
    new winston_1.default.transports.File({ filename: path_1.default.join(process.cwd(), "logs", "request.log") })
];
let errorLoggerTransports = [
    new winston_1.default.transports.File({ filename: path_1.default.join(process.cwd(), "logs", "error.log") })
];
if (process.env.NODE_ENV !== 'production') {
    requestLoggerTransports.push(new winston_1.default.transports.Console());
    errorLoggerTransports.push(new winston_1.default.transports.Console());
}
let requestLogger = expressWinston.logger({
    transports: requestLoggerTransports,
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
    expressFormat: true,
    colorize: false
});
exports.requestLogger = requestLogger;
let errorLogger = expressWinston.errorLogger({
    transports: errorLoggerTransports,
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json())
});
exports.errorLogger = errorLogger;
//# sourceMappingURL=logger.js.map