"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = require('http');
var auth = require('basic-auth');
var compare = require('tsscmp');
const user_1 = __importDefault(require("../facades/user"));
// Create server
var authMiddleware = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var credentials = auth(req);
        try {
            if (credentials && (yield user_1.default.checkUser(credentials.name, credentials.pass))) {
                const user = yield user_1.default.getUser(credentials.name);
                req.userName = user.userName;
                req.role = user.role;
                return next();
            }
        }
        catch (err) { }
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
    });
};
exports.default = authMiddleware;
//# sourceMappingURL=basic-auth.js.map