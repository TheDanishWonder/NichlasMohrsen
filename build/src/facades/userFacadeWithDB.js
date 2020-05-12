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
const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env") });
const bcrypt_async_helper_1 = require("../utils/bcrypt-async-helper");
const setupDB_1 = __importDefault(require("../../config/setupDB"));
const apiError_1 = require("../errors/apiError");
let userCollection;
class UserFacade {
    static setDatabase(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbName = process.env.DB_NAME;
            if (!dbName) {
                throw new Error("Database name not provided");
            }
            try {
                if (!client.isConnected()) {
                    yield client.connect();
                }
                userCollection = client.db(dbName).collection("users");
                yield userCollection.createIndex({ userName: 1 }, { unique: true });
                return client.db(dbName);
            }
            catch (err) {
                console.error("Could not create connect", err);
            }
        });
    }
    static addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_async_helper_1.bryptAsync(user.password);
            let newUser = Object.assign(Object.assign({}, user), { password: hash });
            try {
                const result = yield userCollection.insertOne(newUser);
                return result + " was added";
            }
            catch (err) {
                if (err.code === 11000) {
                    throw new apiError_1.ApiError("This userName is already taken", 400);
                }
                //This should probably be logged
                throw new apiError_1.ApiError(err.errmsg, 400);
            }
        });
    }
    static deleteUser(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield userCollection.findOneAndDelete({ userName });
            if (status.value) {
                return "User was deleted";
            }
            throw new apiError_1.ApiError("User was not deleted", 400);
        });
    }
    //static async getAllUsers(): Promise<Array<IGameUser>> {
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const all = yield userCollection.find({}, { projection: { name: 1, userName: 1, _id: 0 } });
            return all.toArray();
        });
    }
    static getUser(userName, proj) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userCollection.findOne({ userName }, { projection: proj });
            if (!user) {
                throw new apiError_1.ApiError("User not found", 404);
            }
            else {
                return user;
            }
        });
    }
    static checkUser(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let userPassword = "";
            try {
                const user = yield UserFacade.getUser(userName);
                userPassword = user.password;
            }
            catch (err) { }
            const status = yield bcrypt_async_helper_1.bryptCheckAsync(password, userPassword);
            return status;
        });
    }
}
exports.default = UserFacade;
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("testing");
        const client = yield setupDB_1.default();
        yield UserFacade.setDatabase(client);
        yield userCollection.deleteMany({});
        yield UserFacade.addUser({
            name: "kim",
            userName: "kim@b.dk",
            password: "secret",
            role: "user"
        });
        yield UserFacade.addUser({
            name: "ole",
            userName: "ole@b.dk",
            password: "secret",
            role: "user"
        });
        const all = yield UserFacade.getAllUsers();
        //console.log(all)
        const projection = { _id: 0, role: 0, password: 0 };
        const kim = yield UserFacade.getUser("kim@b.dk", projection);
        console.log(kim);
        try {
            let status = yield UserFacade.deleteUser("kim@b.dk");
            console.log(status);
            status = yield UserFacade.deleteUser("xxxx@b.dk");
            console.log("Should not get here");
        }
        catch (err) {
            console.log(err.message);
        }
        try {
            const passwordStatus = yield UserFacade.checkUser("kim@b.dk", "secret");
            console.log("Expects true: ", passwordStatus);
        }
        catch (err) {
            console.log("Should not get here 1", err);
        }
        try {
            const passwordStatus = yield UserFacade.checkUser("kim@b.dk", "xxxx");
            console.log("Should not get here ", passwordStatus);
        }
        catch (err) {
            console.log("Should get here with failded 2", err);
        }
        try {
            const passwordStatus = yield UserFacade.checkUser("xxxx@b.dk", "secret");
            console.log("Should not get here");
        }
        catch (err) {
            console.log("Should get here with failded 2", err);
        }
        client.close();
    });
}
//test();
//# sourceMappingURL=userFacadeWithDB.js.map