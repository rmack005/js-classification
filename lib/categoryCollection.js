"use strict";

const _ = require('lodash');


const encodeCategory = function(category) {
    return '_' + category;
};

const decodeCategory = function(propertyName) {
    return propertyName.slice(1);
};

const ensureCategoryPropertyExists = function(obj, categoryPropertyName) {
    if (!obj.categories.hasOwnProperty(categoryPropertyName)) {
        obj.categories[categoryPropertyName] = 0;
    }
};

const incrementCategoryCount = function(collection, category, increment) {
    const categoryPropertyName = encodeCategory(category);

    ensureCategoryPropertyExists(collection, categoryPropertyName);

    collection.categories[categoryPropertyName] += increment;
};

const getCategoryCount = function(collection, category) {
    const categoryPropertyName = encodeCategory(category);

    if (!collection.categories.hasOwnProperty(categoryPropertyName)) return 0;

    return collection.categories[categoryPropertyName];
};

const toArray = function(collection) {
    const result = [];

    _.forOwn(collection.categories, function(count, categoryPropertyName) {
        result.push({ category: decodeCategory(categoryPropertyName), count: count });
    });

    return result;
};

const sumAllCategoryCounts = function(collection) {
	var count = 0;
	
	_.forOwn(collection.categories, function(categoryCount) {
		count += categoryCount;
	});
	
	return count;
};

const createCategoryCollection = function() {
    const collection = {
        categories: {}
    };

    collection.incrementCategoryCount = function(category, increment) {
        return incrementCategoryCount(collection, category, increment); };
    collection.getCategoryCount = function(category) {
        return getCategoryCount(collection, category); };
    collection.toArray = function() {
        return toArray(collection); };
    collection.sumAllCategoryCounts = function() {
        return sumAllCategoryCounts(collection); };

    return collection;
};

module.exports = function() {
    return createCategoryCollection();
};
