const assert = require("chai").assert;
const request = require("request-promise");
const config = require("../it.config");
const chai = require("chai");
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);
const uniqueEmail = `a${Date.now()}@gmail.com`;

describe("Customer Register, Edit Profile, Edit Password", function () {
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

    it("2) Login and Edit User", async () => {
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
                    dwfrm_profile_customer_lastname: "Test", // new changed value
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
});
