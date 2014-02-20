"use strict";

require('./extensions.js');
var _ = require('lodash');
var featureCollection = require('./featureCollection.js');
var categoryCollection = require('./categoryCollection.js');


exports.create = function() {
	var featureStore = featureCollection.create();
	var categoryStore = categoryCollection.create();
	
	return {
		incrementFeatureCounts: function(category, featureCounts) {
			_.forEach(featureCounts, function(item) {
				featureStore.incrementFeatureCount(item.feature, category, item.count);
			});
		},
		
		incrementCategoryCount: function(category) {
			categoryStore.incrementCategoryCount(category, 1);
		},
		
		getFeatureCounts: function(features) {
			return featureStore;
		},
		
		getCategoryCounts: function() {
			return categoryStore;
		}
	};
};