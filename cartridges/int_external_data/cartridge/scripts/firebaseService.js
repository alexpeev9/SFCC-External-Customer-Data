"use strict";

const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");

/**
 * Creates firebase service
 * @returns {Object} returns service configuration
 */
function execute() {
    const response = LocalServiceRegistry.createService("http.firebase.user", {
        createRequest: function (svc, args) {
            svc.setRequestMethod(args.method);
            svc.URL += args.route;
            return JSON.stringify(args.body);
        },
        parseResponse: function (svc, client) {
            return client.text;
        },
        filterLogMessage: function (msg) {
            return msg.replace(/"password\"\:\".*?\"/, `"password":"******"`);
        },
    });

    return response;
}

module.exports = {
    execute: execute,
};
