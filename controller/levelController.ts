import { ObjectId } from "mongodb";
import { database } from "../db";
import { Level } from "../model/level";

export const getLevels = async () => {
    try {
        const levels = await database.collection<Level>("Levels").find().toArray();
        return levels;
    } catch (_) {
        return "No results";
    }
};

export const getLevelById = async (id: string) => {
    try {
        const level = await database.collection<Level>("Levels").findOne({ _id: new ObjectId(id) });
        return level;
    } catch (_) {
        return `No results for id ${id}`;
    };
};
