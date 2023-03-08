import express, { Request, Response } from 'express';
import { getLevelById, getLevels } from '../controller/levelController';
import { getLevelByIdMiddleware } from '../middleware/levelMiddleware';

const levelsRouter = express.Router();

levelsRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getLevels());
});

levelsRouter.get("/:id?", getLevelByIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getLevelById(Number.parseInt(req.params.id)));
});

export default levelsRouter;