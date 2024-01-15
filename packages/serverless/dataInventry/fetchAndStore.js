import fetch from "node-fetch";
import https from "https";

// Constants for Splunk host, username, and password
const SPLUNK_HOST = "https://localhost:8089";
const USERNAME = "punithraj";
const PASSWORD = "Whiteshark@1";

// HTTPS agent for handling requests to HTTPS endpoints
const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Disables SSL certificate validation
});

// Main function to fetch and store data from Splunk
async function fetchAndStore(event) {
    try {
        // Fetching fields, lookups, and indexes in parallel
        const [fields, lookups, indexes] = await Promise.all([fetchFields(), fetchLookups(), fetchIndexes()]);

        // Returning a successful response with fetched data
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ fields, lookups, indexes }),
        };
    } catch (error) {
        console.error("Error fetching data from Splunk:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to fetch data from Splunk" }),
        };
    }
}

// Function to fetch field data from Splunk
async function fetchFields() {
    const endpoint = `${SPLUNK_HOST}/servicesNS/-/-/data/props/extractions?output_mode=json`;
    return fetchData(endpoint);
}

// Function to fetch lookup data from Splunk
async function fetchLookups() {
    const endpoint = `${SPLUNK_HOST}/servicesNS/-/-/data/transforms/lookups?output_mode=json`;
    return fetchData(endpoint);
}

// Function to fetch index data from Splunk
async function fetchIndexes() {
    const endpoint = `${SPLUNK_HOST}/services/data/indexes?output_mode=json`;
    return fetchData(endpoint);
}

// Generic function to fetch data from a given Splunk endpoint
async function fetchData(endpoint) {
    // Encoding credentials for Basic Authentication
    const token = Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");
    // Making an HTTP GET request to the specified endpoint
    const response = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Basic ${token}` },
        agent: httpsAgent,
    });
    // Parsing and returning the JSON response
    const data = await response.json();
    return data;
}

// Exporting functions for external use
export { fetchAndStore, fetchFields, fetchLookups, fetchIndexes, fetchData };
