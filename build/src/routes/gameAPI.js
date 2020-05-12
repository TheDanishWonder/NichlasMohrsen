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
const gameFacade_1 = __importDefault(require("../facades/gameFacade"));
const router = express_1.default.Router();
//import * as mongo from "mongodb"
const setupDB_1 = __importDefault(require("../config/setupDB"));
(function setupDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield setupDB_1.default();
        gameFacade_1.default.setDatabase(client);
    });
})();
router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.json({ "msg": "Welcome to the Game API!" });
    });
});
router.post('/nearbyplayers', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userName = req.body.userName;
            const password = req.body.password;
            const longitude = req.body.lon;
            const latitude = req.body.lat;
            const distance = req.body.distance;
            const found = yield gameFacade_1.default.nearbyPlayers(userName, password, longitude, latitude, distance);
            res.json(found);
        }
        catch (err) {
            next(err);
        }
    });
});
router.post('/getPostIfReached', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        throw new Error("Not yet implemented");
    });
});
module.exports = router;
//# sourceMappingURL=gameAPI.js.map