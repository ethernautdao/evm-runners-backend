import express, { Request, Response } from 'express';
import { getLevelById, getLevels } from '../db';
import levelsMiddleware from '../middleware/levelsMiddleware';

const levelsRouter = express.Router();

levelsRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getLevels());
});

levelsRouter.get("/:id?", levelsMiddleware, async (req: Request, res: Response) => {
    res.send(await getLevelById(req.params.id));
});

export default levelsRouter;
