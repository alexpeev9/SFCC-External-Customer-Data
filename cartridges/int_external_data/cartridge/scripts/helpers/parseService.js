"use strict";

const firebaseService = require("*/cartridge/scripts/firebaseService.js"); // define firebaseService

/**
 * Calls service and parse response
 * @param {string} method - method type for request
 * @param {string} route - route url for request
 * @param {Object} body - body data for request
 * @returns {Object} returns service configuration
 */
function call(method, route, body) {
    const response = firebaseService.execute().call({
        method,
        route,
        body,
    }).object; // call service

    return JSON.parse(response); // parse raw response
}

module.exports = {
    call,
};
