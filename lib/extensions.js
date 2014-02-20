"use strict";

var method = function (obj, name, func) {
	if (!obj.prototype[name]) {
		obj.prototype[name] = func;
	}
};

var deepCopy = function(destination, source) {
	for (var property in source) {
		if (source[property] && source[property].constructor &&
			source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				deepCopy(destination[property], source[property]);
		} 
		else {
			destination[property] = source[property];
		}
	}
	
  return destination;
};

method(Object, "merge", function() {
	var result = deepCopy({}, this);
	
	for(var i=0; i < arguments.length; i++) {
		result = deepCopy(result, arguments[i]);
	}
	
	return result;
});

/*
	Simple string interpolation via double mustache brackets {{}}.
	The brackets can contain the name of a property on an object if an object is passed,
	or an index of an array if an array is passed.
	
	Example: "this is a {{test}}.".interpolate({"test": "successful test});
	Example: "this is a {{0}} {{1}}.".interpolate(["successful", "test"]);
*/
method(String, "interpolate", function (arg) {
	return this.replace(/\{\{([^}{]+)\}\}/g, function (matchedText, name) {
		var index = Number(name);

		if (isNaN(index)) {
			return ((typeof arg[name] === 'undefined') || (arg[name] === null)) ? matchedText : arg[name];
		} else {
			return (index < arg.length) ? arg[index] : matchedText;
		}
	});
});

var standardComparer = function(a, b) {
	if (a > b) {
		return 1;
	}
	
	if(a < b) {
		return -1;
	}
	
	return 0;
};

/*
	Binary search algorithm.
	Returns the index of the item, if found.  Otherwise returns the bitwise complement
	of the index of the next element that is larger than the item.  If no elements are
	larger, returns the bitwise complement of the length of the array.
	
	Example: [1,2,3,7,14,22].binarySearch(7) == 3
	Example: [1,2,3,7,14,22].binarySearch(8) == ~4
	Example: [1,2,3,7,14,22].binarySearch(78) == ~6
*/
method(Array, "binarySearch", function(item, comparer) {
	comparer = comparer || standardComparer;
	
	var start = 0;
	var end = this.length - 1;
	var i = 0;
	
	while(start <= end) {
		i = Math.floor((start + end) / 2);
		
		if(comparer(item, this[i]) === -1) {
			end = i-1;
		}
		
		else if(comparer(item, this[i]) === 1) {
			start = i+1;
		}
		
		else {
			return i;
		}
	}
	
	return (comparer(item, this[this.length - 1]) === 1) 
		? ~this.length 
		: ~i;
});
