(function() {
	var buster = require('buster'),
		sinon = require('sinon'),
		RestController = require('../lib/RestController'),
		classToTest,
		body = 'wow!',
		req = {body: body,
			   params: {id: 0}},
		res = {writeHeader: sinon.spy(),
			   write: sinon.spy(),
			   end: sinon.spy()};

	console.log(RestController);

	buster.testCase("RestController", {
		setUp: function () {
			classToTest = new RestController();	
		},

		"handleMessage is a function": function () {
			assert.equals('function', typeof (classToTest.handleMessage));	
		},

		"message body is stored": function () {
			classToTest.handleMessage(req, res);
			assert.equals(body, classToTest.messages[0]);
			assert.equals(true, res.end.called);

			assert.equals(201, res.writeHeader.args[0][0]); // why is this a 2D array?
			assert.equals({'location': '/messages/0'}, res.writeHeader.args[0][1]);
		},

		"getMessage is a function": function () {
			assert.equals('function', typeof (classToTest.getMessage));
		},

		"getMessage returns the message at the passed id": function () {
			classToTest.messages[0] = body;

			classToTest.getMessage(req, res);

			assert.equals(body, res.write.args[0][0]);
		}
	});
}());
