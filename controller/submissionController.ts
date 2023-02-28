import { ObjectId } from "mongodb";
import { database } from "../db";
import { Submission } from "../model/submission";

export const getSubmissions = async () => {
    try {
        const submissions = await database.collection<Submission>("Submissions").find().toArray();
        return submissions;
    } catch (_) {
        return "No results";
    }
};

export const getSubmissionById = async (id: string) => {
    try {
        const submission = await database.collection<Submission>("Submissions").findOne({ _id: new ObjectId(id) });
        return submission;
    } catch (_) {
        return `No results for id ${id}`;
    };
};

export const insertOrUpdateSubmission = async (submission: Submission) => {
    try {
        //If the user has a submission for the same level, update it. Otherwise, create a new one.
        const query = {
            level: new ObjectId(submission.level),
            user: new ObjectId(submission.user)
        };
        const update = { $set: { user: new ObjectId(submission.user), level: new ObjectId(submission.level), bytecode: submission.bytecode } };
        const options = { upsert: true };
        let success = await database.collection<Submission>("Submissions").updateOne(query, update, options);
        return success;
    } catch (err: any) {
        return err.code = 11000 ? "You're trying to update a submission but with the wrong level or user id." : "Unexpected error occured, please try again.";
    }

};
