import { cache, getCachedData } from "../cache";
import { database } from "../db";
import { storeSubmissionOnChain } from "../ethereumClient";
import {
  InsertOrUpdateSubmissionResult,
  Submission,
} from "../model/submission";
import {
  GAS_LEADERBOARDS_CACHE_KEY,
  SIZE_LEADERBOARDS_CACHE_KEY,
  SUBMISSIONS_CACHE_KEY,
} from "../utils/constants";
import {
  INSERT_OR_UPDATE_SUBMISSION_QUERY,
  SELECT_ALL_SUBMISSIONS_QUERY,
  SELECT_GAS_LEADERBOARD_BY_LEVEL_QUERY,
  SELECT_SIZE_LEADERBOARD_BY_LEVEL_QUERY,
  SELECT_SUBMISSION_BY_BYTECODE_AND_LEVEL_QUERY,
  SELECT_SUBMISSION_BY_ID_QUERY,
  SELECT_SUBMISSION_BY_TOKEN_QUERY,
} from "../utils/queries";
import { getUserByToken } from "./userController";

export const getSubmissions = async () => {
  try {
    //Get cached data
    const cachedData = await getCachedData(SUBMISSIONS_CACHE_KEY);

    //If cache exists, use it
    if (cachedData) {
      return cachedData;
    } else {
      //Else, get the data from the db and then cache it
      const submissions = await database.query<Submission>(
        SELECT_ALL_SUBMISSIONS_QUERY
      );

      cache.set(SUBMISSIONS_CACHE_KEY, JSON.stringify(submissions.rows));
      return submissions.rows;
    }
  } catch (_) {
    return "An error occured getting submissions.";
  }
};

export const getSubmissionsByToken = async (token: string) => {
  try {
    const cachedData: any = await getCachedData(SUBMISSIONS_CACHE_KEY);

    if (cachedData) {
      const user = await getUserByToken(token);

      return cachedData.filter(
        (submission: any) => submission.user_id === Number.parseInt(user.id)
      );
    } else {
      const submissions = await database.query<Submission>(
        SELECT_SUBMISSION_BY_TOKEN_QUERY,
        [token]
      );
      return submissions.rows;
    }
  } catch (_) {
    return "An error occured getting submissions.";
  }
};

export const getSubmissionById = async (id: number) => {
  try {
    const cachedData: any = await getCachedData(SUBMISSIONS_CACHE_KEY);

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
  level: string
) => {
  try {
    const cachedData: any = await getCachedData(SUBMISSIONS_CACHE_KEY);

    if (cachedData) {
      return cachedData.find(
        (submission: any) =>
          submission.bytecode === bytecode &&
          submission.level_id === Number.parseInt(level)
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
      `${GAS_LEADERBOARDS_CACHE_KEY}-${id}`
    );

    if (cachedData) {
      return cachedData;
    } else {
      const leaderboard = await database.query<Submission>(
        SELECT_GAS_LEADERBOARD_BY_LEVEL_QUERY,
        [id]
      );

      cache.set(
        `${GAS_LEADERBOARDS_CACHE_KEY}-${id}`,
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
      `${SIZE_LEADERBOARDS_CACHE_KEY}-${id}`
    );

    if (cachedData) {
      return cachedData;
    } else {
      const leaderboard = await database.query<Submission>(
        SELECT_SIZE_LEADERBOARD_BY_LEVEL_QUERY,
        [id]
      );

      cache.set(
        `${SIZE_LEADERBOARDS_CACHE_KEY}-${id}`,
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

    if (inserted?.rows?.at(0)?.submissions?.length ?? 0 > 0) {
      storeSubmissionOnChain(
        submission.user_id,
        submission.level_id,
        inserted?.rows?.at(0)?.submissions ?? []
      );
    }
        
    //Delete cache and initialize it again. The leaderboard functions should be called with some regularity so there's no need to initialize here.
    cache.del(SUBMISSIONS_CACHE_KEY);
    cache.del(`${GAS_LEADERBOARDS_CACHE_KEY}-${submission.level_id}`);
    cache.del(`${SIZE_LEADERBOARDS_CACHE_KEY}-${submission.level_id}`);
    await getSubmissions();

    return inserted.rows;
  } catch (err: any) {
    return err.detail
      ? err.detail
      : "Unexpected error occured, please try again.";
  }
};
