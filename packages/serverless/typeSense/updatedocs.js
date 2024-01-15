import { client } from "./typeSenseIndexData.js";

async function updateTypesenseDocument(documentId, updatedFields) {
    try {
        // Prepare the document for upsert
        let document = {
            id: documentId,
            ...updatedFields,
        };

        // Upsert the document
        const result = await client.collections("splunk_host").documents(document.id).update(document);

        return result;
    } catch (error) {
        console.error("Error updating document:", error);
    }
}

export { updateTypesenseDocument };
