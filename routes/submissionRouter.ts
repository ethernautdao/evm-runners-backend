import express, { Request, Response } from 'express';
import { insertOrUpdateSubmission } from '../db';
import submissionMiddleware from '../middleware/submissionMiddleware';
import { Submission } from '../model/submission';

const submissionRouter = express.Router();

submissionRouter.post("/", submissionMiddleware, async (req: Request<Submission>, res: Response) => {
    res.send(await insertOrUpdateSubmission(req.body as Submission));
});

export default submissionRouter;
