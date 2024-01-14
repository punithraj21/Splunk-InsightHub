import { fetchApps, fetchDashboards, fetchReports } from "./splunkApi.js";
import { fetchFields, fetchIndexes, fetchLookups } from "./dataInventry/fetchAndStore.js";

import { connectToDb } from "./dbConnection.js";

// Function to seed all data into the MongoDB database
async function storeAllDataToDB(event) {
    // const { username, password } = event.body;

    try {
        const db = await connectToDb();
        const collection = db.collection("splunk_host");

        const total = 205;
        const perPage = 30;

        const storeAllData = [];

        const totalPages = Math.ceil(total / perPage);

        // Loop through each page
        for (let i = 0; i < totalPages; i++) {
            const offset = i * perPage;

            // Fetch and process dashboards
            const dashboardData = await fetchDashboards({ username, password, offset });
            dashboardData.entry.forEach((item) => {
                item.type = "dashboard";
            });
            storeAllData.push(...dashboardData.entry);

            // Fetch and process reports
            const reportsData = await fetchReports({ username, password, offset });
            reportsData.entry.forEach((item) => {
                item.type = "report";
            });
            storeAllData.push(...reportsData.entry);

            // Fetch and process Apps
            const apps = await fetchApps({ username, password, offset });
            apps.entry.forEach((item) => {
                item.type = "app";
            });
            storeAllData.push(...apps.entry);

            // Fetch and process fields
            const fields = await fetchFields();
            fields.entry.forEach((item) => {
                item.type = "field";
            });
            storeAllData.push(...fields.entry);

            // Fetch and process lookups
            const lookups = await fetchLookups();
            lookups.entry.forEach((item) => {
                item.type = "lookup";
            });
            storeAllData.push(...lookups.entry);

            // Fetch and process indexes
            const indexes = await fetchIndexes();
            indexes.entry.forEach((item) => {
                item.type = "index";
            });
            storeAllData.push(...indexes.entry);
        }

        //Insert All the Data to collection
        const result = await collection.insertMany(storeAllData);

        return `Data Insertion successful. Total Count: ${result.insertedCount}`;
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        // Ensuring the database connection is closed
        await client.close();
    }
}

export { storeAllDataToDB };
