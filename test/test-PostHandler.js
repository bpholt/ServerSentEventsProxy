(function() {
	var buster = require('buster'),
		PostHandler = require('../lib/PostHandler'),
		classToTest,
		body = 'wow!',
		req = {body: body};

	buster.testCase("PostHandler", {
		setUp: function () {
			classToTest = new PostHandler();
		},

		"handleMessage is a function": function () {
			assert.equals('function', typeof (classToTest.handleMessage));	
		},

		"message body is stored": function () {
			classToTest.handleMessage(req);
			assert.equals(body, classToTest.messages[0]);
			// assert.equals(1, res.endCalled);

			// assert.equals(201, res.writeHeader.args[0]);
		}
	});
}());

/*
(function() {
	var assert = require('assert'),
		PostHandler = require('../lib/PostHandler'),
		body = 'wow!',
		req = {body: body},
		res = {end: function() {this.endCalled++;},
			   endCalled: 0},
		classToTest;
		
	function setUp() {
	}


	function testMessageBodyIsStored() {


	}



	function runTest(test) {
		setUp();
		test();
	}

	(function() {
		runTest(testHandleMessageIsFunction);
		runTest(testMessageBodyIsStored);
	}());

}());
*/