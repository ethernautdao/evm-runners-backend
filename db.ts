import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { Leaderboard } from "./model/leaderboard";
import { Level } from "./model/level";
import { Submission } from "./model/submission";

let client: MongoClient;
let database: Db;

try {
    client = new MongoClient(process.env.CONNECTION_STRING ?? "");
    database = client.db(process.env.DATABASE_NAME);
} catch (error) {
    console.log(`Couldn't establish connection to database: ${error}`);
}

export const getLeaderboard = async () => {
    try {
        const leaderboard = await database.collection<Leaderboard>("Leaderboard").find().toArray();
        return leaderboard;
    } catch (_) {
        return "No results";
    }
};

export const getLevels = async () => {
    try {
        const levels = await database.collection<Level>("Levels").find().toArray();
        return levels;
    } catch (_) {
        return "No results";
    }
};

export const getLevelById = async (id: string) => {
    if (id !== "") {
        try {
            const level = await database.collection<Level>("Levels").findOne({ _id: new ObjectId(id) });
            return level;
        } catch (_) {
            return `No results for id ${id}`;
        }
    }

    return "Id needed";
};

export const insertOrUpdateSubmission = async (submission: Submission) => {
    const query = { _id: new ObjectId(submission._id) };
    const update = { $set: { user: submission.user, level: submission.level, bytecode: submission.bytecode } };
    const options = { upsert: true };
    let success = await database.collection<Submission>("Submission").updateOne(query, update, options);
    return success;
}

const closeConnection = (_: any) => { //Needs _ argument, otherwise it would be called after the server started for some reason...
    client.close(); // Close MongodDB Connection when Process ends
    process.exit(); // Exit with default success-code '0'.
};


process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);
