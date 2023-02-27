import { NextFunction, Request, Response } from "express";
import { Submission } from "../model/submission";
import { isValidId } from "../utils/shared";

export default function submissionMiddleware(req: Request<Submission>, res: Response, next: NextFunction) {
    const { _id, user, level } = req.body;

    //Consider empty string as undefined ids so a new submission is created
    let submissionId = _id === "" ? undefined : _id;
    req.body._id = submissionId;

    if (submissionId && !isValidId(submissionId)) {
        return res.status(400).json({ error: "Invalid _id parameter: Must be a valid submission id." });
    }

    if (!user || !isValidId(user)) {
        return res.status(400).json({ error: "Invalid user parameter: Must be a valid user id." });

    }

    if (!level || !isValidId(level)) {
        return res.status(400).json({ error: "Invalid level parameter: Must be a valid level id." });

    }

    next();
};
