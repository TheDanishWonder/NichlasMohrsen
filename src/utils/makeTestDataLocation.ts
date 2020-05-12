import path from "path";
require("dotenv").config({ path: path.join(process.cwd(), ".env") });
import * as mongo from "mongodb";
import { bryptAsync } from "./bcrypt-async-helper";
const MongoClient = mongo.MongoClient;
import { positionCreator } from "./geoUtils";
import {
  USER_COLLECTION_NAME,
  POSITION_COLLECTION_NAME,
  POST_COLLECTION_NAME
} from "../config/collectionNames";
import * as gju from "./geoUtils";

const uri = process.env.CONNECTION || "";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

(async function makeTestData() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection(USER_COLLECTION_NAME);
    await usersCollection.deleteMany({});
    await usersCollection.createIndex({ userName: 1 }, { unique: true });
    const secretHashed = await bryptAsync("secret");
    const team1 = {
      name: "Team1",
      userName: "t1",
      password: secretHashed,
      role: "team"
    };
    const team2 = {
      name: "Team2",
      userName: "t2",
      password: secretHashed,
      role: "team"
    };
    const team3 = {
      name: "Team3",
      userName: "t3",
      password: secretHashed,
      role: "team"
    };
    const team4 = {
      name: "Team4",
      userName: "t4",
      password: secretHashed,
      role: "team"
    };
    const team5 = {
      name: "Team5",
      userName: "t5",
      password: secretHashed,
      role: "team"
    };
    const team6 = {
      name: "Team6",
      userName: "t6",
      password: secretHashed,
      role: "team"
    };

    const status = await usersCollection.insertMany([team1, team2, team3, team4, team5, team6]);

    const positionsCollection = db.collection(POSITION_COLLECTION_NAME);
    await positionsCollection.deleteMany({});
    await positionsCollection.createIndex(
      { lastUpdated: 1 },
      { expireAfterSeconds: 30 }
    );
    await positionsCollection.createIndex({ location: "2dsphere" });
    const positions = [
      positionCreator(12.579205, 55.774661, team1.userName, team1.name, true),
      positionCreator(12.573862, gju.getLatitudeInside(55.776424, 100), team2.userName, team2.name, true),
      positionCreator(12.575836, gju.getLatitudeInside(55.776514, 50), team3.userName, team3.name, true),
      positionCreator(12.578132, gju.getLatitudeInside(55.775850, 75), team4.userName, team4.name, true),
      positionCreator(12.574398, gju.getLatitudeOutside(55.771626,40), team5.userName, team5.name, true),
      positionCreator(12.570707, gju.getLatitudeOutside(55.775241, 100), team6.userName, team6.name, true),
      positionCreator(12.6, 55.62, "xxx", "yyy", false)
    ];
    const locations = await positionsCollection.insertMany(positions);
    const postCollection = db.collection(POST_COLLECTION_NAME);
    await postCollection.deleteMany({});
    const posts = await postCollection.insertMany([
      {
        _id: "Post1",
        task: { text: "1+1", isUrl: false },
        taskSolution: "2",
        location: {
          type: "Point",
          coordinates: [12.49, 55.77]
        }
      },
      {
        _id: "Post2",
        task: { text: "4-4", isUrl: false },
        taskSolution: "0",
        location: {
          type: "Point",
          coordinates: [12.4955, 55.774]
        }
      }
    ]);
    console.log(`Inserted ${posts.insertedCount} test Posts`);

    console.log(`Inserted ${status.insertedCount} test users`);
    console.log(`Inserted ${locations.insertedCount} test Locations`);
    console.log(`NEVER, NEVER, NEVER run this on a production database`);
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
})();
