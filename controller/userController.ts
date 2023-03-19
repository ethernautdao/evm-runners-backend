import { database } from "../db";
import { User } from "../model/user";
import { DELETE_USER_QUERY, SELECT_ALL_USERS_QUERY, SELECT_USER_BY_ID_QUERY } from "../utils/queries";

export const getUsers = async () => {
    try {
        const users = await database.query<User>(SELECT_ALL_USERS_QUERY);
        return users.rows;
    } catch (_) {
        return "An error occurred getting users";
    }
};

export const getUserById = async (id: number) => {
    try {
        const user = await database.query<User>(`${SELECT_USER_BY_ID_QUERY}${id}`);

        if (user.rowCount > 0) {
            return user.rows[0];
        }

        return `No results for id ${id}`;
    } catch (_) {
        return `An error occurred getting user by id.`;
    };
};

export const insertOrUpdateUser = async (user: User) => {
    try {
        let inserted;
        let message;

        if (user.id && typeof user.id === 'number') {
            inserted = await database.query<User>(
                `INSERT INTO users (id, name)
                VALUES(${user.id}, '${user.name}') 
                ON CONFLICT (id)
                DO UPDATE SET name = EXCLUDED.name;`
            );

            message = "User updated successfully";
        } else {
            inserted = await database.query<User>(
                `INSERT INTO users (name)
                VALUES('${user.name}');`
            );

            message = "User created successfully";
        }

        if (inserted.rowCount > 0) {
            return message;
        }

        return `Unable to create or update user.`;

    } catch (err: any) {
        return err.detail ? err.detail : "Unexpected error occured, please try again.";
    }
};

export const deleteUser = async (id: number) => {
    try {
        const user = await database.query<User>(`${DELETE_USER_QUERY}${id}`);

        if (user.rowCount > 0) {
            return "User deleted successfully.";
        }

        return "Unable to delete user";

    } catch (err: any) {
        return err.detail ? err.detail : "Unexpected error occured, please try again.";
    }
};
