"use strict";

/**
 * @namespace Account
 */

const server = require("server");
server.extend(module.superModule);

const csrfProtection = require("*/cartridge/scripts/middleware/csrf");
const userLoggedIn = require("*/cartridge/scripts/middleware/userLoggedIn");
const consentTracking = require("*/cartridge/scripts/middleware/consentTracking");

/**
 * Account-SubmitRegistration : The Account-SubmitRegistration endpoint is the endpoint that gets hit when a shopper submits their registration for a new account
 * @name Base/Account-SubmitRegistration
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {querystringparameter} - rurl - redirect url. The value of this is a number. This number then gets mapped to an endpoint set up in oAuthRenentryRedirectEndpoints.js
 * @param {httpparameter} - dwfrm_profile_customer_firstname - Input field for the shoppers's first name
 * @param {httpparameter} - dwfrm_profile_customer_lastname - Input field for the shopper's last name
 * @param {httpparameter} - dwfrm_profile_customer_phone - Input field for the shopper's phone number
 * @param {httpparameter} - dwfrm_profile_customer_email - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_customer_emailconfirm - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_login_password - Input field for the shopper's password
 * @param {httpparameter} - dwfrm_profile_login_passwordconfirm: - Input field for the shopper's password to confirm
 * @param {httpparameter} - dwfrm_profile_customer_addtoemaillist - Checkbox for whether or not a shopper wants to be added to the mailing list
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.append(
    "SubmitRegistration",
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        const CustomerMgr = require("dw/customer/CustomerMgr");
        const Resource = require("dw/web/Resource");
        const formErrors = require("*/cartridge/scripts/formErrors");
        const userService = require("*/cartridge/scripts/userService.js");
        const registrationForm = server.forms.getForm("profile");

        const body = {
            firstname: registrationForm.customer.firstname.value,
            lastname: registrationForm.customer.lastname.value,
            email: registrationForm.customer.email.value,
            phone: registrationForm.customer.phone.value,
            password: registrationForm.login.password.value,
        };

        userService
            .execute()
            .call({ method: "POST", route: "/users.json", body }).object;

        return next();
    }
);

module.exports = server.exports();
