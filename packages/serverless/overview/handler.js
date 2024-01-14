import { connectToDb } from "../dbConnection.js";

// Function to count documents by their type in a given collection
async function countDocumentsByType(collectionName) {
    // Connecting to the database
    const db = await connectToDb();
    // Getting the collection from the database
    const collection = db.collection(collectionName);

    try {
        // Aggregation pipeline for grouping and counting documents by type
        const pipeline = [
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                },
            },
        ];
        // Special handling for the 'splunk_host' collection
        if (collectionName === "splunk_host") {
            // Additional pipeline steps for counting meta labels
            const metaPipeline = [
                {
                    $match: {
                        metaLabel: { $exists: true, $ne: null },
                    },
                },
                {
                    $unwind: "$metaLabel",
                },
                {
                    $count: "totalCount",
                },
            ];
            // Executing the metaPipeline aggregation
            const metaCount = await collection.aggregate(metaPipeline).toArray();
            // Preparing meta label count data
            const metaLabel = [{ _id: "meta", count: metaCount[0].totalCount || 0 }];
            // Executing the main pipeline aggregation
            const countsByType = await collection.aggregate(pipeline).toArray();
            // Combining and returning both counts
            return countsByType.concat(metaLabel);
        }
        // Executing the main pipeline aggregation for other collections
        const countsByType = await collection.aggregate(pipeline).toArray();
        return countsByType;
    } catch (error) {
        // Logging error in case of failure
        console.error(`Error counting documents by type in ${collectionName}:`, error);
    } finally {
        // Ensuring the database connection is closed
        await db.client.close();
    }
}

// Function to fetch counts from both 'splunk_host' and 'searches' collections
async function fetchCountsFromBothCollections() {
    try {
        // Fetching counts from 'splunk_host'
        const splunkHostCounts = await countDocumentsByType("splunk_host");
        // Fetching counts from 'searches'
        const searchesCounts = await countDocumentsByType("searches");
        // Special handling for searches count data
        if (searchesCounts.length > 0) {
            searchesCounts[0]._id = "searches";
        }
        // Combining and returning both counts
        return splunkHostCounts.concat(searchesCounts);
    } catch (error) {
        console.error("Error fetching counts from collections:", error);
    }
}
// Exporting functions for external use
export { countDocumentsByType, fetchCountsFromBothCollections };
