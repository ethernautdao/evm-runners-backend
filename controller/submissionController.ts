import { database } from "../db";
import { Submission } from "../model/submission";
import { SELECT_ALL_SUBMISSIONS_QUERY, SELECT_SUBMISSION_BY_ID_QUERY, SELECT_SUBMISSION_BY_TOKEN_AND_LEVEL_QUERY } from "../utils/queries";

export const getSubmissions = async () => {
    try {
        const submissions = await database.query<Submission>(SELECT_ALL_SUBMISSIONS_QUERY);
        return submissions.rows;
    } catch (_) {
        return "An error occured getting submissions.";
    }
};

export const getSubmissionsByTokenAndLevel = async (token: string, level: number) => {
    try {
        const submissions = await database.query<Submission>(SELECT_SUBMISSION_BY_TOKEN_AND_LEVEL_QUERY, [token, level]);
        return submissions.rows;
    } catch (_) {
        return "An error occured getting submissions.";
    }
};

export const getSubmissionById = async (id: number) => {
    try {
        const submission = await database.query<Submission>(`${SELECT_SUBMISSION_BY_ID_QUERY}${id}`);

        if (submission.rowCount > 0) {
            return submission.rows[0];
        }

        return `No results for id ${id}`;
    } catch (_) {
        return `An error occurred getting submission by id`;
    };
};

export const getGasLeaderboardByLevel = async (id: number) => {
    try {
        const leaderboard = await database.query<Submission>(
            `
            SELECT s.id, s.user_id, s.level_id, s.gas, s.size, s.submitted_at, u.name AS user_name,  u.discriminator AS discriminator, l.name AS level_name
            FROM submissions s 
            JOIN users u ON s.user_id = u.id 
            JOIN levels l ON s.level_id = l.id 
            WHERE s.level_id = ${id} AND s.gas != 0 
            ORDER BY s.gas ASC, s.submitted_at ASC;
            `
        );

        if (leaderboard.rowCount > 0) {
            return leaderboard.rows;
        }

        return `No results`;
    } catch (_) {
        return "An error occurred getting the gas leaderboard.";
    }
};

export const getSizeLeaderboardByLevel = async (id: number) => {
    try {
        const leaderboard = await database.query<Submission>(
            `
            SELECT s.id, s.user_id, s.level_id, s.gas, s.size, s.submitted_at, u.name AS user_name, u.discriminator AS discriminator, l.name AS level_name
            FROM submissions s 
            JOIN users u ON s.user_id = u.id 
            JOIN levels l ON s.level_id = l.id 
            WHERE s.level_id = ${id} AND s.size != 0 
            ORDER BY s.size ASC, s.submitted_at ASC;
            `
        );

        if (leaderboard.rowCount > 0) {
            return leaderboard.rows;
        }

        return `No results`;
    } catch (_) {
        return "An error occurred getting the gas leaderboard.";
    }
};

export const insertOrUpdateSubmission = async (submission: Submission) => {
    try {
        const inserted = await database.query<Submission>(
            `INSERT INTO submissions (level_id, user_id, bytecode, gas, size, submitted_at)
            VALUES(${submission.level_id}, ${submission.user_id}, '${submission.bytecode}', ${submission.gas}, ${submission.size}, to_timestamp(${submission.submitted_at / 1000})) 
            ON CONFLICT (user_id, level_id) 
            DO UPDATE SET bytecode = EXCLUDED.bytecode, gas = EXCLUDED.gas, size = EXCLUDED.size, submitted_at = EXCLUDED.submitted_at
            RETURNING *;`
        );

        if (inserted.rowCount > 0) {
            return inserted.rows[0];
        }

        return `Unable to create or update submission.`;
    } catch (err: any) {
        return err.detail ? err.detail : "Unexpected error occured, please try again.";
    }
};
