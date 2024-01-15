import { fetchCountsFromBothCollections } from "./overview/handler.js";
import { fetchApps, fetchDashboards, fetchFieldSummary, fetchReports, fetchDataPaginated, updateMeta, updateClass } from "./splunkApi.js";

// Function to list dashboards from Splunk
const listDashboards = async (event) => {
    const { username, password, offset } = JSON.parse(event.body);

    try {
        const dashboards = await fetchDashboards({ username, password, offset });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ dashboards }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch dashboards" }),
        };
    }
};

// Function to list reports from Splunk
const listReports = async (event) => {
    const { username, password, offset } = JSON.parse(event.body);

    try {
        const reports = await fetchReports({ username, password, offset });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ reports }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch reports" }),
        };
    }
};

// Function to list fields from Splunk
const listFields = async (event) => {
    const { username, password, offset } = JSON.parse(event.body);

    try {
        const fields = await fetchFieldSummary({ username, password, offset });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ fields }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch fields" }),
        };
    }
};

// Function to list apps from Splunk
const listApps = async (event) => {
    const { username, password, offset } = JSON.parse(event.body);

    try {
        const fields = await fetchApps({ username, password, offset });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ fields }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch Apps" }),
        };
    }
};

// Function to fetch paginated results based on a type
const fetchPaginatedResults = async (event) => {
    const { page, limit, type } = event.queryStringParameters;

    try {
        const results = await fetchDataPaginated({ page, limit, type });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ results }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch Data" }),
        };
    }
};

// Function to fetch overview results (counts) from collections
const fetchOverviewResults = async (event) => {
    try {
        const results = await fetchCountsFromBothCollections();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ results }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch Data" }),
        };
    }
};

// Function to update meta label for a specific document
const updateMetaLabel = async (event) => {
    const { id, metaLabel, typesenseId = "" } = JSON.parse(event.body);
    try {
        const results = await updateMeta({ id, metaLabel, typesenseId });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ results }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to update Meta Label" }),
        };
    }
};

// Function to update classification for a specific document
const updateClassification = async (event) => {
    const { id, classification, typesenseId = "" } = JSON.parse(event.body);

    try {
        const results = await updateClass({ id, classification, typesenseId });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ results }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to update Classification" }),
        };
    }
};

// Exporting all functions for external use
export { listDashboards, listReports, listFields, listApps, fetchPaginatedResults, fetchOverviewResults, updateMetaLabel, updateClassification };
