import { database } from "../db";

export const getLeaderboard = async () => {
    /*try {
        const leaderboard = await database.collection<Leaderboard>("Leaderboard").find().toArray();
        return leaderboard;
    } catch (_) {*/
        return "An error occurred getting the leaderboard.";
   // }
};
