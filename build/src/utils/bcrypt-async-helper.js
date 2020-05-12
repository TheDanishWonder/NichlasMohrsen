"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcryptjs"));
const SALT_ROUNDS = 10;
const bryptAsync = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(SALT_ROUNDS, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    reject(err);
                }
                return resolve(hash);
            });
        });
    });
};
exports.bryptAsync = bryptAsync;
const bryptCheckAsync = (password, hashed) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashed, function (err, res) {
            if (err || !res) {
                reject(false);
            }
            return resolve(true);
        });
    });
};
exports.bryptCheckAsync = bryptCheckAsync;
//# sourceMappingURL=bcrypt-async-helper.js.map