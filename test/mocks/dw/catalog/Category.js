var _super = require('../object/ExtensibleObject');

var Category = function(){};

Category.prototype = new _super();

Category.prototype.getParent = function(){};
Category.prototype.getDisplayName = function(){};
Category.prototype.getID = function(){};
Category.prototype.getDescription = function(){};
Category.prototype.getImage = function(){};
Category.prototype.getThumbnail = function(){};
Category.prototype.isOnline = function(){};
Category.prototype.getOnlineFlag = function(){};
Category.prototype.getOnlineFrom = function(){};
Category.prototype.getOnlineTo = function(){};
Category.prototype.getProducts = function(){};
Category.prototype.getOnlineProducts = function(){};
Category.prototype.getCategoryAssignments = function(){};
Category.prototype.getOnlineCategoryAssignments = function(){};
Category.prototype.getSubCategories = function(){};
Category.prototype.getOnlineSubCategories = function(){};
Category.prototype.getOutgoingCategoryLinks = function(){};
Category.prototype.getIncomingCategoryLinks = function(){};
Category.prototype.getOnlineOutgoingCategoryLinks = function(){};
Category.prototype.getOnlineIncomingCategoryLinks = function(){};
Category.prototype.isRoot = function(){};
Category.prototype.getProductAttributeModel = function(){};
Category.prototype.getSearchPlacement = function(){};
Category.prototype.setSearchPlacement = function(){};
Category.prototype.getSearchRank = function(){};
Category.prototype.setSearchRank = function(){};
Category.prototype.getSiteMapChangeFrequency = function(){};
Category.prototype.getSiteMapPriority = function(){};
Category.prototype.getPageTitle = function(){};
Category.prototype.getPageDescription = function(){};
Category.prototype.getPageKeywords = function(){};
Category.prototype.getPageURL = function(){};
Category.prototype.getRecommendations = function(){};
Category.prototype.getTemplate = function(){};
Category.prototype.getOrderableRecommendations = function(){};
Category.prototype.getAllRecommendations = function(){};
Category.prototype.getDefaultSortingRule = function(){};
Category.prototype.isTopLevel = function(){};
Category.prototype.isDirectSubCategoryOf = function(){};
Category.prototype.isSubCategoryOf = function(){};
Category.prototype.parent=null;
Category.prototype.displayName=null;
Category.prototype.ID=null;
Category.prototype.description=null;
Category.prototype.image=null;
Category.prototype.thumbnail=null;
Category.prototype.onlineFlag=null;
Category.prototype.onlineFrom=null;
Category.prototype.onlineTo=null;
Category.prototype.products=null;
Category.prototype.onlineProducts=null;
Category.prototype.categoryAssignments=null;
Category.prototype.onlineCategoryAssignments=null;
Category.prototype.subCategories=null;
Category.prototype.onlineSubCategories=null;
Category.prototype.outgoingCategoryLinks=null;
Category.prototype.incomingCategoryLinks=null;
Category.prototype.onlineOutgoingCategoryLinks=null;
Category.prototype.onlineIncomingCategoryLinks=null;
Category.prototype.productAttributeModel=null;
Category.prototype.searchPlacement=null;
Category.prototype.searchRank=null;
Category.prototype.siteMapChangeFrequency=null;
Category.prototype.siteMapPriority=null;
Category.prototype.pageTitle=null;
Category.prototype.pageDescription=null;
Category.prototype.pageKeywords=null;
Category.prototype.pageURL=null;
Category.prototype.recommendations=null;
Category.prototype.template=null;
Category.prototype.orderableRecommendations=null;
Category.prototype.allRecommendations=null;
Category.prototype.defaultSortingRule=null;

module.exports = Category;