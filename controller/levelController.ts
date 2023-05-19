import { cache, getCachedData } from "../cache";
import { database } from "../db";
import { Level } from "../model/level";
import { levelsCacheKey, submissionsCacheKey } from "../utils/constants";
import {
  DELETE_LEVEL_QUERY,
  INSERT_LEVEL_QUERY,
  SELECT_ALL_LEVELS_QUERY,
  SELECT_LEVEL_BY_ID_QUERY,
  SELECT_LEVEL_TOTAL_SOLUTIONS,
  SELECT_TEST_FILE_BY_ID_QUERY,
  UPDATE_LEVEL_QUERY,
} from "../utils/queries";

export const getLevels = async () => {
  try {
    //Get cached data
    const cachedData = await getCachedData(levelsCacheKey);

    //If cache exists, use it
    if (cachedData) {
      console.log("LEVEL CACHED DATA")
      return cachedData;
    } else {
      console.log("NO LEVEL CACHED DATA")
      //Else, get the data from the db and then cache it
      const levels = await database.query<Level>(SELECT_ALL_LEVELS_QUERY);
      cache.set(levelsCacheKey, JSON.stringify(levels.rows));
      return levels.rows;
    }
  } catch (_) {
    return "An error occurred getting levels";
  }
};

export const getLevelById = async (id: number) => {
  try {
    const cachedData: any = await getCachedData(levelsCacheKey);

    if (cachedData) {
      return cachedData.find((level: any) => level.id === `${id}`);
    } else {
      const level = await database.query<Level>(SELECT_LEVEL_BY_ID_QUERY, [id]);
      return level.rows[0];
    }
  } catch (_) {
    return `An error occurred getting level by id.`;
  }
};

export const getTestContractByLevelId = async (id: number) => {
  try {
    const cachedData: any = await getCachedData(levelsCacheKey);

    if (cachedData) {
      return cachedData.find((level: any) => level.id === `${id}`)
        .test_contract;
    } else {
      const level = await database.query<Level>(SELECT_TEST_FILE_BY_ID_QUERY, [
        id,
      ]);

      if (level.rowCount > 0) {
        return level.rows[0].test_contract;
      }
    }
    return undefined;
  } catch (_) {
    return undefined;
  }
};

export const getLevelTotalSolutions = async (id: number) => {
  try {
    const cachedData: any = await getCachedData(submissionsCacheKey);

    if (cachedData) {
      return cachedData.filter(
        (submission: any) => submission.level_id === `${id}`
      ).length;
    } else {
      const solutions = await database.query(SELECT_LEVEL_TOTAL_SOLUTIONS, [
        id,
      ]);
      return solutions.rows[0].count;
    }
  } catch (_) {
    return "An error occurred getting the total number of solution for this level.";
  }
};

export const insertOrUpdateLevel = async (level: Level) => {
  try {
    let inserted;

    if (level.id && typeof level.id === "number") {
      inserted = await database.query<Level>(UPDATE_LEVEL_QUERY, [
        level.id,
        level.name,
        level.position,
        level.test_contract,
      ]);
    } else {
      inserted = await database.query<Level>(INSERT_LEVEL_QUERY, [
        level.name,
        level.position,
        level.test_contract,
      ]);
    }

    //Delete cache and initialize it again
    cache.del(levelsCacheKey);
    await getLevels();

    return inserted.rows[0];
  } catch (err: any) {
    return err.detail
      ? err.detail
      : "Unexpected error occured, please try again.";
  }
};

export const deleteLevel = async (id: number) => {
  try {
    const level = await database.query<Level>(DELETE_LEVEL_QUERY, [id]);

    if (level.rowCount > 0) {
      //Delete cache and initialize it again
      cache.del(levelsCacheKey);
      await getLevels();

      return "Level deleted successfully.";
    }

    return "Unable to delete level";
  } catch (err: any) {
    return err.detail
      ? err.detail
      : "Unexpected error occured, please try again.";
  }
};
