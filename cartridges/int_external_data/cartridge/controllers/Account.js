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
server.replace(
    "SubmitRegistration",
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        const CustomerMgr = require("dw/customer/CustomerMgr");
        const Resource = require("dw/web/Resource");
        const formErrors = require("*/cartridge/scripts/formErrors");
        const registrationForm = server.forms.getForm("profile");
        const userService = require("*/cartridge/scripts/userService.js"); // define userService

        // body for firebase query
        const body = {
            firstname: registrationForm.customer.firstname.value,
            lastname: registrationForm.customer.lastname.value,
            email: registrationForm.customer.email.value,
            phone: registrationForm.customer.phone.value,
            password: registrationForm.login.password.value,
        };

        // form validation
        if (
            registrationForm.customer.email.value.toLowerCase() !==
            registrationForm.customer.emailconfirm.value.toLowerCase()
        ) {
            registrationForm.customer.email.valid = false;
            registrationForm.customer.emailconfirm.valid = false;
            registrationForm.customer.emailconfirm.error = Resource.msg(
                "error.message.mismatch.email",
                "forms",
                null
            );
            registrationForm.valid = false;
        }

        if (
            registrationForm.login.password.value !==
            registrationForm.login.passwordconfirm.value
        ) {
            registrationForm.login.password.valid = false;
            registrationForm.login.passwordconfirm.valid = false;
            registrationForm.login.passwordconfirm.error = Resource.msg(
                "error.message.mismatch.password",
                "forms",
                null
            );
            registrationForm.valid = false;
        }

        if (
            !CustomerMgr.isAcceptablePassword(
                registrationForm.login.password.value
            )
        ) {
            registrationForm.login.password.valid = false;
            registrationForm.login.passwordconfirm.valid = false;
            registrationForm.login.passwordconfirm.error = Resource.msg(
                "error.message.password.constraints.not.matched",
                "forms",
                null
            );
            registrationForm.valid = false;
        }

        // setting variables for the BeforeComplete function
        var registrationFormObj = {
            firstName: registrationForm.customer.firstname.value,
            lastName: registrationForm.customer.lastname.value,
            phone: registrationForm.customer.phone.value,
            email: registrationForm.customer.email.value,
            emailConfirm: registrationForm.customer.emailconfirm.value,
            password: registrationForm.login.password.value,
            passwordConfirm: registrationForm.login.passwordconfirm.value,
            validForm: registrationForm.valid,
            form: registrationForm,
        };

        if (registrationForm.valid) {
            res.setViewData(registrationFormObj);

            this.on("route:BeforeComplete", function (req, res) {
                // eslint-disable-line no-shadow
                const Transaction = require("dw/system/Transaction");
                const accountHelpers = require("*/cartridge/scripts/helpers/accountHelpers");
                let authenticatedCustomer;
                let serverError;

                // getting variables for the BeforeComplete function
                const registrationForm = res.getViewData(); // eslint-disable-line

                if (registrationForm.validForm) {
                    const login = registrationForm.email;
                    const password = registrationForm.password;

                    // Refactored New Part

                    const response = userService.execute().call({
                        method: "POST",
                        route: "/users.json",
                        body,
                    }).object; // add user in database

                    const data = JSON.parse(response); // parse raw response

                    // if error with database, display database connection message
                    if (!data) {
                        registrationForm.validForm = false;
                        res.setViewData(registrationForm);
                        res.setStatusCode(500);
                        res.json({
                            success: false,
                            errorMessage: Resource.msg(
                                "database.connection",
                                "errors",
                                null
                            ),
                        });
                    }

                    // attempt to create a new user and log that user in.
                    try {
                        Transaction.wrap(function () {
                            let error = {};
                            const newCustomer = CustomerMgr.createCustomer(
                                login,
                                password,
                                data.name // saves firebase key to CustomerNo row in Customer table
                            );

                            const authenticateCustomerResult =
                                CustomerMgr.authenticateCustomer(
                                    login,
                                    password
                                );
                            if (
                                authenticateCustomerResult.status !== "AUTH_OK"
                            ) {
                                error = {
                                    authError: true,
                                    status: authenticateCustomerResult.status,
                                };
                                throw error;
                            }

                            authenticatedCustomer = CustomerMgr.loginCustomer(
                                authenticateCustomerResult,
                                false
                            );

                            if (!authenticatedCustomer) {
                                error = {
                                    authError: true,
                                    status: authenticateCustomerResult.status,
                                };
                                throw error;
                            } else {
                                // assign values to the profile
                                const newCustomerProfile =
                                    newCustomer.getProfile();

                                newCustomerProfile.firstName =
                                    registrationForm.firstName;
                                newCustomerProfile.lastName =
                                    registrationForm.lastName;
                                newCustomerProfile.phoneHome =
                                    registrationForm.phone;
                                newCustomerProfile.email =
                                    registrationForm.email;
                            }
                        });
                    } catch (e) {
                        if (e.authError) {
                            serverError = true;
                        } else {
                            registrationForm.validForm = false;
                            registrationForm.form.customer.email.valid = false;
                            registrationForm.form.customer.emailconfirm.valid = false;
                            registrationForm.form.customer.email.error =
                                Resource.msg(
                                    "error.message.username.invalid",
                                    "forms",
                                    null
                                );
                        }
                    }
                }

                delete registrationForm.password;
                delete registrationForm.passwordConfirm;
                formErrors.removeFormValues(registrationForm.form);

                if (serverError) {
                    res.setStatusCode(500);
                    res.json({
                        success: false,
                        errorMessage: Resource.msg(
                            "error.message.unable.to.create.account",
                            "login",
                            null
                        ),
                    });

                    return;
                }

                if (registrationForm.validForm) {
                    // send a registration email
                    accountHelpers.sendCreateAccountEmail(
                        authenticatedCustomer.profile
                    );

                    res.setViewData({
                        authenticatedCustomer: authenticatedCustomer,
                    });
                    res.json({
                        success: true,
                        redirectUrl: accountHelpers.getLoginRedirectURL(
                            req.querystring.rurl,
                            req.session.privacyCache,
                            true
                        ),
                    });

                    req.session.privacyCache.set("args", null);
                } else {
                    res.json({
                        fields: formErrors.getFormErrors(registrationForm),
                    });
                }
            });
        } else {
            res.json({
                fields: formErrors.getFormErrors(registrationForm),
            });
        }

        return next();
    }
);

