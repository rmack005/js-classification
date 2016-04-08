"use strict";

const _ = require('lodash');


const encodeCategory = function(category) {
    return '_' + category;
};

// const decodeCategory = function(propertyName) {
// 	return propertyName.slice(1);
// };

const encodeFeature = function(feature) {
    return '_' + feature;
};

const decodeFeature = function(propertyName) {
    return propertyName.slice(1);
};

const ensureFeaturePropertyExists = function(collection, featurePropertyName) {
    if (!collection.features.hasOwnProperty(featurePropertyName)) {
        collection.features[featurePropertyName] = {};
    }
};

const ensureCategoryPropertyExists = function(collection, featurePropertyName, categoryPropertyName) {
    ensureFeaturePropertyExists(collection, featurePropertyName);

    if (!collection.features[featurePropertyName].hasOwnProperty(categoryPropertyName)) {
        collection.features[featurePropertyName][categoryPropertyName] = 0;
    }
};

const incrementFeatureCount = function(collection, feature, category, increment) {
    const featurePropertyName = encodeFeature(feature);
    const categoryPropertyName = encodeCategory(category);

    ensureCategoryPropertyExists(collection, featurePropertyName, categoryPropertyName);

    collection.features[featurePropertyName][categoryPropertyName] += increment;
};

const getFeatureCount = function(collection, feature, category) {
    const featurePropertyName = encodeFeature(feature);
    const categoryPropertyName = encodeCategory(category);

    if (!collection.features.hasOwnProperty(featurePropertyName)) return 0;
    if (!collection.features[featurePropertyName].hasOwnProperty(categoryPropertyName)) return 0;

    return collection.features[featurePropertyName][categoryPropertyName];
};

const toArray = function(collection, category) {
    const categoryPropertyName = encodeCategory(category);
    const result = [];

    _.forOwn(collection.features, function(feature, featurePropertyName) {
        if (feature.hasOwnProperty(categoryPropertyName)) {
            result.push({ feature: decodeFeature(featurePropertyName), count: feature[categoryPropertyName] });
        }
    });

    return result;
};

const createFeatureCollection = function() {
    const collection = {
        features: {}
    };

    collection.incrementFeatureCount = function(feature, category, increment) {
        return incrementFeatureCount(collection, feature, category, increment); };
    collection.getFeatureCount = function(feature, category) {
        return getFeatureCount(collection, feature, category); };
    collection.toArray = function(category) {
        return toArray(collection, category); };

    return collection;
};

module.exports = function() {
    return createFeatureCollection();
};
