import { exec } from "child_process";
import { NextFunction, Request, Response } from "express";
import { promisify } from "util";
import { getTestContractByLevelId } from "../controller/levelController";
import { BYTECODE_REGEX, FORGE_TEST_COMMAND } from "../utils/constants";
import { isValidNumber } from "../utils/shared";

const promisifiedExec = promisify(exec);

export const getSubmissionByIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!isValidNumber(req.params.id)) {
        return res.status(400).json({ error: "Invalid id: Must be a valid number." });
    }

    next();
};

export const postSubmissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, level_id, bytecode } = req.body;
    const { validSubmission, submissionError } = isValidSubmission(user_id, level_id, bytecode);

    if (!validSubmission) {
        return res.status(400).json({ error: submissionError });
    }

    const { result, isError, error } = await isValidSolution(bytecode, level_id);

    if (isError) {
        return res.status(400).json(error);
    }

    return res.status(400).json(result);
};

const isValidSubmission = (user_id: any, level_id: any, bytecode: any) => {
    const isValidBytecode = (bytecode: any) => {
        return BYTECODE_REGEX.test(bytecode) && bytecode.length % 2 === 0;
    }

    if (!isValidNumber(user_id)) {
        return { validSubmission: false, submissionError: "Invalid user: Must be a valid number." };
    }

    if (!isValidNumber(level_id)) {
        return { validSubmission: false, submissionError: "Invalid level: Must be a valid number." };
    }

    if (!isValidBytecode(bytecode)) {
        return { validSubmission: false, submissionError: "Invalid bytecode: Must be bytecode for a valid solution." };
    }

    return { validSubmission: true, submissionError: undefined };
};

const isValidSolution = async (bytecode: any, level_id: any) => {
    const test_file = await getTestContractByLevelId(level_id);

    if (!test_file) {
        return { result: undefined, isError: true, error: "No valid test file for that level." };
    }

    var result = await promisifiedExec(`${FORGE_TEST_COMMAND} ${test_file}`, { cwd: `${process.env.TESTS_FOLDER_PATH}` , env: { ...process.env, 'BYTECODE': `${bytecode}`}});

    try {
        let formattedStdout = "{\"test/" + result.stdout.split("{\"test/").splice(1);
        let formattedResult = JSON.parse(formattedStdout);
        return { result: formattedResult, isError: false, error: undefined };
    } catch (_) {
        let errorMessage = formatError(result.stdout);
        return { result: undefined, isError: true, error: errorMessage };
    }
};

const formatError = (stdout: string) => {
    if (stdout.includes("No tests match the provided pattern")) {
        return "Level test file is invalid. Reach out to the developers.";
    }

    return "Unexpected error when testing the solution: " + stdout;
};
