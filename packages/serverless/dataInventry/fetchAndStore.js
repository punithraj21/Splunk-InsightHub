import fetch from "node-fetch";
import https from "https";

const SPLUNK_HOST = "https://localhost:8089";
const USERNAME = "punithraj";
const PASSWORD = "Whiteshark@1";

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

async function fetchAndStore(event) {
    try {
        const [fields, lookups, indexes] = await Promise.all([fetchFields(), fetchLookups(), fetchIndexes()]);

        return {
            statusCode: 200,
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

async function fetchFields() {
    const endpoint = `${SPLUNK_HOST}/servicesNS/-/-/data/props/extractions?output_mode=json`;
    return fetchData(endpoint);
}

async function fetchLookups() {
    const endpoint = `${SPLUNK_HOST}/servicesNS/-/-/data/transforms/lookups?output_mode=json`;
    return fetchData(endpoint);
}

async function fetchIndexes() {
    const endpoint = `${SPLUNK_HOST}/services/data/indexes?output_mode=json`;
    return fetchData(endpoint);
}

async function fetchData(endpoint) {
    const token = Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");
    const response = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Basic ${token}` },
        agent: httpsAgent,
    });
    const data = await response.json();
    return data;
}
fetchFields;
export { fetchAndStore, fetchFields, fetchLookups, fetchIndexes, fetchData };
