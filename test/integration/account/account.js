const assert = require("chai").assert;
const request = require("request-promise");
const config = require("../it.config");
const chai = require("chai");
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);
const uniqueEmail = `a${Date.now()}r${Math.floor(Math.random() * 100)}@gml.com`;

describe("Customer Register, Edit Profile, Change Password, and Add Address", function () {
    this.timeout(50000);

    it("1) Register User", async () => {
        const myRequest = {
            url: `${config.baseUrl}/CSRF-Generate`,
            method: "POST",
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            jar: request.jar(),
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        };

        return request(myRequest)
            .then(() => {
                return request(myRequest);
            })
            .then(async (csrfResponse) => {
                const csrfJsonResponse = JSON.parse(csrfResponse.body);
                myRequest.url = `${config.baseUrl}/Account-SubmitRegistration?${csrfJsonResponse.csrf.tokenName}=${csrfJsonResponse.csrf.token}`;
                myRequest.form = {
                    dwfrm_profile_customer_email: uniqueEmail,
                    dwfrm_profile_customer_emailconfirm: uniqueEmail,
                    dwfrm_profile_customer_firstname: "Tester",
                    dwfrm_profile_customer_lastname: "Tested",
                    dwfrm_profile_customer_phone: "9234567890",
                    dwfrm_profile_login_password: "123Password@@",
                    dwfrm_profile_login_passwordconfirm: "123Password@@",
                };

                return request(myRequest).then((response) => {
                    const bodyAsJson = JSON.parse(response.body);
                    assert.equal(bodyAsJson.success, true);
                });
            });
    });

    it("2) Edit User", async () => {
        const myRequest = {
            url: `${config.baseUrl}/CSRF-Generate`,
            method: "POST",
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            jar: request.jar(),
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        };
        return request(myRequest)
            .then(() => {
                return request(myRequest);
            })
            .then((csrfResponse) => {
                const csrfJsonResponse = JSON.parse(csrfResponse.body);
                myRequest.url = `${config.baseUrl}/Account-Login?${csrfJsonResponse.csrf.tokenName}=${csrfJsonResponse.csrf.token}`;
                myRequest.form = {
                    loginEmail: uniqueEmail,
                    loginPassword: "123Password@@",
                    loginRememberMe: false,
                };
                return request(myRequest);
            })
            .then(() => {
                myRequest.url = `${config.baseUrl}/CSRF-Generate`; // generate token
                return request(myRequest);
            })
            .then(async (csrfResponse) => {
                const csrfJsonResponse = JSON.parse(csrfResponse.body);
                myRequest.url = `${config.baseUrl}/Account-SaveProfile?${csrfJsonResponse.csrf.tokenName}=${csrfJsonResponse.csrf.token}`;
                myRequest.form = {
                    dwfrm_profile_customer_firstname: "Tester",
                    dwfrm_profile_customer_lastname: "Test", // new value
                    dwfrm_profile_customer_phone: "9234567890",
                    dwfrm_profile_customer_email: uniqueEmail,
                    dwfrm_profile_customer_emailconfirm: uniqueEmail,
                    dwfrm_profile_login_password: "123Password@@",
                };

                return request(myRequest).then((response) => {
                    var bodyAsJson = JSON.parse(response.body);
                    assert.equal(bodyAsJson.success, true);
                    assert.equal(bodyAsJson.lastName, "Test");
                });
            });
    });

    it("3) Change Password", async () => {
        const myRequest = {
            url: `${config.baseUrl}/CSRF-Generate`,
            method: "POST",
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            jar: request.jar(),
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        };
        return request(myRequest)
            .then(() => {
                return request(myRequest);
            })
            .then((csrfResponse) => {
                const csrfJsonResponse = JSON.parse(csrfResponse.body);
                myRequest.url = `${config.baseUrl}/Account-Login?${csrfJsonResponse.csrf.tokenName}=${csrfJsonResponse.csrf.token}`;
                myRequest.form = {
                    loginEmail: uniqueEmail,
                    loginPassword: "123Password@@",
                    loginRememberMe: false,
                };
                return request(myRequest);
            })
            .then(() => {
                myRequest.url = `${config.baseUrl}/CSRF-Generate`; // generate token
                return request(myRequest);
            })
            .then(async (csrfResponse) => {
                const csrfJsonResponse = JSON.parse(csrfResponse.body);
                myRequest.url = `${config.baseUrl}/Account-SavePassword?${csrfJsonResponse.csrf.tokenName}=${csrfJsonResponse.csrf.token}`;
                myRequest.form = {
                    dwfrm_profile_login_currentpassword: "123Password@@",
                    dwfrm_profile_login_newpasswords_newpassword:
                        "321Password@@", // new value
                    dwfrm_profile_login_newpasswords_newpasswordconfirm:
                        "321Password@@", // new value
                };

                return request(myRequest).then((response) => {
                    var bodyAsJson = JSON.parse(response.body);
                    assert.equal(bodyAsJson.success, true);
                });
            });
    });

    it("4) Create Address", async () => {
        const myRequest = {
            url: `${config.baseUrl}/CSRF-Generate`,
            method: "POST",
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            jar: request.jar(),
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        };
        return request(myRequest)
            .then(() => {
                return request(myRequest);
            })
            .then((csrfResponse) => {
                const csrfJsonResponse = JSON.parse(csrfResponse.body);
                myRequest.url = `${config.baseUrl}/Account-Login?${csrfJsonResponse.csrf.tokenName}=${csrfJsonResponse.csrf.token}`;
                myRequest.form = {
                    loginEmail: uniqueEmail,
                    loginPassword: "321Password@@",
                    loginRememberMe: false,
                };
                return request(myRequest);
            })
            .then(() => {
                myRequest.url = `${config.baseUrl}/CSRF-Generate`; // generate token
                return request(myRequest);
            })
            .then(async (csrfResponse) => {
                const csrfJsonResponse = JSON.parse(csrfResponse.body);
                myRequest.url = `${config.baseUrl}/Address-SaveAddress?${csrfJsonResponse.csrf.tokenName}=${csrfJsonResponse.csrf.token}`;
                myRequest.form = {
                    dwfrm_address_addressId: "Tsar Boris №3",
                    dwfrm_address_firstName: "Tester",
                    dwfrm_address_lastName: "Test",
                    dwfrm_address_address1: "Tsar Boris №3",
                    dwfrm_address_address2: "Tsar Boris №4",
                    dwfrm_address_country: "BG",
                    dwfrm_address_city: "Sofia",
                    dwfrm_address_postalCode: "40202",
                    dwfrm_address_phone: "9876543210",
                };

                return request(myRequest).then((response) => {
                    var bodyAsJson = JSON.parse(response.body);
                    assert.equal(bodyAsJson.success, true);
                    assert.equal(bodyAsJson.addressId, "Tsar Boris №3");
                });
            });
    });
});
