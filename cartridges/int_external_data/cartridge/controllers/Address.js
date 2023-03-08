"use strict";

/**
 * @namespace Address
 */

var server = require("server");
server.extend(module.superModule);

var URLUtils = require("dw/web/URLUtils");
var Resource = require("dw/web/Resource");
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var userLoggedIn = require("*/cartridge/scripts/middleware/userLoggedIn");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");

const parseService = require("*/cartridge/scripts/helpers/parseService.js");

/**
 * Address-SaveAddress : Save a new or existing address
 * @name Base/Address-SaveAddress
 * @function
 * @memberof Address
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {querystringparameter} - addressId - a string used to identify the address record
 * @param {httpparameter} - dwfrm_address_addressId - An existing address id (unless new record)
 * @param {httpparameter} - dwfrm_address_firstName - A person’s first name
 * @param {httpparameter} - dwfrm_address_lastName - A person’s last name
 * @param {httpparameter} - dwfrm_address_address1 - A person’s street name
 * @param {httpparameter} - dwfrm_address_address2 -  A person’s apartment number
 * @param {httpparameter} - dwfrm_address_country - A person’s country
 * @param {httpparameter} - dwfrm_address_states_stateCode - A person’s state
 * @param {httpparameter} - dwfrm_address_city - A person’s city
 * @param {httpparameter} - dwfrm_address_postalCode - A person’s united states postel code
 * @param {httpparameter} - dwfrm_address_phone - A person’s phone number
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.append(
    "SaveAddress",
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        const URLUtils = require("dw/web/URLUtils");
        const formErrors = require("*/cartridge/scripts/formErrors");
        const addressForm = server.forms.getForm("address"); // get address form
        const customerNo = req.currentCustomer.profile.customerNo; // get customerNo, needed for service
        let userDataSuccess, userData;

        // check if form is valid
        if (addressForm.valid) {
            // new address info
            const address = {
                addressId: addressForm.addressId.value,
                firstName: addressForm.firstName.value,
                lastName: addressForm.lastName.value,
                address1: addressForm.address1.value,
                address2: addressForm.address2.value,
                city: addressForm.city.value,
                postalCode: addressForm.postalCode.value,
                country: addressForm.country.value,
                states: addressForm.states.value,
                phone: addressForm.phone.value,
            };

            // get user data
            userData = parseService.call("GET", `/users/${customerNo}.json`);

            if (userData) {
                // check if address exists
                if (userData.addresses) {
                    userData.addresses.push(address); // if address exists, add it to array
                } else {
                    userData.addresses = [address]; // if address doesn't exist, create property with array field
                }
                // Add new address
                userDataSuccess = parseService.call(
                    "PUT",
                    `/users/${customerNo}.json`,
                    userData
                );
            }

            this.on("route:BeforeComplete", function () {
                // if error with database, display database connection message
                if (!userDataSuccess) {
                    res.setStatusCode(500);
                    res.json({
                        success: false,
                        error: true,
                        redirectUrl: URLUtils.url(
                            "Error-ErrorCode",
                            "err",
                            "02"
                        ).toString(),
                    });
                }
            });
        } else {
            res.json({
                success: false,
                fields: formErrors.getFormErrors(addressForm),
            });
        }
        return next();
    }
);

module.exports = server.exports();
