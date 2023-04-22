import express, { Request, Response } from 'express';
import { getGasLeaderboardByLevel, getSizeLeaderboardByLevel, getSubmissionById, getSubmissions, getSubmissionsByUser, insertOrUpdateSubmission } from '../controller/submissionController';
import { checkLevelIdMiddleware } from '../middleware/levelMiddleware';
import { getSubmissionByIdMiddleware, postSubmissionMiddleware } from '../middleware/submissionMiddleware';
import { checkAuthorizationTokenExistsMiddleware, checkIsAdminMiddleware, checkAuthorizationTokenMatchesUserIdMiddleware } from '../middleware/authMiddleware';
import { formatAccessToken } from '../utils/shared';

const submissionRouter = express.Router();

submissionRouter.get("/", checkAuthorizationTokenExistsMiddleware, checkIsAdminMiddleware, async (req: Request, res: Response) => {
    res.send(await getSubmissions());
});

submissionRouter.get("/user", checkAuthorizationTokenExistsMiddleware, async (req: Request, res: Response) => {
    res.send(await getSubmissionsByUser(formatAccessToken(req.headers.authorization ?? "")));
});

submissionRouter.get("/:id?", checkAuthorizationTokenExistsMiddleware, checkIsAdminMiddleware, getSubmissionByIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getSubmissionById(Number.parseInt(req.params.id)));
});

submissionRouter.get("/leaderboard/gas/:id?", checkLevelIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getGasLeaderboardByLevel(Number.parseInt(req.params.id)));
});

submissionRouter.get("/leaderboard/size/:id?", checkLevelIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getSizeLeaderboardByLevel(Number.parseInt(req.params.id)));
});

submissionRouter.post("/", postSubmissionMiddleware, checkAuthorizationTokenExistsMiddleware, checkAuthorizationTokenMatchesUserIdMiddleware, async (req: Request, res: Response) => {
    res.send(await insertOrUpdateSubmission(req.submission));
});

export default submissionRouter;
