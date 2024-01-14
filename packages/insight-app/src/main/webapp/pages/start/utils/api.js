export const fetchWithCredentials = async (url, method, body = null) => {
    const requestOptions = {
        method: method,
        credentials: "include",
        redirect: "follow",
        body: body ? JSON.stringify(body) : null,
    };
    const response = await fetch(url, requestOptions);
    return response.json();
};
