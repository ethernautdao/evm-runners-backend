import { database } from "../db";
import { User } from "../model/user";
import {
  INSERT_OR_UPDATE_USER_QUERY,
  SELECT_ALL_USERS_QUERY,
  SELECT_USER_BY_ID_QUERY,
  SELECT_USER_BY_PIN_QUERY,
  SELECT_USER_BY_TOKEN_QUERY,
} from "../utils/queries";

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
    const user = await database.query<User>(SELECT_USER_BY_ID_QUERY, [id]);

    if (user.rowCount > 0) {
      return user.rows[0];
    }

    return `No results for id ${id}`;
  } catch (_) {
    return `An error occurred getting user by id.`;
  }
};

export const getUserByPin = async (pin: string) => {
  try {
    const user = await database.query<User>(SELECT_USER_BY_PIN_QUERY, [pin]);

    if (user.rowCount > 0) {
      return user.rows[0];
    }

    return `No user for that pin.`;
  } catch (_) {
    return `An error occurred getting the user.`;
  }
};

export const doesTokenExist = async (token: string) => {
  try {
    const user = await database.query<User>(SELECT_USER_BY_TOKEN_QUERY, [
      token,
    ]);

    if (user.rowCount > 0) {
      return true;
    }

    return false;
  } catch (_) {
    return false;
  }
};

export const userIsAdmin = async (token: string) => {
  try {
    const user = await database.query<User>(SELECT_USER_BY_TOKEN_QUERY, [
      token,
    ]);

    if (user.rowCount > 0) {
      return user.rows[0].admin;
    }

    return false;
  } catch (_) {
    return false;
  }
};

export const isTokenMatch = async (user_id: Number, token: string) => {
  try {
    const user = await database.query<User>(SELECT_USER_BY_TOKEN_QUERY, [
      token,
    ]);

    if (user.rowCount > 0) {
      return user.rows[0].id === user_id;
    }

    return false;
  } catch (_) {
    return false;
  }
};

export const insertOrUpdateUser = async (user: User) => {
  try {
    const inserted = await database.query<User>(INSERT_OR_UPDATE_USER_QUERY, [
      user.pin,
      user.discord_id,
      user.name,
      user.discriminator,
      user.code,
      user.access_token,
      user.refresh_token,
      user.expires_in / 1000,
      user.admin,
    ]);

    if (inserted.rowCount > 0) {
      return inserted.rows[0];
    }

    return `Unable to create or update user.`;
  } catch (err: any) {
    return err.detail
      ? err.detail
      : "Unexpected error occured, please try again.";
  }
};

/*export const deleteUser = async (id: number) => {
    try {
        const user = await database.query<User>(`${DELETE_USER_QUERY}${id}`);

        if (user.rowCount > 0) {
            return "User deleted successfully.";
        }

        return "Unable to delete user";

    } catch (err: any) {
        return err.detail ? err.detail : "Unexpected error occured, please try again.";
    }
};*/
