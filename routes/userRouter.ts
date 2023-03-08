import express, { Request, Response } from 'express';
import { getLeaderboard } from '../controller/userController';

const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getLeaderboard());
});

export default userRouter;
