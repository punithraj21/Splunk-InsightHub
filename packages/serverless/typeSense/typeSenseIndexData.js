import Typesense from "typesense";

import { connectToDb } from "../dbConnection.js";

async function fetchDocumentsFromMongoDB() {
    const db = await connectToDb();
    const collection = db.collection("splunk_host");
    try {
        // Fetch all documents
        const documents = await collection.find({}).toArray();
        return documents;
    } catch (error) {
        console.error("Error fetching documents:", error);
    } finally {
        await db.client.close();
    }
}

let client = new Typesense.Client({
    nodes: [
        {
            host: "1v6g3fjnoaz8lw95p-1.a1.typesense.net",
            port: "443",
            protocol: "https",
        },
    ],
    apiKey: "aRA4FmgqgGwhG5cGwc9YIGjEx18YCHUj",
    connectionTimeoutSeconds: 30,
});

async function indexDocumentsInTypesense(documents) {
    try {
        const collectionName = "splunk_host";
        await Promise.all(documents.map((doc) => client.collections(collectionName).documents().upsert(doc)));
        console.log("All documents indexed in Typesense");
    } catch (error) {
        console.error("Error indexing documents in Typesense:", error);
    }
}

const fetchAndIndexTypeSenseData = async () => {
    const documents = await fetchDocumentsFromMongoDB();

    //Retrieve Collection and Create if not exists
    const schema = {
        name: "splunk_host",
        fields: [
            { name: "name", type: "string" },
            { name: "type", type: "string" },
            { name: "description", type: "string" },
            { name: "author", type: "string" },
        ],
    };

    client
        .collections("splunk_host")
        .retrieve()
        .then(() => console.log("Collection exists"))
        .catch((error) => {
            if (error.httpStatus === 404) {
                console.log("Collection not found. Creating collection...");
                client
                    .collections()
                    .create(schema)
                    .then(() => console.log("Collection created"))
                    .catch((error) => console.error("Error creating collection:", error));
            } else {
                console.error(error);
            }
        });

    const filteredDocs = documents.map((doc) => {
        return { name: doc.name, type: doc.type, description: doc.content.description || "", author: doc.author };
    });

    await indexDocumentsInTypesense(filteredDocs);
};

export { fetchAndIndexTypeSenseData, client };
