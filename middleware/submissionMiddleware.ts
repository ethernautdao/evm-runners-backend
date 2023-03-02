import { exec } from "child_process";
import { NextFunction, Request, Response } from "express";
import { BYTECODE_REGEX } from "../utils/constants";
import { isValidId } from "../utils/shared";

export const getSubmissionByIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid _id parameter: Must be a valid submission id." });
    }

    next();
};

export const postSubmissionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { user, level, bytecode } = req.body;

    const isValidBytecode = (bytecode: any) => {
        let valid = BYTECODE_REGEX.test(bytecode) && bytecode.length % 2 === 0;
        return valid;
    }

    const isValidSolution = (bytecode: any) => {
        exec(`${process.env.TEST_COMMAND} AverageTest`, { cwd: process.env.TESTS_FOLDER_PATH }, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`exec stdout: ${stdout}`);
            console.error(`exec stderr: ${stderr}`);
          }); 
        return false;
    }

    if (!user || !isValidId(user)) {
        return res.status(400).json({ error: "Invalid user parameter: Must be a valid user id." });
    }

    if (!level || !isValidId(level)) {
        return res.status(400).json({ error: "Invalid level parameter: Must be a valid level id." });
    }

    if (!bytecode || !isValidBytecode(bytecode) || !isValidSolution(bytecode)) {
        return res.status(400).json({ error: "Invalid bytecode parameter: Must be bytecode for a valid solution." });
    }

    next();
};
