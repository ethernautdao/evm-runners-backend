import { ObjectId } from "mongodb";
import { database } from "../db";
import { Level } from "../model/level";

export const getLevels = async () => {
    try {
        const levels = await database.collection<Level>("Levels")
            .aggregate([
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        position: 1
                    }
                }
            ])
            .toArray();

        return levels;
    } catch (_) {
        return "An error occurred getting levels";
    }
};

export const getLevelById = async (id: string) => {
    try {
        const level = await database.collection<Level>("Levels")
            .aggregate([
                { $match: { _id: new ObjectId(id) } },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        position: 1
                    }
                }
            ])
            .toArray()
            .then(data => data[0]);

        if (level) {
            return level;
        }

        return `No results for id ${id}`;

    } catch (_) {
        return `An error occurred getting level by id.`;
    };
};
