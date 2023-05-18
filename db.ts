import { Pool } from "pg";
import { cache } from "./cache";

let database: Pool;

const connectDb = async () => {
  try {
    database = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: Number.parseInt(process.env.PGPORT as string) ?? 5432,
      keepAlive: true,
    });

    database.on("error", (err: any) =>
      console.log("### NODE-PG ERROR ###\n", err)
    );
  } catch (error) {
    console.log(error);
  }
};

const closeConnection = async (_: any) => {
  //Needs _ argument, otherwise it would be called after server start for some reason...
  if (database) {
    await database.end();
  }

  if (cache) {
    cache.close();
  }

  process.exit(); // Exit with default success-code '0'.
};

connectDb();
process.once("SIGTERM", closeConnection);
process.once("SIGINT", closeConnection);

export { database };
