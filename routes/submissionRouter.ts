import express, { Request, Response } from 'express';
import { getSubmissions, insertOrUpdateSubmission } from '../db';
import submissionMiddleware from '../middleware/submissionMiddleware';
import { Submission } from '../model/submission';

const submissionRouter = express.Router();

submissionRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getSubmissions());
});

submissionRouter.post("/", submissionMiddleware, async (req: Request<Submission>, res: Response) => {
    res.send(await insertOrUpdateSubmission(req.body as Submission));
});

export default submissionRouter;
