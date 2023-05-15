import { database } from "../db";
import { Level } from "../model/level";
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
    const levels = await database.query<Level>(SELECT_ALL_LEVELS_QUERY);
    return levels.rows;
  } catch (_) {
    return "An error occurred getting levels";
  }
};

export const getLevelById = async (id: number) => {
  try {
    const level = await database.query<Level>(SELECT_LEVEL_BY_ID_QUERY, [id]);
    return level.rows[0];
  } catch (_) {
    return `An error occurred getting level by id.`;
  }
};

export const getTestContractByLevelId = async (id: number) => {
  try {
    const level = await database.query<Level>(SELECT_TEST_FILE_BY_ID_QUERY, [
      id,
    ]);

    if (level.rowCount > 0) {
      return level.rows[0].test_contract;
    }

    return undefined;
  } catch (_) {
    return undefined;
  }
};

export const getLevelTotalSolutions = async (id: number) => {
  try {
    const solutions = await database.query(SELECT_LEVEL_TOTAL_SOLUTIONS, [id]);
    return solutions.rows[0].count;
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
      return "Level deleted successfully.";
    }

    return "Unable to delete level";
  } catch (err: any) {
    return err.detail
      ? err.detail
      : "Unexpected error occured, please try again.";
  }
};
