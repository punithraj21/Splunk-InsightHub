import { client } from "./typeSenseIndexData.js";

const search = async (event) => {
    const { query, page = 1 } = event.queryStringParameters;

    client
        .collections("splunk_host")
        .documents()
        .search({
            q: query,
            query_by: "name,type,author,description",
            per_page: 30,
            page: page || 1,
        })
        .then((result) => {
            return {
                statusCode: 200,
                body: JSON.stringify({ result }),
            };
        })
        .catch((error) => {
            return {
                statusCode: 500,
                body: JSON.stringify({ error }),
            };
        });
};

export { search };
