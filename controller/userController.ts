import { cache, getCachedData } from "../cache";
import { database } from "../db";
import { User } from "../model/user";
import { usersCacheKey } from "../utils/constants";
import {
  INSERT_OR_UPDATE_USER_QUERY,
  SELECT_ALL_USERS_QUERY,
  SELECT_USER_BY_ID_QUERY,
  SELECT_USER_BY_PIN_QUERY,
  SELECT_USER_BY_TOKEN_QUERY,
} from "../utils/queries";

export const getUsers = async () => {
  try {
    //Get cached data
    const cachedData = await getCachedData(usersCacheKey);

    //If cache exists, use it
    if (cachedData) {
      return cachedData;
    } else {
      //Else, get the data from the db and then cache it
      const users = await database.query<User>(SELECT_ALL_USERS_QUERY);
      cache.set(usersCacheKey, JSON.stringify(users.rows));
      return users.rows;
    }
  } catch (_) {
    return "An error occurred getting users";
  }
};

export const getUserByToken = async (token: string) => {
  try {
    const cachedData: any = await getCachedData(usersCacheKey);

    if (cachedData) {
      return cachedData.find((user: any) => user.access_token === token);
    } else {
      const user = await database.query<User>(SELECT_USER_BY_TOKEN_QUERY, [
        token,
      ]);
      return user.rows[0];
    }
  } catch (_) {
    return `An error occurred getting the user.`;
  }
};

export const getUserById = async (id: number) => {
  try {
    const cachedData: any = await getCachedData(usersCacheKey);

    if (cachedData) {
      return cachedData.find((user: any) => user.id === `${id}`);
    } else {
      const user = await database.query<User>(SELECT_USER_BY_ID_QUERY, [id]);
      return user.rows[0];
    }
  } catch (_) {
    return `An error occurred getting user by id.`;
  }
};

export const getUserByPin = async (pin: string) => {
  try {
    const cachedData: any = await getCachedData(usersCacheKey);

    if (cachedData) {
      return cachedData.find((user: any) => user.pin === pin);
    } else {
      const user = await database.query<User>(SELECT_USER_BY_PIN_QUERY, [pin]);
      return user.rows[0];
    }
  } catch (_) {
    return `An error occurred getting the user.`;
  }
};

export const doesTokenExist = async (token: string) => {
  try {
    const cachedData: any = await getCachedData(usersCacheKey);
    let userId: number | undefined;

    if (cachedData) {
      userId = cachedData.find((user: any) => user.access_token === token).id;
    } else {
      userId = (await database.query<User>(SELECT_USER_BY_TOKEN_QUERY, [token]))
        .rows[0]?.id;
    }

    if (userId) {
      return true;
    }

    return false;
  } catch (_) {
    return false;
  }
};

export const userIsAdmin = async (token: string) => {
  try {
    const cachedData: any = await getCachedData(usersCacheKey);

    if (cachedData) {
      return cachedData.find((user: any) => user.access_token === token).admin;
    } else {
      const user = await database.query<User>(SELECT_USER_BY_TOKEN_QUERY, [
        token,
      ]);

      if (user.rowCount > 0) {
        return user.rows[0].admin;
      }
    }

    return false;
  } catch (_) {
    return false;
  }
};

export const isTokenMatch = async (user_id: Number, token: string) => {
  try {
    const cachedData: any = await getCachedData(usersCacheKey);

    if (cachedData) {
      return (
        cachedData.find((user: any) => user.access_token === token).id ===
        `${user_id}`
      );
    } else {
      return (
        (await database.query<User>(SELECT_USER_BY_TOKEN_QUERY, [token]))
          .rows[0]?.id === user_id
      );
    }
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
      user.code,
      user.access_token,
      user.refresh_token,
      user.expires_in / 1000,
      user.admin,
    ]);

    //Delete cache and initialize it again
    cache.del(usersCacheKey);
    await getUsers();

    return inserted.rows[0];
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
