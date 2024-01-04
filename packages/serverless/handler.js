import {
  fetchApps,
  fetchDashboards,
  fetchFieldSummary,
  fetchReports,
} from "./splunkApi.js";

const listDashboards = async (event) => {
  const { username, password, offset } = JSON.parse(event.body);

  try {
    const dashboards = await fetchDashboards({ username, password, offset });
    return {
      statusCode: 200,
      body: JSON.stringify({ dashboards }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch dashboards" }),
    };
  }
};

const listReports = async (event) => {
  const { username, password, offset } = JSON.parse(event.body);

  try {
    const reports = await fetchReports({ username, password, offset });
    return {
      statusCode: 200,
      body: JSON.stringify({ reports }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch reports" }),
    };
  }
};

const listFields = async (event) => {
  const { username, password, offset } = JSON.parse(event.body);

  try {
    const fields = await fetchFieldSummary({ username, password, offset });
    return {
      statusCode: 200,
      body: JSON.stringify({ fields }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch fields" }),
    };
  }
};

const listApps = async (event) => {
  const { username, password, offset } = JSON.parse(event.body);

  try {
    const fields = await fetchApps({ username, password, offset });
    return {
      statusCode: 200,
      body: JSON.stringify({ fields }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch Apps" }),
    };
  }
};

export { listDashboards, listReports, listFields, listApps };
