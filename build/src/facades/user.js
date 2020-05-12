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
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_async_helper_1 = require("../utils/bcrypt-async-helper");
const debug = require("debug")("game-project");
const apiError_1 = require("../errors/apiError");
function dummyReturnPromise(val, err = "Unknown Error", code = 500) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!val) {
                reject(new apiError_1.ApiError(err, code));
            }
            else
                resolve(val);
        }, 0);
    });
}
class UserFacade {
    static addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_async_helper_1.bryptAsync(user.password);
            let newUser = Object.assign(Object.assign({}, user), { password: hash });
            UserFacade.users.push(newUser);
            return dummyReturnPromise("User was added");
        });
    }
    static deleteUser(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newArray = UserFacade.users.filter(u => u.userName != userName);
            UserFacade.users = [...newArray];
            return dummyReturnPromise("User was deleted");
        });
    }
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return dummyReturnPromise(UserFacade.users);
        });
    }
    static getUser(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            user = UserFacade.users.find(u => u.userName === userName);
            if (user) {
                return dummyReturnPromise(user);
            }
            return dummyReturnPromise(null, "User Not Found", 404);
        });
    }
    static checkUser(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                user = yield UserFacade.getUser(userName);
                return bcrypt_async_helper_1.bryptCheckAsync(password, user.password);
            }
            catch (err) {
                return dummyReturnPromise(false);
            }
        });
    }
}
exports.default = UserFacade;
UserFacade.users = [
    { name: "Peter Pan", userName: "pp@b.dk", password: "secret", role: "user" },
    { name: "Donald Duck", userName: "dd@b.dk", password: "secret", role: "user" },
    { name: "admin", userName: "admin@a.dk", password: "secret", role: "admin" }
];
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("testing");
        yield UserFacade.addUser({ name: "kim", userName: "kim@b.dk", password: "secret", role: "user" });
        yield UserFacade.addUser({ name: "ole", userName: "ole@b.dk", password: "secret", role: "user" });
        const all = yield (yield UserFacade.getAllUsers()).length;
        debug("users", all);
        const peter = yield UserFacade.getUser("kim@b.dk");
        debug("Found Kim", peter.userName);
        yield UserFacade.deleteUser("ole@b.dk");
        try {
            const donald = yield UserFacade.getUser("ole@b.dk");
        }
        catch (err) {
            debug("Could not find ole", err);
        }
        try {
            const ok = yield UserFacade.checkUser("kim@b.dk", "secret");
            debug("Password and user was OK", ok);
            yield UserFacade.checkUser("pp@b.dk", "wrong password");
            debug("I should not get here");
        }
        catch (err) {
            debug("Password did not match");
        }
    });
}
//test();
//# sourceMappingURL=user.js.map