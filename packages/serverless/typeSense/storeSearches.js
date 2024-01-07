import { connectToDb } from "../dbConnection.js";

const storeSearches = async (event) => {
    const { searchTerm } = JSON.parse(event.body);

    try {
        const db = await connectToDb();
        const collection = db.collection("searches");

        await collection.insertOne({ searchTerm, createdAt: new Date() });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Search term saved successfully" }),
        };
    } catch (error) {
        console.error("Error inserting search term into MongoDB:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

export { storeSearches };
