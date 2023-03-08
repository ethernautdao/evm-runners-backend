import { database } from "../db";
import { Level } from "../model/level";
import { SELECT_ALL_LEVELS_QUERY, SELECT_LEVEL_BY_ID_QUERY } from "../utils/queries";

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
        const level = await database.query<Level>(`${SELECT_LEVEL_BY_ID_QUERY}${id}`);

        if (level.rowCount > 0) {
            return level.rows[0];
        }

        return `No results for id ${id}`;
    } catch (_) {
        return `An error occurred getting level by id.`;
    };
};

export const getTestContractByLevelId = async (id: number) => {
    try {
        const level = await database.query<Level>(`${SELECT_LEVEL_BY_ID_QUERY}${id}`);

        if (level.rowCount > 0) {
            return level.rows[0].test_contract;
        }

        return undefined;
    } catch (_) {
        return undefined
    };
}
