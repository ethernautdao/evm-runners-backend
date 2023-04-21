import { exec } from "child_process";
import { NextFunction, Request, Response } from "express";
import { promisify } from "util";
import { getTestContractByLevelId } from "../controller/levelController";
import { convertToSolutionFeedback, SolutionFeedback, TestResult } from "../model/solution";
import { Submission } from "../model/submission";
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

    const { result, solutionError } = await isValidSolution(bytecode, level_id);

    if (!result) {
        return res.status(400).json(solutionError);
    }

    req.submission = evaluateSolution(result, user_id, level_id, bytecode);

    next();
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
        return { result: undefined, solutionError: "No valid test file for that level." };
    }

    let output: any;


    try {
        output = await promisifiedExec(`${FORGE_TEST_COMMAND} ${test_file}`, { cwd: `${process.env.TESTS_FOLDER_PATH}`, env: { ...process.env, 'BYTECODE': `${bytecode}` } });
        return { result: convertToSolutionFeedback(output), solutionError: undefined };
    } catch (err: any) {
        /**
         * If forge test is run, but tests fail, exec returns an undefined result
         * and puts the failed tests in the err variable. But if the forge test runs but,
         * for instance, the test file doesn't exist, it returns the error in result.stdout.
         * Meaning that to analyze failed tests, we need err.stdout, or for some generic errors
         * we need result.stdout...
         */

        let errorMessage = output ? formatError(output.stdout) : convertToSolutionFeedback(err);
        return { result: undefined, solutionError: errorMessage };
    }
};

const evaluateSolution = (testResults: SolutionFeedback, user: any, level: any, bytecode: any) => {
    let submission: Submission = {
        id: undefined,
        user_id: user,
        user_name: undefined,
        level_id: level,
        level_name: undefined,
        bytecode: bytecode,
        gas: 0,
        size: 0,
        submitted_at: Date.now()
    };

    if(testResults.fuzz.success && testResults.sanity.success && testResults.gas.success && testResults.size.success) {
        submission.gas = testResults.gas.decoded_logs[0];
        submission.size = testResults.size.decoded_logs[0];
    }

    return submission;
};

const formatError = (error: string) => {
    if (!error) {
        return "Invalid solution. Tests failed";
    }

    if (error.includes("No tests match the provided pattern")) {
        return "Level test file is invalid. Reach out to the developers.";
    }

    return "Unexpected error when testing the solution: " + error;
};
