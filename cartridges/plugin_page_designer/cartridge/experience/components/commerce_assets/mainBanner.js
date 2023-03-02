"use strict";
/* global response */

const Template = require("dw/util/Template");
const HashMap = require("dw/util/HashMap");
const URLUtils = require("dw/web/URLUtils");
const ImageTransformation = require("*/cartridge/experience/utilities/ImageTransformation.js");
const pageCache = require("*/cartridge/experience/utilities/pageCache");

/**
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commerce Cloud Platform.
 *
 * @returns {string} Display markup
 */
module.exports.render = function (context, modelIn) {
    const model = modelIn || new HashMap();
    const { title, shortDescription, image, cta } = context.content;

    model.title = title;
    model.shortDescription = shortDescription;
    model.image = ImageTransformation.getScaledImage(image);
    model.cta = URLUtils.url("Search-Show", "cgid", cta.getID()).toString();

    // instruct 24 hours relative pagecache
    pageCache();

    return new Template(
        "experience/components/commerce_assets/mainBanner"
    ).render(model).text;
};
