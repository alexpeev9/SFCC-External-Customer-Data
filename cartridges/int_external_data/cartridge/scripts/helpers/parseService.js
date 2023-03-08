"use strict";

const firebaseService = require("*/cartridge/scripts/firebaseService.js"); // define firebaseService

/**
 * Calls the firebase api
 * @returns {Object} Object - returns service configuration
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
