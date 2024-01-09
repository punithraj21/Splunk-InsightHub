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

        if (collectionName === "splunk_host") {
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
            const metaCount = await collection.aggregate(metaPipeline).toArray();
            const metaLabel = [{ _id: "meta", count: metaCount[0].totalCount || 0 }];
            const countsByType = await collection.aggregate(pipeline).toArray();
            return countsByType.concat(metaLabel);
        }

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
        console.log("splunkHostCounts: ", splunkHostCounts);
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
