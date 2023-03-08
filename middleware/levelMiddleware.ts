import { NextFunction, Request, Response } from "express";
import { isValidId } from "../utils/shared";

export const getLevelByIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid id parameter: Must be a valid level id." });
    }

    next();
};
