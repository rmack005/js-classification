"use strict";

const _ = require('lodash');
const featureCollection = require('./featureCollection.js');
const categoryCollection = require('./categoryCollection.js');


module.exports = function() {
	const featureStore = featureCollection();
	const categoryStore = categoryCollection();
	
	return {
		incrementFeatureCounts: function(category, featureCounts) {
			_.forEach(featureCounts, function(item) {
				featureStore.incrementFeatureCount(item.feature, category, item.count);
			});
		},
		
		incrementCategoryCount: function(category) {
			categoryStore.incrementCategoryCount(category, 1);
		},
		
		getFeatureCounts: function(/* features */) {
			return featureStore;
		},
		
		getCategoryCounts: function() {
			return categoryStore;
		}
	};
};