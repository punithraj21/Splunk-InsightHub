import dotenv from "dotenv";
import fetch from "node-fetch";
import https from "https";
dotenv.config();

import { connectToDb } from "./dbConnection.js";
import { ObjectId } from "mongodb";

// Environment variables for Splunk host details and credentials
const splunkHost = process.env.SPLUNK_HOST || "127.0.0.1";
const splunkPort = process.env.SPLUNK_PORT || 8089;

// HTTPS agent configuration for making requests
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

// Function to fetch dashboard data from Splunk
async function fetchDashboards({ username, password, offset }) {
    try {
        const token = Buffer.from(`${username}:${password}`).toString("base64");

        const resp = await fetch(`https://${splunkHost}:${splunkPort}/servicesNS/-/-/data/ui/views?offset=${offset ? offset : 0}&output_mode=json`, {
            method: "GET",
            headers: { Authorization: `Basic ${token}` },
            agent: httpsAgent,
        });
        const response = await resp.json();
        return response;
    } catch (error) {
        console.error("Error fetching dashboards: ", error);
    }
}

// Function to fetch report data from Splunk
async function fetchReports({ username, password, offset }) {
    try {
        const token = Buffer.from(`${username}:${password}`).toString("base64");

        const resp = await fetch(`https://${splunkHost}:${splunkPort}/servicesNS/-/-/saved/searches?offset=${offset ? offset : 0}&output_mode=json`, {
            method: "GET",
            headers: { Authorization: `Basic ${token}` },
            agent: httpsAgent,
        });
        const response = await resp.json();
        return response;
    } catch (error) {
        console.error("Error fetching dashboards: ", error);
    }
}

// Function to fetch field summary from Splunk
async function fetchFieldSummary({ username, password, offset }) {
    const searchQuery = "search index=_internal | fieldsummary";
    const token = Buffer.from(`${username}:${password}`).toString("base64");

    try {
        const resp = await fetch(`https://${splunkHost}:${splunkPort}/services/search/jobs?offset=${offset ? offset : 0}&output_mode=json`, {
            method: "POST",

            headers: {
                Authorization: `Basic ${token}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `search=${encodeURIComponent(searchQuery)}`,
            agent: httpsAgent,
        });
        const response = await resp.json();
        return response;
    } catch (error) {
        console.error("Error fetching field summary: ", error);
    }
}

// Function to fetch apps from Splunk
async function fetchApps({ username, password, offset }) {
    try {
        const token = Buffer.from(`${username}:${password}`).toString("base64");

        const resp = await fetch(`https://${splunkHost}:${splunkPort}/services/apps/local?offset=${offset ? offset : 0}&output_mode=json`, {
            method: "GET",
            headers: { Authorization: `Basic ${token}` },
            agent: httpsAgent,
        });
        const response = await resp.json();
        return response;
    } catch (error) {
        console.error("Error fetching apps: ", error);
    }
}

// Function to fetch data from MongoDB in a paginated fashion
async function fetchDataPaginated({ page = 1, limit = 30, type = null }) {
    const db = await connectToDb();
    const collection = db.collection("splunk_host");

    try {
        const skip = (page - 1) * limit;
        const types = {
            dashboards: "dashboard",
            reports: "report",
            apps: "app",
            fields: "field",
            indexes: "index",
            lookups: "lookup",
            allKnowledgeObjects: ["dashboard", "report", "app"],
            allDataInventory: ["index", "lookup", "field"],
        };

        let query = {};
        type = types[type];

        if (Array.isArray(type)) {
            query.type = { $in: type };
        } else if (type && type.toLowerCase() !== "all") {
            query.type = type;
        }

        // Fetching paginated data
        const documents = await collection.find(query).skip(skip).limit(limit).toArray();
        const total = await collection.countDocuments(query);

        // Returning the paginated data
        return {
            data: documents,
            paging: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
        };
    } catch (error) {
        console.error("Error fetching paginated data:", error);
    } finally {
        await db.client.close();
    }
}

// Function to update the meta label of a document in MongoDB
async function updateMeta({ id, metaLabel }) {
    try {
        const db = await connectToDb();
        const collection = db.collection("splunk_host");
        const updatedResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    metaLabel,
                },
            }
        );
        return updatedResult;
    } catch (error) {
        console.error("Error updating meta label: ", error);
    }
}

// Function to update the classification of a document in MongoDB
async function updateClass({ id, classification }) {
    try {
        const db = await connectToDb();
        const collection = db.collection("splunk_host");
        const updatedResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    classification,
                },
            }
        );
        console.log("updatedResult: ", updatedResult);
        return updatedResult;
    } catch (error) {
        console.error("Error updating classification: ", error);
    }
}

// Function to fetch the current user's role from Splunk
async function fetchCurrentUserRole({ username, password }) {
    const endpoint = `https://${splunkHost}:${splunkPort}/services/authentication/users/${username}?output_mode=json`;
    const token = "Basic " + Buffer.from(username + ":" + password).toString("base64");

    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                Authorization: token,
            },
            agent: httpsAgent,
        });

        const data = await response.json();

        const roles = data.entry[0].content.roles;
        return roles;
    } catch (error) {
        console.error("Error fetching user role:", error);
    }
}

// Exporting all the functions for external use
export { fetchDashboards, fetchReports, fetchFieldSummary, fetchApps, fetchDataPaginated, updateMeta, updateClass, fetchCurrentUserRole };
