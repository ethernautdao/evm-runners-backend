import { database } from "../db";
import { User } from "../model/user";
import { SELECT_ALL_USERS_QUERY, SELECT_USER_BY_ID_QUERY, SELECT_USER_BY_PIN_QUERY, SELECT_USER_BY_TOKEN_QUERY } from "../utils/queries";

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

export const getUserByPin = async (pin: string) => {
    try {
        const user = await database.query<User>(`${SELECT_USER_BY_PIN_QUERY}'${pin}'`);

        if (user.rowCount > 0) {
            return user.rows[0];
        }

        return `No user for that pin.`;
    } catch (_) {
        return `An error occurred getting the user.`;
    };
}

export const doesTokenExist = async (token: string) => {
    try {
        const user = await database.query<User>(`${SELECT_USER_BY_TOKEN_QUERY}'${token}'`);

        if (user.rowCount > 0) {
            return true;
        }

        return false;
    } catch (_) {
        return false;
    };
}

export const userIsAdmin = async (token: string) => {
    try {
        const user = await database.query<User>(`${SELECT_USER_BY_TOKEN_QUERY}'${token}'`);

        if (user.rowCount > 0) {
            return user.rows[0].admin;
        }

        return false;
    } catch (_) {
        return false;
    };
}

export const isTokenMatch = async (user_id: Number, token: string) => {
    try {
        const user = await database.query<User>(`${SELECT_USER_BY_TOKEN_QUERY}'${token}'`);

        if (user.rowCount > 0) {
            return user.rows[0].id === user_id;
        }

        return false;
    } catch (_) {
        return false;
    };
}

export const insertOrUpdateUser = async (user: User) => {
    try {
        const inserted = await database.query<User>(
            `
            INSERT INTO users (pin, discord_id, name, discriminator, code, access_token, refresh_token, expires_in, admin)
            VALUES('${user.pin}', ${user.discord_id}, '${user.name}', ${user.discriminator}, '${user.code}', '${user.access_token}', '${user.refresh_token}', to_timestamp(${user.expires_in / 1000}), ${user.admin}) 
            ON CONFLICT (discord_id)
            DO UPDATE SET
                pin = EXCLUDED.pin,
                name = EXCLUDED.name, 
                discriminator = EXCLUDED.discriminator, 
                code = EXCLUDED.code, 
                access_token = EXCLUDED.access_token, 
                refresh_token = EXCLUDED.refresh_token, 
                expires_in = EXCLUDED.expires_in, 
                admin = EXCLUDED.admin
            RETURNING *;
            `
        );

        if (inserted.rowCount > 0) {
            return inserted.rows[0];
        }

        return `Unable to create or update user.`;

    } catch (err: any) {
        return err.detail ? err.detail : "Unexpected error occured, please try again.";
    }
};
