import { database } from "../db";
import {
  InsertOrUpdateSubmissionResult,
  Submission,
} from "../model/submission";
import {
  INSERT_OR_UPDATE_SUBMISSION_QUERY,
  SELECT_ALL_SUBMISSIONS_QUERY,
  SELECT_GAS_LEADERBOARD_BY_LEVEL_QUERY,
  SELECT_SIZE_LEADERBOARD_BY_LEVEL_QUERY,
  SELECT_SUBMISSION_BY_ID_QUERY,
  SELECT_SUBMISSION_BY_TOKEN_AND_LEVEL_QUERY,
} from "../utils/queries";

export const getSubmissions = async () => {
  try {
    const submissions = await database.query<Submission>(
      SELECT_ALL_SUBMISSIONS_QUERY
    );
    return submissions.rows;
  } catch (_) {
    return "An error occured getting submissions.";
  }
};

export const getSubmissionsByTokenAndLevel = async (
  token: string,
  level: number
) => {
  try {
    const submissions = await database.query<Submission>(
      SELECT_SUBMISSION_BY_TOKEN_AND_LEVEL_QUERY,
      [token, level]
    );
    return submissions.rows;
  } catch (_) {
    return "An error occured getting submissions.";
  }
};

export const getSubmissionById = async (id: number) => {
  try {
    const submission = await database.query<Submission>(
      SELECT_SUBMISSION_BY_ID_QUERY,
      [id]
    );

    return submission.rows[0];
  } catch (_) {
    return `An error occurred getting submission by id`;
  }
};

export const getGasLeaderboardByLevel = async (id: number) => {
  try {
    const leaderboard = await database.query<Submission>(
      SELECT_GAS_LEADERBOARD_BY_LEVEL_QUERY,
      [id]
    );

    return leaderboard.rows;
  } catch (_) {
    return "An error occurred getting the gas leaderboard.";
  }
};

export const getSizeLeaderboardByLevel = async (id: number) => {
  try {
    const leaderboard = await database.query<Submission>(
      SELECT_SIZE_LEADERBOARD_BY_LEVEL_QUERY,
      [id]
    );

    return leaderboard.rows;
  } catch (_) {
    return "An error occurred getting the gas leaderboard.";
  }
};

export const insertOrUpdateSubmission = async (submission: Submission) => {
  try {
    const inserted = await database.query<InsertOrUpdateSubmissionResult>(
      INSERT_OR_UPDATE_SUBMISSION_QUERY,
      [
        submission.level_id,
        submission.user_id,
        submission.bytecode,
        submission.gas,
        submission.size,
        submission.submitted_at / 1000,
        submission.type,
      ]
    );

    return inserted.rows;
  } catch (err: any) {
    return err.detail
      ? err.detail
      : "Unexpected error occured, please try again.";
  }
};
