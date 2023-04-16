import { NextFunction, Request, Response } from "express";
import { isValidString } from "../utils/shared";

export const checkUserCodeMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!isValidString(req.params.code)) {
        return res.status(400).json({ error: "Invalid code: Must be a valid string." });
    }

    next();
};
