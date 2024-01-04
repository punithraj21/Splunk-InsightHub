import { MongoClient } from "mongodb";

const url = "mongodb+srv://splunk:Whiteshark@splunk-dev.g5tmsam.mongodb.net/";
const client = new MongoClient(url);
const dbName = "splunk";

export async function connectToDb() {
    await client.connect();
    console.log("Connected successfully to server");
    return client.db(dbName);
}
