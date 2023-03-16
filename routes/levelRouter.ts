import express, { Request, Response } from 'express';
import { deleteLevel, getLevelById, getLevels, insertOrUpdateLevel } from '../controller/levelController';
import { checkLevelIdMiddleware, postLevelMiddleware } from '../middleware/levelMiddleware';

const levelsRouter = express.Router();

levelsRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getLevels());
});

levelsRouter.get("/:id?", checkLevelIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getLevelById(Number.parseInt(req.params.id)));
});

levelsRouter.post("/", postLevelMiddleware, async (req: Request, res: Response) => {
    res.send(await insertOrUpdateLevel(req.body));
});

levelsRouter.delete("/:id?", checkLevelIdMiddleware, async (req: Request, res: Response) => {
    res.send(await deleteLevel(Number.parseInt(req.params.id)));
});

export default levelsRouter;
