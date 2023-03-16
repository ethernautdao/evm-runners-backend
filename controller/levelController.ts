import { database } from "../db";
import { Level } from "../model/level";
import { DELETE_LEVEL_QUERY, SELECT_ALL_LEVELS_QUERY, SELECT_LEVEL_BY_ID_QUERY, SELECT_TEST_FILE_BY_ID_QUERY } from "../utils/queries";

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
        const level = await database.query<Level>(`${SELECT_TEST_FILE_BY_ID_QUERY}${id}`);

        if (level.rowCount > 0) {
            return level.rows[0].test_contract;
        }

        return undefined;
    } catch (_) {
        return undefined
    };
}

export const insertOrUpdateLevel = async (level: Level) => {
    try {
        let inserted;
        let message;

        if (level.id && typeof level.id === 'number') {
            inserted = await database.query<Level>(
                `INSERT INTO levels (id, name, position, test_contract)
                VALUES(${level.id}, '${level.name}', ${level.position}, '${level.test_contract}') 
                ON CONFLICT (id)
                DO UPDATE SET name = EXCLUDED.name, position = EXCLUDED.position, test_contract = EXCLUDED.test_contract;`
            );

            message = "Level updated successfully.";

        } else {
            inserted = await database.query<Level>(
                `INSERT INTO levels (name, position, test_contract)
                VALUES('${level.name}', ${level.position}, '${level.test_contract}');`
            );

            message = "Level created successfully.";
        }

        if (inserted.rowCount > 0) {
            return message;
        }

        return "Unable to create or update level.";
    } catch (err: any) {
        return err.detail ? err.detail : "Unexpected error occured, please try again.";
    }
};

export const deleteLevel = async (id: number) => {
    try {
        const level = await database.query<Level>(`${DELETE_LEVEL_QUERY}${id}`);

        if (level.rowCount > 0) {
            return "Level deleted successfully.";
        }

        return "Unable to delete level";
    } catch (err: any) {
        return err.detail ? err.detail : "Unexpected error occured, please try again.";
    }
};
