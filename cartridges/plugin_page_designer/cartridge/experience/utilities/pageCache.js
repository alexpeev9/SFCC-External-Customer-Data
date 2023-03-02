function pageCache() {
    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    response.setExpires(expires);
}

module.exports = pageCache;
