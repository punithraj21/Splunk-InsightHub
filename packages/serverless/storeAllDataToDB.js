import { MongoClient } from "mongodb";
import { fetchApps, fetchDashboards, fetchReports } from "./splunkApi.js";

const url = "mongodb+srv://splunk:Whiteshark@splunk-dev.g5tmsam.mongodb.net/";
const client = new MongoClient(url);

const dbName = "splunk";

async function storeAllDataToDB(event) {
    const { username, password } = event.body;

    try {
        await client.connect();
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        const collection = db.collection("splunk_host");

        const total = 205;
        const perPage = 30;

        const storeAllData = [];

        const totalPages = Math.ceil(total / perPage);

        for (let i = 0; i < totalPages; i++) {
            const offset = i * perPage;

            //Fetch all Dashboards
            const dashboardData = await fetchDashboards({ username, password, offset });
            dashboardData.entry.forEach((item) => {
                item.type = "dashboard";
            });
            storeAllData.push(...dashboardData.entry);

            //Fetch all Reports
            const reportsData = await fetchReports({ username, password, offset });
            reportsData.entry.forEach((item) => {
                item.type = "report";
            });
            storeAllData.push(...reportsData.entry);

            //Fetch all Apps
            const fields = await fetchApps({ username, password, offset });
            fields.entry.forEach((item) => {
                item.type = "app";
            });
            storeAllData.push(...fields.entry);
        }
        //Insert All the Data to collection
        const result = await collection.insertMany(storeAllData);

        return `Data Insertion successful. Total Count: ${result.insertedCount}`;
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        await client.close();
    }
}

export { storeAllDataToDB };
