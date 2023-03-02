"use strict";
/* global response */

const Template = require("dw/util/Template");
const HashMap = require("dw/util/HashMap");
const PageRenderHelper = require("*/cartridge/experience/utilities/PageRenderHelper.js");
const pageCache = require("*/cartridge/experience/utilities/pageCache");

/**
 * Render logic for the storefront.3 Row x 1 Col (Mobile) 1 Row x 3 Col (Desktop) layout
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commerce Cloud Platform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    const model = modelIn || new HashMap();
    const { component, content } = context;
    const { left, right, top, bottom } = content;

    model.regions = PageRenderHelper.getRegionModelRegistry(component);
    model.regions.body.setClassName(
        `pl-${left || 0} pr-${right || 0} pt-${top || 0} pb-${bottom || 0}`
    );

    // instruct 24 hours relative pagecache
    pageCache();

    return new Template(
        "experience/components/commerce_layouts/responsiveLayout"
    ).render(model).text;
};