/**
 * Account-SaveProfile : The Account-SaveProfile endpoint is the endpoint that gets hit when a shopper has edited their profile
 * @name Base/Account-SaveProfile
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {httpparameter} - dwfrm_profile_customer_firstname - Input field for the shoppers's first name
 * @param {httpparameter} - dwfrm_profile_customer_lastname - Input field for the shopper's last name
 * @param {httpparameter} - dwfrm_profile_customer_phone - Input field for the shopper's phone number
 * @param {httpparameter} - dwfrm_profile_customer_email - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_customer_emailconfirm - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_login_password  - Input field for the shopper's password
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {category} - sensititve
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.append(
    "SaveProfile",
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        const Resource = require("dw/web/Resource");
        const formErrors = require("*/cartridge/scripts/formErrors");
        const profileForm = server.forms.getForm("profile");
        const userService = require("*/cartridge/scripts/userService.js"); // define userService
        const customerNo = req.currentCustomer.profile.customerNo; // get customerNo, needed for service

        // check if form is valid
        if (profileForm.valid) {
            const body = {
                firstname: profileForm.customer.firstname.value,
                lastname: profileForm.customer.lastname.value,
                email: profileForm.customer.email.value,
                phone: profileForm.customer.phone.value,
                password: profileForm.login.password.value,
            }; // Body for request

            const response = userService.execute().call({
                method: "PUT",
                route: `/users/${customerNo}.json`,
                body,
            }).object; // updates user data

            const data = JSON.parse(response); // Parse raw response

            this.on("route:BeforeComplete", function (req, res) {
                // if error with database, display database connection message
                if (!data) {
                    profileForm.login.password.valid = false;
                    profileForm.login.password.error = Resource.msg(
                        "database.connection",
                        "errors",
                        null
                    );

                    res.json({
                        success: false,
                        fields: formErrors.getFormErrors(profileForm),
                    });

                    return;
                }
            });
        } else {
            res.json({
                success: false,
                fields: formErrors.getFormErrors(profileForm),
            });
        }
        return next();
    }
);

/**
 * Account-SavePassword : The Account-SavePassword endpoint is the endpoit that handles changing the shopper's password
 * @name Base/Account-SavePassword
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {httpparameter} - dwfrm_profile_login_currentpassword - Input field for the shopper's current password
 * @param {httpparameter} - dwfrm_profile_login_newpasswords_newpassword - Input field for the shopper's new password
 * @param {httpparameter} - dwfrm_profile_login_newpasswords_newpasswordconfirm - Input field for the shopper to confirm their new password
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.append(
    "SavePassword",
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        const Resource = require("dw/web/Resource");
        const formErrors = require("*/cartridge/scripts/formErrors");
        const profileForm = server.forms.getForm("profile"); // get profile form
        const newPasswords = profileForm.login.newpasswords; // get helper variable
        const userService = require("*/cartridge/scripts/userService.js"); // define userService
        const customerNo = req.currentCustomer.profile.customerNo; // get customerNo, needed for service
        let userDataSuccess, passwordsMatch, userData; // define variables needed for validations

        // check if form is valid
        if (profileForm.valid) {
            // get user data with old password
            const responseGET = userService.execute().call({
                method: "GET",
                route: `/users/${customerNo}.json`,
            }).object;

            userData = JSON.parse(responseGET); // parse raw data

            if (userData) {
                passwordsMatch =
                    userData.password ===
                    profileForm.login.currentpassword.value; // check if old password matches new one

                if (passwordsMatch) {
                    userData.password = newPasswords.newpassword.value; // set thenew password

                    // update user data
                    const responsePUT = userService.execute().call({
                        method: "PUT",
                        route: `/users/${customerNo}.json`,
                        body: userData,
                    }).object;

                    userDataSuccess = JSON.parse(responsePUT); // prase raw data
                }
            }

            this.on("route:BeforeComplete", function () {
                // if error with database, display database connection message
                if (!userData) {
                    profileForm.valid = false;
                    newPasswords.newpasswordconfirm.valid = false;
                    newPasswords.newpasswordconfirm.error = Resource.msg(
                        "database.connection",
                        "errors",
                        null
                    );

                    res.json({
                        success: false,
                        fields: formErrors.getFormErrors(profileForm),
                    });
                    return;
                }
                // if old password and new password don't match display error
                if (!passwordsMatch) {
                    profileForm.valid = false;
                    profileForm.login.currentpassword.valid = false;
                    profileForm.login.currentpassword.error = Resource.msg(
                        "error.message.currentpasswordnomatch",
                        "forms",
                        null
                    );

                    res.json({
                        success: false,
                        fields: formErrors.getFormErrors(profileForm),
                    });
                    return;
                }
            });
        } else {
            res.json({
                success: false,
                fields: formErrors.getFormErrors(profileForm),
            });
        }
        return next();
    }
);

module.exports = server.exports();
