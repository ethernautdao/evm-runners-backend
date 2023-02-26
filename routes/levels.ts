import express, { Request, Response } from 'express';
import { getLevelById, getLevels } from '../db';

const levelsRouter = express.Router();

levelsRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getLevels());
});

levelsRouter.get("/:id?", async (req: Request, res: Response) => {
    res.send(await getLevelById(req.params.id));
});

export default levelsRouter;