function get(object, path, defaultValue) {
    if (typeof path === "string") {
        path = path.replace(/\[(\w+)\]/g, ".$1").split(".");
    }

    const result = path.reduce((currentObject, key) => {
        return currentObject !== null && currentObject !== undefined ? currentObject[key] : undefined;
    }, object);

    return result !== undefined ? result : defaultValue;
}

export { get };
