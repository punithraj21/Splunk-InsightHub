import { connectToDb } from "../dbConnection.js";

// Async function to store search terms in a MongoDB collection
const storeSearches = async (event) => {
    // Parsing the search term from the event body
    const { searchTerm } = JSON.parse(event.body);

    try {
        // Connecting to the MongoDB database
        const db = await connectToDb();
        // Accessing the 'searches' collection
        const collection = db.collection("searches");

        // Inserting a new document with the search term and the current timestamp
        await collection.insertOne({ searchTerm, createdAt: new Date() });

        // Returning a success response
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8000",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ message: "Search term saved successfully" }),
        };
    } catch (error) {
        // Logging and returning an error response in case of failure
        console.error("Error inserting search term into MongoDB:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

export { storeSearches };
