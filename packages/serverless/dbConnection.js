import { MongoClient } from "mongodb";

// MongoDB connection URL
const url = "mongodb+srv://splunk:Whiteshark@splunk-dev.g5tmsam.mongodb.net/";
// Creating a new MongoDB client instance with the connection URL
const client = new MongoClient(url);
// Specifying the database name to connect to
const dbName = "splunk";

// Asynchronous function to establish a connection to the MongoDB database
export async function connectToDb() {
    // Connecting to the MongoDB client
    await client.connect();
    console.log("Connected successfully to server");
    // Returning the database instance for further operations
    return client.db(dbName);
}
