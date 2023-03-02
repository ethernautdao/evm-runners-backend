import { database } from "../db";
import { Leaderboard } from "../model/leaderboard";

export const getLeaderboard = async () => {
    try {
        const leaderboard = await database.collection<Leaderboard>("Leaderboard").find().toArray();
        return leaderboard;
    } catch (_) {
        return "An error occurred getting the leaderboard.";
    }
};
