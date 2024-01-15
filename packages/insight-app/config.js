// The URL of the server where API calls are made
const SERVER_URL = "https://9rkq3t94dc.execute-api.ap-south-1.amazonaws.com/dev";

// Array of main tabs used in the application's navigation
const mainTabs = ["overview", "knowledgeObjects", "dataInventory"];

// Object mapping each main tab to its corresponding sub-tabs
const tabs = {
    knowledgeObjects: ["allKnowledgeObjects", "dashboards", "reports", "apps"],
    dataInventory: ["allDataInventory", "lookups", "fields", "indexes"],
    overview: ["dashboards", "reports", "apps"],
};

// Mapping of dropdown options used for filtering or selecting data categories
const dropDownOptions = {
    knowledgeObjects: { allKnowledgeObjects: "allKnowledgeObjects", dashboards: "dashboard", reports: "report", apps: "app" },
    dataInventory: { allDataInventory: "allDataInventory", lookups: "lookup", fields: "field", indexes: "index" },
};

// Array of classification types used in the application
const classificationType = ["topSecretSCI", "topSecret", "secret", "confidential", "unclassified"];

// Exporting the constants for use in other parts of the application
export { mainTabs, tabs, dropDownOptions, SERVER_URL, classificationType };
