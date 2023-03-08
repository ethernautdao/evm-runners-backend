import { Pool } from "pg";

let database: Pool;
const connectDb = async () => {
    try {
        database = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: Number.parseInt(process.env.PGPORT as string) ?? 5432,
        });

        await database.connect();

    } catch (error) {
        console.log(error);
    }
}

const closeConnection = async (_: any) => { //Needs _ argument, otherwise it would be called after server start for some reason...
    if (database) {
        await database.end();
    }
    process.exit(); // Exit with default success-code '0'.
};

connectDb();
process.on('SIGTERM', closeConnection);
process.on('SIGINT', closeConnection);

export { database };
