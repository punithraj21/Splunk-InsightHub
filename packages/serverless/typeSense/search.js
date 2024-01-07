import { client } from "./typeSenseIndexData.js";

function extractHighlights(searchResp) {
    const highlightsArray = [];

    searchResp.hits.forEach((hit) => {
        if (hit.highlights) {
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

const search = async (event) => {
    const { query, page = 1, type = "all" } = event.queryStringParameters;
    try {
        const searchResp = await client
            .collections("splunk_host")
            .documents()
            .search({
                q: query,
                query_by: "name,type,author,description",
                per_page: 30,
                page: page || 1,
            });

        const highlightsData = extractHighlights(searchResp);

        const filteredResults = searchResp.hits
            .map((hit) => {
                if (type !== "all" && type === hit.document.type) {
                    return {
                        name: hit.document.name,
                        type: hit.document.type,
                        description: hit.document.description,
                        author: hit.document.author,
                        id: hit.document.id,
                    };
                } else if (type === "all") {
                    return {
                        name: hit.document.name,
                        type: hit.document.type,
                        description: hit.document.description,
                        author: hit.document.author,
                        id: hit.document.id,
                    };
                } else {
                    return undefined;
                }
            })
            .filter((result) => result !== undefined);

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
            body: JSON.stringify({ results }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
        };
    }
};

export { search };
