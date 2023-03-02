"use strict";
/* global response */

const Template = require("dw/util/Template");
const HashMap = require("dw/util/HashMap");
const carouselBuilder = require("*/cartridge/scripts/experience/utilities/carouselBuilder.js");
const pageCache = require("*/cartridge/experience/utilities/pageCache");

/**
 * Render logic for storefront.carousel layout.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commerce Cloud Platform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    const model = modelIn || new HashMap();

    model = carouselBuilder.init(model, context);

    // instruct 24 hours relative pagecache
    pageCache();

    return new Template(
        "experience/components/commerce_layouts/carouselTile"
    ).render(model).text;
};
