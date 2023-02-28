import { NextFunction, Request, Response } from "express";
import { isValidId } from "../utils/shared";

export const getSubmissionByIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid _id parameter: Must be a valid submission id." });
    }

    next();
};

export const postSubmissionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const {user, level } = req.body;

    if (!user || !isValidId(user)) {
        return res.status(400).json({ error: "Invalid user parameter: Must be a valid user id." });

    }

    if (!level || !isValidId(level)) {
        return res.status(400).json({ error: "Invalid level parameter: Must be a valid level id." });

    }

    next();
};
