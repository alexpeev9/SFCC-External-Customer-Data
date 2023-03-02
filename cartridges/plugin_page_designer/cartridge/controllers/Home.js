"use strict";

/**
 * @namespace Home
 */

const server = require("server");
server.extend(module.superModule);

const pageMetaData = require("*/cartridge/scripts/middleware/pageMetaData");
const routes = require("*/cartridge/config/routes");

/**
 * Any customization on this endpoint, also requires update for Default-Start endpoint
 */
/**
 * Home-Show : This endpoint is called when a shopper navigates to the home page
 * @name Base/Home-Show
 * @function
 * @memberof Home
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - append
 */
server.append(
    `${routes.homePage}`,
    function (req, res, next) {
        const Site = require("dw/system/Site");
        const PageMgr = require("dw/experience/PageMgr");
        const pageMetaHelper = require("*/cartridge/scripts/helpers/pageMetaHelper");

        pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

        const page = PageMgr.getPage("pd-example");

        if (page && page.isVisible()) {
            res.page("pd-example");
        } else {
            res.render("home/homePage");
        }
        next();
    },
    pageMetaData.computedPageMetaData
);

module.exports = server.exports();
