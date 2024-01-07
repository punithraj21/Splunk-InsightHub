import Typesense from "typesense";
import { connectToDb } from "../dbConnection.js";

async function fetchDocumentsFromMongoDB(batchSize, skip) {
    const db = await connectToDb();
    const collection = db.collection("splunk_host");
    try {
        // Fetch documents in batches
        const documents = await collection.find({}).skip(skip).limit(batchSize).toArray();
        return documents;
    } catch (error) {
        console.error("Error fetching documents:", error);
        return []; // Return an empty array in case of error
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
        console.log("Batch of documents indexed in Typesense");
    } catch (error) {
        console.error("Error indexing documents in Typesense:", error);
    }
}

async function createCollectionIfNotExists(schema) {
    try {
        await client.collections("splunk_host").retrieve();
        console.log("Collection already exists");
    } catch (error) {
        if (error.httpStatus === 404) {
            console.log("Collection not found. Creating collection...");
            await client.collections().create(schema);
            console.log("Collection created");
        } else {
            console.error("Error checking collection existence:", error);
        }
    }
}

const fetchAndIndexTypeSenseData = async () => {
    const batchSize = 100;
    let skip = 0;
    let documents;

    const schema = {
        name: "splunk_host",
        fields: [
            { name: "name", type: "string" },
            { name: "type", type: "string" },
            { name: "description", type: "string" },
            { name: "author", type: "string" },
            { name: "_id", type: "string" },
        ],
    };

    await createCollectionIfNotExists(schema);

    do {
        documents = await fetchDocumentsFromMongoDB(batchSize, skip);

        if (documents.length > 0) {
            const filteredDocs = documents.map((doc) => {
                return { name: doc.name, type: doc.type, description: doc.content.description || "", author: doc.author, _id: doc._id };
            });

            await indexDocumentsInTypesense(filteredDocs);
            skip += batchSize;
        }
    } while (documents.length === batchSize);
};

export { fetchAndIndexTypeSenseData, client };
