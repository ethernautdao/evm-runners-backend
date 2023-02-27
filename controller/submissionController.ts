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
    const query = { _id: new ObjectId(submission._id) };
    const update = { $set: { user: submission.user, level: submission.level, bytecode: submission.bytecode } };
    const options = { upsert: true };
    let success = await database.collection<Submission>("Submissions").updateOne(query, update, options);
    return success;
};
