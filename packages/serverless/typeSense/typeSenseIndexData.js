import Typesense from "typesense";
import { connectToDb } from "../dbConnection.js";

// Function to fetch documents from MongoDB in batches
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
        // Closing the database connection
        await db.client.close();
    }
}

// Initializing the Typesense client with configuration
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

// Function to index documents in Typesense
async function indexDocumentsInTypesense(documents) {
    try {
        const collectionName = "splunk_host";
        // Upserting each document into Typesense
        await Promise.all(documents.map((doc) => client.collections(collectionName).documents().upsert(doc)));
        console.log("Batch of documents indexed in Typesense");
    } catch (error) {
        console.error("Error indexing documents in Typesense:", error);
    }
}

// Function to create a Typesense collection if it does not exist
async function createCollectionIfNotExists(schema) {
    try {
        // Attempting to retrieve the collection
        await client.collections("splunk_host").retrieve();
        console.log("Collection already exists");
    } catch (error) {
        // If collection does not exist, create a new one
        if (error.httpStatus === 404) {
            console.log("Collection not found. Creating collection...");
            await client.collections().create(schema);
            console.log("Collection created");
        } else {
            console.error("Error checking collection existence:", error);
        }
    }
}

// Main function to fetch data from MongoDB and index it in Typesense
const fetchAndIndexTypeSenseData = async () => {
    const batchSize = 100;
    let skip = 0;
    let documents;

    // Defining the schema for the Typesense collection
    const schema = {
        name: "splunk_host",
        fields: [
            { name: "name", type: "string" },
            { name: "type", type: "string" },
            { name: "description", type: "string" },
            { name: "author", type: "string" },
            { name: "_id", type: "string" },
            { name: "metaLabel", type: "array" },
            { name: "classification", type: "string" },
            { name: "app", type: "string" },
        ],
    };

    // Creating the collection if it does not exist
    await createCollectionIfNotExists(schema);

    do {
        // Fetching documents in batches
        documents = await fetchDocumentsFromMongoDB(batchSize, skip);

        if (documents.length > 0) {
            // Filtering and structuring documents for Typesense indexing
            const filteredDocs = documents.map((doc) => {
                return {
                    name: doc.name,
                    type: doc.type,
                    description: doc.content.description || "",
                    author: doc.author,
                    _id: doc._id,
                    metaLabel: doc.metaLabel || [],
                    classification: doc.classification || "",
                    app: doc.acl.app,
                };
            });

            // Indexing the documents in Typesense
            await indexDocumentsInTypesense(filteredDocs);
            // Incrementing skip to fetch the next batch
            skip += batchSize;
        }
    } while (documents.length === batchSize);
};

export { fetchAndIndexTypeSenseData, client };
