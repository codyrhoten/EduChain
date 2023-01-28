function error(msg) {
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
}

module.exports = { error };