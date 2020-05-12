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
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../facades/user"));
const router = express_1.default.Router();
const apiError_1 = require("../errors/apiError");
const basic_auth_1 = __importDefault(require("../middlewares/basic-auth"));
router.post('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let newUser = req.body;
            newUser.role = "user"; //Even if a hacker tried to "sneak" in his own role, this is what you get
            const status = yield user_1.default.addUser(newUser);
            res.json({ status });
        }
        catch (err) {
            next(err);
        }
    });
});
router.use(basic_auth_1.default);
router.get('/:userName', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const role = req.role;
            if (role != "admin") {
                throw new apiError_1.ApiError("Not Authorized", 403);
            }
            const user_Name = req.params.userName;
            const user = yield user_1.default.getUser(user_Name);
            const { name, userName } = user;
            const userDTO = { name, userName };
            res.json(userDTO);
        }
        catch (err) {
            next(err);
        }
    });
});
router.get('/user/me', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user_Name = req.userName;
            const user = yield user_1.default.getUser(user_Name);
            const { name, userName } = user;
            const userDTO = { name, userName };
            res.json(userDTO);
        }
        catch (err) {
            next(err);
        }
    });
});
router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const role = req.role;
            if (role != "admin") {
                throw new apiError_1.ApiError("Not Authorized", 403);
            }
            const users = yield user_1.default.getAllUsers();
            const usersDTO = users.map((user) => {
                const { name, userName } = user;
                return { name, userName };
            });
            res.json(usersDTO);
        }
        catch (err) {
            next(err);
        }
    });
});
router.delete('/:userName', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const role = req.role;
            if (role != "admin") {
                throw new apiError_1.ApiError("Not Authorized", 403);
            }
            const user_name = req.params.userName;
            const status = yield user_1.default.deleteUser(user_name);
            res.json({ status });
        }
        catch (err) {
            next(err);
        }
    });
});
module.exports = router;
//# sourceMappingURL=userApi.js.map