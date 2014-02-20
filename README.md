js-classification
=================

A library that implements classification algorithms (it currently just contains a naive Bayes classifier).  
Data storage and retrieval has been decoupled from the classifier so that users can implement custom data stores 
(an in memory data store is provided and used by default).


To use: obtain the source, navigate to the directory containing the source, and install the dependencies via npm:

	npm install
	
To run the tests, navigate to the directory containing the source and run:

	mocha
