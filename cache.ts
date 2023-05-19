import NodeCache from "node-cache";
import { getLevels } from "./controller/levelController";
import { getSubmissions } from "./controller/submissionController";
import { getUsers } from "./controller/userController";

//NOTE: When the process exits, the db.ts closeConnection method also handles the cache flush

let cache: NodeCache;

const createCache = async () => {
  try {
    cache = new NodeCache();

    cache.on("error", (err: any) =>
      console.log(" ### NODE-CACHE ERROR ###\n", err)
    );
  } catch (error) {
    console.log(error);
  }
};

const initializeCache = async () => {
  await getLevels();
  await getUsers();
  await getSubmissions();
};

const start = async () => {
  await createCache();
  await initializeCache();
};

start();

const getCachedData = async (cacheKey: string) => {
  let data: any = await cache.get(cacheKey);

  if (data) {
    return JSON.parse(data);
  }

  return undefined;
};

export { cache, getCachedData };
