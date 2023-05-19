import { cache, getCachedData } from "../cache";
import { database } from "../db";
import {
  InsertOrUpdateSubmissionResult,
  Submission,
} from "../model/submission";
import {
  gasLeaderboardsCacheKey,
  sizeLeaderboardsCacheKey,
  submissionsCacheKey,
} from "../utils/constants";
import {
  INSERT_OR_UPDATE_SUBMISSION_QUERY,
  SELECT_ALL_SUBMISSIONS_QUERY,
  SELECT_GAS_LEADERBOARD_BY_LEVEL_QUERY,
  SELECT_SIZE_LEADERBOARD_BY_LEVEL_QUERY,
  SELECT_SUBMISSION_BY_BYTECODE_AND_LEVEL_QUERY,
  SELECT_SUBMISSION_BY_ID_QUERY,
  SELECT_SUBMISSION_BY_TOKEN_AND_LEVEL_QUERY,
} from "../utils/queries";
import { getUserByToken } from "./userController";

export const getSubmissions = async () => {
  try {
    //Get cached data
    const cachedData = await getCachedData(submissionsCacheKey);

    //If cache exists, use it
    if (cachedData) {
      console.log("SUB CACHED DATA");
      return cachedData;
    } else {
      console.log("NO SUB CACHED DATA");
      //Else, get the data from the db and then cache it
      const submissions = await database.query<Submission>(
        SELECT_ALL_SUBMISSIONS_QUERY
      );

      cache.set(submissionsCacheKey, JSON.stringify(submissions.rows));
      return submissions.rows;
    }
  } catch (_) {
    return "An error occured getting submissions.";
  }
};

export const getSubmissionsByTokenAndLevel = async (
  token: string,
  level: number
) => {
  try {
    const cachedData: any = await getCachedData(submissionsCacheKey);

    if (cachedData) {
      const user = await getUserByToken(token);
      return cachedData.filter(
        (submission: any) =>
          submission.level_id === level &&
          submission.user_id === Number.parseInt(user.id)
      );
    } else {
      const submissions = await database.query<Submission>(
        SELECT_SUBMISSION_BY_TOKEN_AND_LEVEL_QUERY,
        [token, level]
      );
      return submissions.rows;
    }
  } catch (_) {
    return "An error occured getting submissions.";
  }
};

export const getSubmissionById = async (id: number) => {
  try {
    const cachedData: any = await getCachedData(submissionsCacheKey);

    if (cachedData) {
      return cachedData.find((submission: any) => submission.id === `${id}`);
    } else {
      const submission = await database.query<Submission>(
        SELECT_SUBMISSION_BY_ID_QUERY,
        [id]
      );

      return submission.rows[0];
    }
  } catch (_) {
    return `An error occurred getting submission by id`;
  }
};

export const getSubmissionByBytecodeAndLevel = async (
  bytecode: string,
  level: number
) => {
  try {
    const cachedData: any = await getCachedData(submissionsCacheKey);

    if (cachedData) {
      console.log("SUBMISSION CACHED DATA", cachedData);
      console.log("### LEVEL_ID", level);
      console.log("### BYTECODE", bytecode);
      return cachedData.find(
        (submission: any) =>
          submission.bytecode === `${bytecode}` && submission.level_id === level
      );
    } else {
      const submission = await database.query<Submission>(
        SELECT_SUBMISSION_BY_BYTECODE_AND_LEVEL_QUERY,
        [bytecode, level]
      );

      return submission.rows[0];
    }
  } catch (_) {
    return `An error occurred getting submission by id`;
  }
};

export const getGasLeaderboardByLevel = async (id: number) => {
  try {
    const cachedData: any = await getCachedData(
      `${gasLeaderboardsCacheKey}-${id}`
    );

    if (cachedData) {
      console.log(`${gasLeaderboardsCacheKey}-${id} CACHED DATA`);

      return cachedData;
    } else {
      console.log(`${gasLeaderboardsCacheKey}-${id} NO CACHED DATA`);

      const leaderboard = await database.query<Submission>(
        SELECT_GAS_LEADERBOARD_BY_LEVEL_QUERY,
        [id]
      );

      cache.set(
        `${gasLeaderboardsCacheKey}-${id}`,
        JSON.stringify(leaderboard.rows)
      );
      return leaderboard.rows;
    }
  } catch (_) {
    return "An error occurred getting the gas leaderboard.";
  }
};

export const getSizeLeaderboardByLevel = async (id: number) => {
  try {
    const cachedData: any = await getCachedData(
      `${sizeLeaderboardsCacheKey}-${id}`
    );

    if (cachedData) {
      console.log(`${sizeLeaderboardsCacheKey}-${id} CACHED DATA`);
      return cachedData;
    } else {
      console.log(`${sizeLeaderboardsCacheKey}-${id} NO CACHED DATA`);

      const leaderboard = await database.query<Submission>(
        SELECT_SIZE_LEADERBOARD_BY_LEVEL_QUERY,
        [id]
      );

      cache.set(
        `${sizeLeaderboardsCacheKey}-${id}`,
        JSON.stringify(leaderboard.rows)
      );
      return leaderboard.rows;
    }
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

    //Delete cache and initialize it again. The leaderboard functions should be called with some regularity so there's no need to initialize here.
    cache.del(submissionsCacheKey);
    cache.del(`${gasLeaderboardsCacheKey}-${submission.level_id}`);
    cache.del(`${sizeLeaderboardsCacheKey}-${submission.level_id}`);
    await getSubmissions();

    return inserted.rows;
  } catch (err: any) {
    return err.detail
      ? err.detail
      : "Unexpected error occured, please try again.";
  }
};
