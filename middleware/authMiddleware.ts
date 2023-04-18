import { NextFunction, Request, Response } from "express";
import { isValidString } from "../utils/shared";
import { doesTokenExist, isTokenMatch, userIsAdmin } from "../controller/userController";

export const checkAuthorizationTokenExistsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { token, error } = checkToken(req.headers.authorization ?? "");

    if(error) {
        return res.status(400).json({ error: error });
    }

    let exists = await doesTokenExist(token!);

    if(!exists) {
        return res.status(400).json({ error: "Invalid token provided." });
    }

    next();
};

export const checkIsAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { token, error } = checkToken(req.headers.authorization ?? "");

    if(error) {
        return res.status(400).json({ error: error });
    }

    let isAdmin = await userIsAdmin(token!);

    if(!isAdmin) {
        return res.status(400).json({ error: "Not an admin." });
    }

    next();
};

export const checkAuthorizationTokenMatchesUserIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.body;
    const { token, error } = checkToken(req.headers.authorization ?? "");

    if(error) {
        return res.status(400).json({ error: error });
    }

    let tokenMatches = isTokenMatch(user_id, token!);

    if(!tokenMatches) {
        return res.status(400).json({ error: "The token provided does not match the user_id for this submission." });
    }

    next();
}

const checkToken = (header: string) => {
    const token = header?.split(" ") ?? "";

    if (!(token[0]?.includes("Bearer")) || !isValidString(token[1])) {
        return { token: undefined, error: "Invalid authorization token: Must be a valid string." };
    }

    return { token: token[1], error: undefined } ;
};
