import { connectToDb } from "../dbConnection.js";

async function countDocumentsByType(collectionName) {
    const db = await connectToDb();
    const collection = db.collection(collectionName);

    try {
        const pipeline = [
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                },
            },
        ];

        const countsByType = await collection.aggregate(pipeline).toArray();

        return countsByType;
    } catch (error) {
        console.error(`Error counting documents by type in ${collectionName}:`, error);
    } finally {
        await db.client.close();
    }
}

async function fetchCountsFromBothCollections() {
    try {
        const splunkHostCounts = await countDocumentsByType("splunk_host");
        const searchesCounts = await countDocumentsByType("searches");

        if (searchesCounts.length > 0) {
            searchesCounts[0]._id = "searches";
        }
        return splunkHostCounts.concat(searchesCounts);
    } catch (error) {
        console.error("Error fetching counts from collections:", error);
    }
}

export { countDocumentsByType, fetchCountsFromBothCollections };
