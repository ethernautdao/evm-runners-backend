import express, { Request, Response } from 'express';
import { getLeaderboard } from '../controller/leaderboardController';

const leaderboardRouter = express.Router();

leaderboardRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getLeaderboard());
});

export default leaderboardRouter;
