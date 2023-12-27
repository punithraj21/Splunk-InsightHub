import dotenv from "dotenv";
import fetch from "node-fetch";
import https from "https";

dotenv.config();

const splunkHost = process.env.SPLUNK_HOST || "127.0.0.1";
const splunkPort = process.env.SPLUNK_PORT || 8089;
const username = process.env.SPLUNK_USERNAME;
const password = process.env.SPLUNK_PASSWORD;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function fetchDashboards({ username, password }) {
  try {
    const token = Buffer.from(`${username}:${password}`).toString("base64");

    fetch(
      `https://${splunkHost}:${splunkPort}/servicesNS/-/-/data/ui/views?output_mode=json`,
      {
        method: "GET",
        headers: { Authorization: `Basic ${token}` },
        agent: httpsAgent,
      }
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  } catch (error) {
    console.error("Error fetching dashboards: ", error);
  }
}

async function fetchReports({ username, password }) {
  try {
    const token = Buffer.from(`${username}:${password}`).toString("base64");

    fetch(
      `https://${splunkHost}:${splunkPort}/servicesNS/-/-/saved/searches?output_mode=json`,
      {
        method: "GET",
        headers: { Authorization: `Basic ${token}` },
        agent: httpsAgent,
      }
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  } catch (error) {
    console.error("Error fetching dashboards: ", error);
  }
}

async function fetchFieldSummary({ username, password }) {
  const searchQuery = "search index=_internal | fieldsummary";
  const token = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    fetch(
      `https://${splunkHost}:${splunkPort}/services/search/jobs?output_mode=json`,
      {
        method: "POST",

        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `search=${encodeURIComponent(searchQuery)}`,
        agent: httpsAgent,
      }
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  } catch (error) {
    console.error("Error fetching field summary: ", error);
  }
}

async function fetchApps({ username, password }) {
  try {
    const token = Buffer.from(`${username}:${password}`).toString("base64");

    fetch(
      `https://${splunkHost}:${splunkPort}/services/apps/local?output_mode=json`,
      {
        method: "GET",
        headers: { Authorization: `Basic ${token}` },
        agent: httpsAgent,
      }
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  } catch (error) {
    console.error("Error fetching apps: ", error);
  }
}

export { fetchDashboards, fetchReports, fetchFieldSummary, fetchApps };
