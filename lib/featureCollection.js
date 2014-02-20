"use strict";

require('./extensions.js');
var _ = require('lodash');


var encodeCategory = function(category) {
	return "_{{category}}".interpolate({category: category});
};

var decodeCategory = function(propertyName) {
	return propertyName.slice(1);
};

var encodeFeature = function(feature) {
	return "_{{feature}}".interpolate({feature: feature});
};

var decodeFeature = function(propertyName) {
	return propertyName.slice(1);
};

var ensureFeaturePropertyExists = function(obj, featurePropertyName) {
	if(!obj.features.hasOwnProperty(featurePropertyName)) {
		obj.features[featurePropertyName] = {};
	}
};

var ensureCategoryPropertyExists = function(obj, featurePropertyName, categoryPropertyName) {
	ensureFeaturePropertyExists(obj, featurePropertyName);
	
	if(!obj.features[featurePropertyName].hasOwnProperty(categoryPropertyName)) {
		obj.features[featurePropertyName][categoryPropertyName] = 0;
	}
};

var FeatureCollection = function() {
	this.features = {};
};

FeatureCollection.prototype.incrementFeatureCount = function(feature, category, increment) {
	var featurePropertyName = encodeFeature(feature);
	var categoryPropertyName = encodeCategory(category);
			
	ensureCategoryPropertyExists(this, featurePropertyName, categoryPropertyName);
	
	this.features[featurePropertyName][categoryPropertyName] += increment;
};

FeatureCollection.prototype.getFeatureCount = function(feature, category) {
	var featurePropertyName = encodeFeature(feature);
	var categoryPropertyName = encodeCategory(category);
	
	if(!this.features.hasOwnProperty(featurePropertyName)) return 0;
	if(!this.features[featurePropertyName].hasOwnProperty(categoryPropertyName)) return 0;
	
	return this.features[featurePropertyName][categoryPropertyName];
}

FeatureCollection.prototype.toArray = function(category) {
	var categoryPropertyName = encodeCategory(category);
	var result = [];
	
	_.forOwn(this.features, function(feature, featurePropertyName) {
		if(feature.hasOwnProperty(categoryPropertyName)) {
			result.push({feature: decodeFeature(featurePropertyName), count: feature[categoryPropertyName]});
		}
	});
	
	return result;
}

exports.create = function() {
	return new FeatureCollection();
}
