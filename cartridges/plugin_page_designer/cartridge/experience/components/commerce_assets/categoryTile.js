"use strict";
/* global response */

const Template = require("dw/util/Template");
const HashMap = require("dw/util/HashMap");
const URLUtils = require("dw/web/URLUtils");
const ImageTransformation = require("*/cartridge/experience/utilities/ImageTransformation.js");
const pageCache = require("*/cartridge/experience/utilities/pageCache");
/**
 * Render logic for the storefront.popularCategories.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commerce Cloud Platform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    const model = modelIn || new HashMap();
    const content = context.content;
    model.textHeadline = content.textHeadline;

    const categoryObj = {};
    const category = content.category;

    categoryObj.ID = category.ID;
    categoryObj.compID = context.component.ID;
    categoryObj.name = category.displayName;

    if (content.description) {
        categoryObj.description = content.description;
    }

    if (content.categoryLinkName) {
        categoryObj.categoryLinkName = content.categoryLinkName;
        categoryObj.categoryLinkPosition = content.categoryLinkPosition;
    }

    model.image = ImageTransformation.getScaledImage(content.image);

    categoryObj.url =
        category.custom &&
        "alternativeUrl" in category.custom &&
        category.custom.alternativeUrl
            ? category.custom.alternativeUrl
            : URLUtils.url("Search-Show", "cgid", category.getID()).toString();

    model.category = categoryObj;

    // instruct 24 hours relative pagecache
    pageCache();

    return new Template(
        "experience/components/commerce_assets/categoryTile"
    ).render(model).text;
};
