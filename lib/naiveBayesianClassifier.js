"use strict";

const memoryDataStoreFactory = require('./memoryDataStore.js');
const featureExtraction = require('./featureExtraction.js');
const featureCollectionFactory = require('./featureCollection.js');
const _ = require('lodash');

const ClassificationError = function(message){
	this.message = message;
};

ClassificationError.prototype.toString = function() {
	return this.message;
};

exports.ClassificationError = ClassificationError;

const defaults = {
	dataStoreFactory: memoryDataStoreFactory,
	featureExtractor: featureExtraction.whiteSpaceFeatureExtractor,
	threshold: 1,
	featureSetSize: 50
};

const computeProbability = function(documentCount, category, categoryCount, features, featureCounts, settings){
	if (categoryCount === 0) {
			return 0.5;
	}
	
	const categoryProbability = categoryCount / documentCount;
	
	const documentProbability = _(features)
		//  Compute and cap the probability of each feature
		.map(function(feature){
			return Math.max(Math.min(computeFeatureProbability(category, categoryCount, feature, featureCounts), 0.999), 0.001);
		})
		//  Order by most interesting to least interesting
		.sortBy(function(probability){
			return Math.abs(0.5 - probability);
		})
		//  Keep only the n most interesting
		.take(settings.featureSetSize)
		//  Compute the document probability using what's left
		.reduce(function(memo, value){ 
			return memo * value; 
		});
	
	return documentProbability * categoryProbability;
};

const computeFeatureProbability = function(category, categoryCount, feature, featureCounts){
	const featureCount = featureCounts.getFeatureCount(feature, category);
	return (categoryCount === 0) ? 0 : featureCount / categoryCount;
};

const classifyDocument = function(document, dataStore, settings) {
	if(document === null) {
		throw new ClassificationError("A document must be provided");
	}
	
	const features = settings.featureExtractor(document);
	const categoryCounts = dataStore.getCategoryCounts();
	const featureCounts = dataStore.getFeatureCounts(features);
	const documentCount = categoryCounts.sumAllCategoryCounts();
	
	const bestTwoCategories = _(categoryCounts.toArray())
		.map(function(item){
			return {
				categoryData: item, 
				probability: computeProbability(documentCount, item.category, item.count, features, featureCounts, settings)
			};
		})
		.sortBy(function(item){return Math.abs(item.probability - 1);})
		.take(2)
		.value();
		
	if (bestTwoCategories.length === 0) return null;
	if ((bestTwoCategories.length === 1) && (settings.threshold === 1)) return bestTwoCategories[0].categoryData.category;
	
	return (bestTwoCategories[0].probability >= (bestTwoCategories[1].probability*settings.threshold)) ? 
		bestTwoCategories[0].categoryData.category : 
		null;
};

const trainDocument = function(category, document, dataStore, settings) {
	if(!category) {
		throw new ClassificationError("A category must be provided");
	}
	
	if(document === null) {
		throw new ClassificationError("A document must be provided");
	}
	
	const features = settings.featureExtractor(document);
	const collection = featureCollectionFactory();
	
	_(features).forEach(function(feature){
		collection.incrementFeatureCount(feature, category, 1);
	});
	
	dataStore.incrementFeatureCounts(category, collection.toArray(category));
	dataStore.incrementCategoryCount(category);
};

exports.create = function(options){
	const settings = _.assign(defaults, options || {});
	const dataStore = settings.dataStoreFactory();
	
	const classifier = {
		classify: function(document) {
			return classifyDocument(document, dataStore, settings);
		},
		
		train: function(category, document) {
			trainDocument(category, document, dataStore, settings);
		}
	};
	
	return classifier;
};