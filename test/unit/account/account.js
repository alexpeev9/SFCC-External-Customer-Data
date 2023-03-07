"use strict";

const assert = require("chai").assert;

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();
const firebaseService = proxyquire(
    "../../../cartridges/int_external_data/cartridge/scripts/firebaseService.js",
    {
        "dw/svc/LocalServiceRegistry": require("../../mocks/dw/svc/LocalServiceRegistry"),
    }
);

const userId = "-NPwb-7s6G3DX3l9p37y";

describe("CRUD operations for userService", function () {
    this.timeout(50000);

    it("should get all users", function () {
        const response = firebaseService.execute().call({
            method: "Get",
            route: `/users.json`,
        });

        assert.equal(response.ok, true);
    });

    it("should get specific user", function () {
        const response = firebaseService.execute().call({
            method: "Get",
            route: `/users/${userId}.json`,
        });

        assert.equal(response.ok, true);
    });

    it("should create user", function () {
        const response = firebaseService.execute().call({
            method: "POST",
            route: "/users.json",
            body: {
                firstname: "John",
                lastname: "Doe",
                email: "johndoe3@gmail.com",
                phone: "9234567890",
                password: "123Password@@",
            },
        });

        assert.equal(response.ok, true);
    });

    it("should update user", function () {
        const response = firebaseService.execute().call({
            method: "PUT",
            route: `/users/${userId}.json`,
            body: {
                firstname: "John",
                lastname: "Doe",
                email: "johndoe@gmail.com",
                phone: "9234567890",
                password: "123Password@@",
            },
        });

        assert.equal(response.ok, true);
    });

    it("should delete user", function () {
        const response = firebaseService.execute().call({
            method: "DELETE",
            route: `/users/${userId}.json`,
        });

        assert.equal(response.ok, true);
    });
});
