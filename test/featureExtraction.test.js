"use strict";

var expect = require('chai').expect;
var featureExtraction = require('../lib/featureExtraction');


describe('featureExtraction',function() {
	describe('whiteSpaceFeatureExtractor',function() {
		it('should have a slidingWindow method', function() {
			expect(featureExtraction.whiteSpaceFeatureExtractor).to.have.property('slidingWindow');
			expect(featureExtraction.whiteSpaceFeatureExtractor.slidingWindow).to.be.a('function');
		});
		
		it('should have a lowerCaseFilter method', function() {
			expect(featureExtraction.whiteSpaceFeatureExtractor).to.have.property('lowerCaseFilter');
			expect(featureExtraction.whiteSpaceFeatureExtractor.lowerCaseFilter).to.be.a('function');
		});
		
		it('should have a reJoinHyphenSplitWords method', function() {
			expect(featureExtraction.whiteSpaceFeatureExtractor).to.have.property('reJoinHyphenSplitWords');
			expect(featureExtraction.whiteSpaceFeatureExtractor.reJoinHyphenSplitWords).to.be.a('function');
		});
		
		it('should have a stopWordsFilter method', function() {
			expect(featureExtraction.whiteSpaceFeatureExtractor).to.have.property('stopWordsFilter');
			expect(featureExtraction.whiteSpaceFeatureExtractor.stopWordsFilter).to.be.a('function');
		});
		
		var result = featureExtraction.whiteSpaceFeatureExtractor("This is a	test-case1");
		
		it('should split a string on whitespace', function() {
			expect(result).to.be.an.instanceof(Array);
			expect(result).to.have.length(4);
			expect(result).to.include.members(["This", "is", "a", "test-case1"]);
		});
	});
	
	describe('wordBreakFeatureExtractor',function() {
		it('should have a slidingWindow method', function() {
			expect(featureExtraction.wordBreakFeatureExtractor).to.have.property('slidingWindow');
			expect(featureExtraction.wordBreakFeatureExtractor.slidingWindow).to.be.a('function');
		});
		
		it('should have a lowerCaseFilter method', function() {
			expect(featureExtraction.wordBreakFeatureExtractor).to.have.property('lowerCaseFilter');
			expect(featureExtraction.wordBreakFeatureExtractor.lowerCaseFilter).to.be.a('function');
		});
		
		it('should have a reJoinHyphenSplitWords method', function() {
			expect(featureExtraction.wordBreakFeatureExtractor).to.have.property('reJoinHyphenSplitWords');
			expect(featureExtraction.wordBreakFeatureExtractor.reJoinHyphenSplitWords).to.be.a('function');
		});
		
		it('should have a stopWordsFilter method', function() {
			expect(featureExtraction.wordBreakFeatureExtractor).to.have.property('stopWordsFilter');
			expect(featureExtraction.wordBreakFeatureExtractor.stopWordsFilter).to.be.a('function');
		});
		
		var result = featureExtraction.wordBreakFeatureExtractor("This is a		test_case1#test-case2");
		
		it('should split a string on word breaks', function() {
			expect(result).to.be.an.instanceof(Array);
			expect(result).to.have.length(6);
			expect(result).to.include.members(["This", "is", "a", "test_case1", "test", "case2"]);
		});
	});
	
	describe('nonLetterNumberApostropheHyphenDollarFeatureExtractor',function() {
		it('should have a slidingWindow method', function() {
			expect(featureExtraction.nonLetterNumberApostropheHyphenDollarFeatureExtractor).to.have.property('slidingWindow');
			expect(featureExtraction.nonLetterNumberApostropheHyphenDollarFeatureExtractor.slidingWindow).to.be.a('function');
		});
		
		it('should have a lowerCaseFilter method', function() {
			expect(featureExtraction.nonLetterNumberApostropheHyphenDollarFeatureExtractor).to.have.property('lowerCaseFilter');
			expect(featureExtraction.nonLetterNumberApostropheHyphenDollarFeatureExtractor.lowerCaseFilter).to.be.a('function');
		});
		
		it('should have a reJoinHyphenSplitWords method', function() {
			expect(featureExtraction.nonLetterNumberApostropheHyphenDollarFeatureExtractor).to.have.property('reJoinHyphenSplitWords');
			expect(featureExtraction.nonLetterNumberApostropheHyphenDollarFeatureExtractor.reJoinHyphenSplitWords).to.be.a('function');
		});
		
		it('should have a stopWordsFilter method', function() {
			expect(featureExtraction.nonLetterNumberApostropheHyphenDollarFeatureExtractor).to.have.property('stopWordsFilter');
			expect(featureExtraction.nonLetterNumberApostropheHyphenDollarFeatureExtractor.stopWordsFilter).to.be.a('function');
		});
		
		var result = featureExtraction.nonLetterNumberApostropheHyphenDollarFeatureExtractor("it's another		test_case1#test-case2");
		
		it('should split a string correctly', function() {
			expect(result).to.be.an.instanceof(Array);
			expect(result).to.have.length(5);
			expect(result).to.include.members(["it's", "another", "test", "case1", "test-case2"]);
		});
	});
	
	describe('slidingWindow',function() {
		var featureExtractor = featureExtraction.whiteSpaceFeatureExtractor.slidingWindow(4);
		var result = featureExtractor("The sliding window test case");
		
		it('should tokenize a string correctly', function() {
			expect(result).to.be.an.instanceof(Array);
			expect(result).to.have.length(14);
			expect(result).to.include.members([
				"The", "The sliding", "The sliding window", "The sliding window test",
				"sliding", "sliding window", "sliding window test", "sliding window test case",
				"window", "window test", "window test case",
				"test", "test case",
				"case"
			]);
		});
	});
	
	describe('lowerCaseFilter',function() {
		var featureExtractor = featureExtraction.whiteSpaceFeatureExtractor.lowerCaseFilter();
		var result = featureExtractor("The lowerCaseFilter test case");
		
		it('should tokenize a string correctly', function() {
			expect(result).to.be.an.instanceof(Array);
			expect(result).to.have.length(4);
			expect(result).to.include.members(["the", "lowercasefilter", "test", "case"]);
		});
	});
	
	describe('reJoinHyphenSplitWords',function() {
		var featureExtractor = featureExtraction.whiteSpaceFeatureExtractor.reJoinHyphenSplitWords();
		var result = featureExtractor("The reJoinHyphenSplitWords test case with hy-\r\nphenated word");
		
		it('should tokenize a string correctly', function() {
			expect(result).to.be.an.instanceof(Array);
			expect(result).to.have.length(7);
			expect(result).to.include.members(["The", "reJoinHyphenSplitWords", "test", "case", "with", "hyphenated", "word"]);
		});
	});
	
	describe('stopWordsFilter',function() {
		var featureExtractor = featureExtraction.whiteSpaceFeatureExtractor.stopWordsFilter();
		var result = featureExtractor("the stopWordsFilter should remove any stop words because that's what it's supposed to do.");
		
		it('should remove any stop words', function() {
			expect(result).to.be.an.instanceof(Array);
			expect(result).to.have.length(6);
			expect(result).to.include.members([
				"stopWordsFilter",
				"remove",
				"stop",
				"words",
				"supposed",
				"do."
			]);
		});
	});
});