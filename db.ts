import { Db, MongoClient } from "mongodb";

let client: MongoClient;
let database: Db;

try {
    client = new MongoClient(process.env.CONNECTION_STRING ?? "");
    database = client.db(process.env.DATABASE_NAME);
} catch (error) {
    console.log(`Couldn't establish connection to database: ${error}`);
}

const closeConnection = (_: any) => { //Needs _ argument, otherwise it would be called after the server started for some reason...
    client.close(); // Close MongodDB Connection when Process ends
    process.exit(); // Exit with default success-code '0'.
};


process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);

export { database };
