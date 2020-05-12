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
const apiError_1 = require("../errors/apiError");
const userFacadeWithDB_1 = __importDefault(require("./userFacadeWithDB"));
const collectionNames_1 = require("../config/collectionNames");
let userCollection;
let positionsCollection;
let postCollection;
const EXPIRES_AFTER = 30;
class GameFacade {
    static setDatabase(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbName = process.env.DB_NAME;
            if (!dbName) {
                throw new Error("Database name not provided");
            }
            //This facade uses the UserFacade, so set it up with the right client
            yield userFacadeWithDB_1.default.setDatabase(client);
            try {
                if (!client.isConnected()) {
                    yield client.connect();
                }
                // User Collection
                userCollection = client.db(dbName).collection(collectionNames_1.USER_COLLECTION_NAME);
                // Position Collection
                positionsCollection = client
                    .db(dbName)
                    .collection(collectionNames_1.POSITION_COLLECTION_NAME);
                yield positionsCollection.createIndex({ lastUpdated: 1 }, { expireAfterSeconds: EXPIRES_AFTER });
                yield positionsCollection.createIndex({ location: "2dsphere" });
                //TODO uncomment if you plan to do this part of the exercise
                //postCollection = client.db(dbName).collection(POST_COLLECTION_NAME);
                //TODO If you do this part, create 2dsphere index on location
                //await postCollection.createIndex({ location: "2dsphere" })
                return client.db(dbName);
            }
            catch (err) {
                console.error("Could not connect", err);
            }
        });
    }
    static nearbyPlayers(userName, password, longitude, latitude, distance) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            try {
                let status = yield userFacadeWithDB_1.default.checkUser(userName, password);
                if (status) {
                    user = yield userFacadeWithDB_1.default.getUser(userName);
                }
            }
            catch (err) {
                throw new apiError_1.ApiError("Wrong username or password", 403);
            }
            try {
                const point = { type: "Point", coordinates: [longitude, latitude] };
                const date = new Date();
                const found = yield positionsCollection.findOneAndUpdate({ userName }, //Add what we are searching for (the userName in a Position Document)
                {
                    $set: {
                        userName,
                        name: user.name,
                        lastUpdated: date,
                        location: point
                    }
                }, // Add what needs to be added here, remember the document might NOT exist yet
                { upsert: true, returnOriginal: false } // Figure out why you probably need to set both of these
                );
                const nearbyPlayers = yield GameFacade.findNearbyPlayers(userName, point, distance);
                const formatted = nearbyPlayers.map(player => {
                    return {
                        userName: player.userName,
                        name: player.name,
                        lat: latitude,
                        lon: longitude
                    };
                });
                return formatted;
            }
            catch (err) {
                throw err;
            }
        });
    }
    static findNearbyPlayers(clientUserName, point, distance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const found = yield positionsCollection.find({
                    userName: { $ne: clientUserName },
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [point.coordinates[0], point.coordinates[1]]
                            },
                            $maxDistance: distance
                        }
                    }
                });
                return found.toArray();
            }
            catch (err) {
                throw err;
            }
        });
    }
    static getPostIfReached(postId, lat, lon) {
        return __awaiter(this, void 0, void 0, function* () {
            const point = { type: "Point", coordinates: [lat, lon] };
            const distance = 5;
            try {
                const post = yield postCollection.findOne({
                    _id: postId,
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [point.coordinates[0], point.coordinates[1]]
                            },
                            $maxDistance: distance
                        }
                        // Todo: Complete this
                    }
                });
                if (post === null) {
                    throw new apiError_1.ApiError("Post not reached", 400);
                }
                return { postId: post._id, task: post.task.text, isUrl: post.task.isUrl };
            }
            catch (err) {
                throw err;
            }
        });
    }
    //You can use this if you like, to add new post's via the facade
    static addPost(name, taskTxt, isURL, taskSolution, lon, lat) {
        return __awaiter(this, void 0, void 0, function* () {
            const position = { type: "Point", coordinates: [lon, lat] };
            const status = yield postCollection.insertOne({
                _id: name,
                task: { text: taskTxt, isURL },
                taskSolution,
                location: {
                    type: "Point",
                    coordinates: [lon, lat]
                }
            });
            const newPost = status.ops;
            return newPost;
        });
    }
}
exports.default = GameFacade;
GameFacade.DIST_TO_CENTER = 15;
//# sourceMappingURL=gameFacade.js.map