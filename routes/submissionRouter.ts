import express, { Request, Response } from 'express';
import { getSubmissionById, getSubmissions, insertOrUpdateSubmission } from '../controller/submissionController';
import { getSubmissionByIdMiddleware, postSubmissionMiddleware } from '../middleware/submissionMiddleware';

const submissionRouter = express.Router();

submissionRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getSubmissions());
});

submissionRouter.get("/:id?", getSubmissionByIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getSubmissionById(req.params.id));
});

submissionRouter.post("/", postSubmissionMiddleware, async (req: Request, res: Response) => {
    res.send(await insertOrUpdateSubmission(req.body));
});

export default submissionRouter;
