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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
require('dotenv').config({ path: path_1.default.join(process.cwd(), '.env') });
const mongo = __importStar(require("mongodb"));
const bcrypt_async_helper_1 = require("./bcrypt-async-helper");
const MongoClient = mongo.MongoClient;
const uri = process.env.CONNECTION || "";
//const uri = "mongodb+srv://fullstackUser:lyngbymongo@fullstack-cluster-ikeoi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
(function makeTestData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const db = client.db(process.env.DB_NAME);
            const usersCollection = db.collection("users");
            yield usersCollection.deleteMany({});
            const secretHashed = yield bcrypt_async_helper_1.bryptAsync("secret");
            const status = yield usersCollection.insertMany([
                { name: "Peter Pan", userName: "pp@b.dk", password: secretHashed, role: "user" },
                { name: "Donald Duck", userName: "dd@b.dk", password: secretHashed, role: "user" },
                { name: "admin", userName: "admin@a.dk", password: secretHashed, role: "admin" }
            ]);
            console.log(`Inserted ${status.insertedCount} test users`);
            console.log(`NEVER, NEVER, NEVER run this on a production database`);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            client.close();
        }
    });
})();
//# sourceMappingURL=makeTestData.js.map