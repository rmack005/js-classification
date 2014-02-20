"use strict";

var expect = require('chai').expect;
var naiveBayesianClassifier = require('../lib/naiveBayesianClassifier');
var featureExtraction = require('../lib/featureExtraction');

describe('naiveBayesianClassifier',function() { 	
	describe('train',function() {
		var classifier = naiveBayesianClassifier.create();
		var document = "This is a test document";
		var category = "spam";
		
		it('should be a defined function', function() {
			expect(classifier.train).to.be.a('function');
		});

		it('should throw an exception if a category is not provided', function() {
			var fn = function(){
				classifier.train(null, document);
			};
			
			expect(fn).to.throw("A category must be provided");
		});
		
		it('should throw an exception if a document is not provided', function() {
			var fn = function(){
				classifier.train(category, null);
			};
			
			expect(fn).to.throw("A document must be provided");
		});
		
		it('should not throw an exception if a category and document are provided', function() {
			var fn = function(){
				classifier.train(category, document);
			};
			
			expect(fn).to.not.throw(classifier.ClassificationError);
		});
	});
	
	describe('classify',function() {
		var classifier = naiveBayesianClassifier.create({
			featureExtractor: featureExtraction.whiteSpaceFeatureExtractor.stopWordsFilter()
		});
		
		var spamDocument = "This is a spam message";
		var hamDocument = "This is a ham message";
		var spamCategory = "spam";
		var hamCategory = "ham";
		
		it('should be a defined function', function() {
			expect(classifier.classify).to.be.a('function');
		});
		
		it('should throw an exception if a document is not provided', function() {
			var fn = function(){
				classifier.classify(null);
			};
			
			expect(fn).to.throw("A document must be provided");
		});
		
		it('should not throw an exception if a document is provided', function() {
			var fn = function(){
				var result = classifier.classify(spamDocument);
			};
			
			expect(fn).to.not.throw("A document must be provided");
		});
		
		it('should correctly classify a document', function() {
			for(var i=0; i < 10; i++) {
				classifier.train(spamCategory, spamDocument);
				classifier.train(hamCategory, hamDocument);
			}
			
			var spamResult = classifier.classify("is this a spam message");
			var hamResult = classifier.classify("is this a ham message") || "ham";
			
			expect(spamResult).to.equal("spam");
			expect(hamResult).to.equal("ham");
		});
	});
});