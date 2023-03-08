import { exec } from "child_process";
import { NextFunction, Request, Response } from "express";
import { getTestContractByLevelId } from "../controller/levelController";
import { BYTECODE_REGEX } from "../utils/constants";
import { isValidId } from "../utils/shared";

export const getSubmissionByIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: "Invalid _id parameter: Must be a valid submission id." });
    }

    next();
};

export const postSubmissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, level_id, bytecode } = req.body;
    const { validSubmission, submissionError } = isValidSubmission(user_id, level_id, bytecode);
    
    if(!validSubmission) {
        return res.status(400).json({ error: submissionError });
    }

//    const { validSolution, solutionError } = await isValidSolution(bytecode, level);
    /*if () {
        const valid = await isValidSolution(bytecode, level);
    }*/

    next();
};

const isValidSolution = async (bytecode: any, level_id: any) => {
    const test_file = await getTestContractByLevelId(level_id);

    if (test_file) {
        exec(`${process.env.TEST_COMMAND} ${test_file}`, { cwd: process.env.TESTS_FOLDER_PATH }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`exec stdout: ${stdout}`);
            console.error(`exec stderr: ${stderr}`);
        });
    }

    return false;
}

const isValidSubmission = (user_id: any, level_id: any, bytecode: any) => {
    const isValidBytecode = (bytecode: any) => {
        console.log(bytecode)
        return BYTECODE_REGEX.test(bytecode) && bytecode.length % 2 === 0;
    }

    if (!user_id || !isValidId(user_id)) {
        return { validSubmission: false, submissionError: "Invalid user parameter: Must be a valid user id" };
    }

    if (!level_id || !isValidId(level_id)) {
        return { validSubmission: false, submissionError: "Invalid level parameter: Must be a valid level id." };
    }

    if (!bytecode || !isValidBytecode(bytecode)) {
        return { validSubmission: false, submissionError: "Invalid bytecode parameter: Must be bytecode for a valid solution." };
    }

    return { validSubmission: true, submissionError: undefined };
}
