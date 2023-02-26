import { NextFunction, Request, Response } from "express";
import { isValidId } from "../utils/shared";

export default function levelsMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid _id parameter: Must be a valid submission id." });
    }

    next();
};
