import { database } from "../db";
import { Submission } from "../model/submission";
import { SELECT_ALL_SUBMISSIONS_QUERY, SELECT_SUBMISSION_BY_ID_QUERY } from "../utils/queries";

export const getSubmissions = async () => {
    try {
        const submissions = await database.query<Submission>(SELECT_ALL_SUBMISSIONS_QUERY);
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

export const insertOrUpdateSubmission = async (submission: Submission) => {
    try {
        await database.query<Submission>(
            `INSERT INTO submissions (level_id, user_id, bytecode)
            VALUES(${submission.level_id}, ${submission.user_id}, '${submission.bytecode}') 
            ON CONFLICT (user_id, level_id) 
            DO UPDATE SET bytecode = EXCLUDED.bytecode;`
        );

        return "Submission added successfully.";
    } catch (err: any) {
        console.log(err)
        return err.detail ? err.detail : "Unexpected error occured, please try again.";
    }

};
