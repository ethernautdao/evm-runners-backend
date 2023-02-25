import { ObjectId } from "mongodb";

export interface Leaderboard {
    _id: ObjectId;
    user: string;
    score: number;
};