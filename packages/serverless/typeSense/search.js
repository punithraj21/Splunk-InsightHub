import { client } from "./typeSenseIndexData.js";

// Function to extract highlights from the search response
function extractHighlights(searchResp) {
    const highlightsArray = [];

    // Iterating over each hit in the search response
    searchResp.hits.forEach((hit) => {
        if (hit.highlights) {
            // Extracting and sanitizing highlight information
            hit.highlights.forEach((highlight) => {
                const sanitizedSnippet = highlight.snippet.replace(/<\/?mark>/g, "");
                highlightsArray.push({
                    field: highlight.field,
                    matchedTokens: highlight.matched_tokens,
                    snippet: sanitizedSnippet,
                });
            });
        }
    });

    return highlightsArray;
}

// Async function to handle search requests
const search = async (event) => {
    // Extracting query parameters
    const { query, page = 1, type = "all" } = event.queryStringParameters;
    try {
        // Mapping filter types to specific filters
        const filterTypes = {
            dashboards: "type:dashboard",
            reports: "type:report",
            apps: "type:app",
            fields: "type:field",
            indexes: "type:index",
            lookups: "type:lookup",
            allKnowledgeObjects: "type:dashboard || type:report || type:app",
            allDataInventory: "type:index || type:lookup || type:field",
        };
        // Determining the filter to apply based on the type
        const filter = filterTypes[type];
        // Executing the search query with Typesense client
        const searchResp = await client
            .collections("splunk_host")
            .documents()
            .search({
                q: query,
                query_by: "name,description",
                per_page: 30,
                filter_by: filter,
                page: page || 1,
            });

        // Extracting highlights from the search response
        const highlightsData = extractHighlights(searchResp);

        // Mapping and filtering search hits to create a results array
        const filteredResults = searchResp.hits
            .map((hit) => {
                return {
                    name: hit.document.name,
                    type: hit.document.type,
                    description: hit.document.description,
                    author: hit.document.author,
                    id: hit.document.id,
                };
            })
            .filter((result) => result !== undefined);

        // Compiling the final search results
        const results = {
            data: filteredResults,
            paging: {
                currentPage: searchResp.page,
                totalPages: Math.ceil(searchResp.found / 30),
                totalItems: searchResp.found,
                itemsPerPage: 30,
            },
            searchResp: searchResp,
            searchOptions: highlightsData,
        };
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ results }),
        };
    } catch (error) {
        // Handling any errors that occur during the search
        console.log("error: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
        };
    }
};

export { search };
