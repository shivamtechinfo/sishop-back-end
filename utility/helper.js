function createUniqueName(originalName) {
    // Create a base unique ID (timestamp + random string)
    const uniqueId = Date.now().toString(36) + Math.random().toString(36);

    return `${uniqueId + originalName}`;
}

module.exports = { createUniqueName }
