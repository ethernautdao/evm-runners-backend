import express, { Request, Response } from 'express';
import { getGasLeaderboardByLevel, getSizeLeaderboardByLevel, getSubmissionById, getSubmissions, insertOrUpdateSubmission } from '../controller/submissionController';
import { checkLevelIdMiddleware } from '../middleware/levelMiddleware';
import { getSubmissionByIdMiddleware, postSubmissionMiddleware } from '../middleware/submissionMiddleware';

const submissionRouter = express.Router();

submissionRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getSubmissions());
});

submissionRouter.get("/:id?", getSubmissionByIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getSubmissionById(Number.parseInt(req.params.id)));
});

submissionRouter.get("/leaderboard/gas/:id?", checkLevelIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getGasLeaderboardByLevel(Number.parseInt(req.params.id)));
});

submissionRouter.get("/leaderboard/size/:id?", checkLevelIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getSizeLeaderboardByLevel(Number.parseInt(req.params.id)));
});

submissionRouter.post("/", postSubmissionMiddleware, async (req: Request, res: Response) => {
    res.send(await insertOrUpdateSubmission(req.submission));
});

export default submissionRouter;
