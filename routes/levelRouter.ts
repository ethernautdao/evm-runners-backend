import express, { Request, Response } from "express";
import {
  deleteLevel,
  getLevelById,
  getLevelTotalSolutions,
  getLevels,
  insertOrUpdateLevel,
} from "../controller/levelController";
import {
  checkLevelIdMiddleware,
  postLevelMiddleware,
} from "../middleware/levelMiddleware";
import {
  checkAuthorizationTokenExistsMiddleware,
  checkIsAdminMiddleware,
} from "../middleware/authMiddleware";

const levelsRouter = express.Router();

levelsRouter.get("/", async (req: Request, res: Response) => {
  res.send(await getLevels());
});

levelsRouter.get(
  "/:id?",
  checkLevelIdMiddleware,
  async (req: Request, res: Response) => {
    res.send(await getLevelById(Number.parseInt(req.params.id)));
  }
);

levelsRouter.get(
  "/:id?/total",
  checkLevelIdMiddleware,
  async (req: Request, res: Response) => {
    res.send(await getLevelTotalSolutions(Number.parseInt(req.params.id)));
  }
);

levelsRouter.post(
  "/",
  postLevelMiddleware,
  checkAuthorizationTokenExistsMiddleware,
  checkIsAdminMiddleware,
  async (req: Request, res: Response) => {
    res.send(await insertOrUpdateLevel(req.body));
  }
);

levelsRouter.delete(
  "/:id?",
  checkLevelIdMiddleware,
  checkAuthorizationTokenExistsMiddleware,
  checkIsAdminMiddleware,
  async (req: Request, res: Response) => {
    res.send(await deleteLevel(Number.parseInt(req.params.id)));
  }
);

export default levelsRouter;
