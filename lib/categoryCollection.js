"use strict";

require('./extensions.js');
var _ = require('lodash');


var encodeCategory = function(category) {
	return "_{{category}}".interpolate({category: category});
};

var decodeCategory = function(propertyName) {
	return propertyName.slice(1);
};

var ensureCategoryPropertyExists = function(obj, categoryPropertyName) {
	if(!obj.categories.hasOwnProperty(categoryPropertyName)) {
		obj.categories[categoryPropertyName] = 0
	}
};

var CategoryCollection = function() {
	this.categories = {};	
};

CategoryCollection.prototype.incrementCategoryCount = function(category, increment) {
	var categoryPropertyName = encodeCategory(category);
			
	ensureCategoryPropertyExists(this, categoryPropertyName);
	
	this.categories[categoryPropertyName] += increment;
};

CategoryCollection.prototype.getCategoryCount = function(category) {
	var categoryPropertyName = encodeCategory(category);
	
	if(!this.categories.hasOwnProperty(categoryPropertyName)) return 0;
	
	return this.categories[categoryPropertyName];
}

CategoryCollection.prototype.toArray = function() {
	var result = [];
	
	_.forOwn(this.categories, function(count, categoryPropertyName) {
		result.push({category: decodeCategory(categoryPropertyName), count: count});
	});
	
	return result;
}

CategoryCollection.prototype.sumAllCategoryCounts = function() {
	var count = 0;
	
	_.forOwn(this.categories, function(categoryCount) {
		count += categoryCount;
	});
	
	return count;
};

exports.create = function() {
	return new CategoryCollection();
}
