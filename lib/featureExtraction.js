"use strict";

var _ = require('lodash');

var defaultStopWords = [
	"a","able","about","across","after","all","almost","also","am","among","an","and",
	"any","are","as","at","be","because","been","but","by","can","cannot","could","dear",
	"did","do","does","either","else","ever","every","for","from","get","got","had","has",
	"have","he","her","hers","him","his","how","however","i","if","in","into","is","it",
	"its","just","least","let","like","likely","may","me","might","most","must","my",
	"neither","no","nor","not","of","off","often","on","only","or","other","our","own",
	"rather","said","say","says","she","should","since","so","some","than","that","the",
	"their","them","then","there","these","they","this","tis","to","too","twas","us",
	"wants","was","we","were","what","when","where","which","while","who","whom","why",
	"will","with","would","yet","you","your","aren't","can't","couldn't","didn't","doesn't",
	"don't","hadn't","hasn't","haven't","he'd","he'll","he's","i'd","i'll","i'm","i've","isn't",
	"it's","let's","mightn't","mustn't","shan't","she'd","she'll","she's","shouldn't","that's",
	"there's","they'd","they'll","they're","they've","we'd","we're","we've","weren't","what'll",
	"what're","what's","what've","where's","who'd","who'll","who're","who's","who've","won't",
	"wouldn't","you'd","you'll","you're","you've"
];

var slidingWindowMethod = function(tokens, windowSize) {
	var results = [];
	
	for(var i=0; i<tokens.length; i++) {
		var result = "";
		
		for (var j = i; j < Math.min(i + windowSize, tokens.length); j++) {
			result += " " + tokens[j];
			results.push(result.trim());
		}
	}
	
	return results;
};

var augmentFunction = function(fn) {
	fn.slidingWindow = function(windowSize) {
		return augmentFunction(function(text) {
			return slidingWindowMethod(fn(text), windowSize);
		});
	};
	
	fn.lowerCaseFilter = function() {
		return augmentFunction(function(text) {
			return fn(text).map(function(item){return item.toLowerCase();});
		});
	};
	
	fn.reJoinHyphenSplitWords = function() {
		return augmentFunction(function(text) {
			return fn(text.replace(/([a-zA-Z]+)\s*-\s*\n\s*(\w+)/g, "$1$2"));
		});
	};
	
	fn.stopWordsFilter = function(words) {
		words = (typeof words == 'undefined') ? defaultStopWords : words;
		words.sort();
		
		return augmentFunction(function(text) {
			return _(fn(text))
				.map(function(item){return (words.binarySearch(item) >= 0) ? "" : item;})
				.filter(function(item){return item.trim().length > 0;})
				.valueOf();
		});
	};
	
	return fn;
};

var constructFeatureExtractor = function(pattern) {
	var regex = (pattern instanceof RegExp) ? pattern : new RegExp(pattern);
	
	return augmentFunction(function(text) {
		return ((text === null) || (text.length === 0))
			? []
			: _(text.split(regex)).filter(function(item){return item.trim().length > 0;}).valueOf();
	});
};

exports.constructFeatureExtractor = constructFeatureExtractor;
exports.whiteSpaceFeatureExtractor = constructFeatureExtractor(/\s/g);
exports.wordBreakFeatureExtractor = constructFeatureExtractor(/\W/g);
exports.nonLetterNumberApostropheHyphenDollarFeatureExtractor = constructFeatureExtractor(/[^a-z0-9'$\-]/g);
