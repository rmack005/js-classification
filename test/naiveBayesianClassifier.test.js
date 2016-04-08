/* jshint node: true, esversion: 6, mocha:true */
"use strict";

const expect = require('chai').expect;
const naiveBayesianClassifier = require('../lib/naiveBayesianClassifier');
const featureExtraction = require('../lib/featureExtraction');

describe('naiveBayesianClassifier',function() { 	
	describe('train',function() {
		const classifier = naiveBayesianClassifier.create();
		const document = "This is a test document";
		const category = "spam";
		
		it('should be a defined function', function() {
			expect(classifier.train).to.be.a('function');
		});

		it('should throw an exception if a category is not provided', function() {
			const fn = function(){
				classifier.train(null, document);
			};
			
			expect(fn).to.throw("A category must be provided");
		});
		
		it('should throw an exception if a document is not provided', function() {
			const fn = function(){
				classifier.train(category, null);
			};
			
			expect(fn).to.throw("A document must be provided");
		});
		
		it('should not throw an exception if a category and document are provided', function() {
			const fn = function(){
				classifier.train(category, document);
			};
			
			expect(fn).to.not.throw(classifier.ClassificationError);
		});
	});
	
	describe('classify',function() {
		const classifier = naiveBayesianClassifier.create({
			featureExtractor: featureExtraction.whiteSpaceFeatureExtractor.stopWordsFilter()
		});
		
		const spamDocument = "This is a spam message";
		const hamDocument = "This is a ham message";
		const spamCategory = "spam";
		const hamCategory = "ham";
		
		it('should be a defined function', function() {
			expect(classifier.classify).to.be.a('function');
		});
		
		it('should throw an exception if a document is not provided', function() {
			const fn = function(){
				classifier.classify(null);
			};
			
			expect(fn).to.throw("A document must be provided");
		});
		
		it('should not throw an exception if a document is provided', function() {
			const fn = function(){
				classifier.classify(spamDocument);
			};
			
			expect(fn).to.not.throw("A document must be provided");
		});
		
		it('should correctly classify a document', function() {
			for(var i=0; i < 10; i++) {
				classifier.train(spamCategory, spamDocument);
				classifier.train(hamCategory, hamDocument);
			}
			
			const spamResult = classifier.classify("is this a spam message");
			const hamResult = classifier.classify("is this a ham message") || "ham";
			
			expect(spamResult).to.equal("spam");
			expect(hamResult).to.equal("ham");
		});
	});
});