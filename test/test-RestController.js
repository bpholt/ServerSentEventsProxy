(function() {
	var buster = require('buster'),
		sinon = require('sinon'),
		classToTestProto = require('../lib/RestController');

	buster.testCase("RestController", {
		setUp: function () {
			this.body = 'wow!';
			this.classToTest = Object.create(classToTestProto);

			// this.classToTest.messages = [];
			this.req = {body: this.body,
			   	 	    params: {id: 0}};

			this.res = {writeHeader: sinon.spy(),
				   		write: sinon.spy(),
				   		end: sinon.spy()};
		},

		tearDown: function () {
			classToTestProto.messages = [];
		},

		"message body is stored": function () {
			this.classToTest.handleMessage(this.req, this.res);

			assert.equals('wow!', this.classToTest.messages[0]);
			assert.equals(true, this.res.end.called);

			assert.equals(201, this.res.writeHeader.args[0][0]);
			assert.equals({'location': '/messages/0'}, this.res.writeHeader.args[0][1]);
		},

		"getMessage returns a message and sets the right headers": function () {
			this.classToTest.messages[0] = this.body;

			this.classToTest.getMessage(this.req, this.res);

			assert.equals(this.body, this.res.write.args[0][0]);
			assert.equals(200, this.res.writeHeader.args[0][0]);
			assert.equals({'content-type': 'application/json'}, this.res.writeHeader.args[0][1]);
		},

		"getMessage returns the correct message": function () {
			this.req.params.id = 1;
			this.classToTest.messages[1] = 'wowza';

			this.classToTest.getMessage(this.req, this.res);

			assert.equals('wowza', this.res.write.args[0][0]);
		},

		"getMessage returns 404 when the passed ID doesn't exist": function () {
			this.req.params.id = 42;
			this.classToTest.messages = [];

			this.classToTest.getMessage(this.req, this.res);

			assert.equals(404, this.res.writeHeader.args[0][0]);
			assert.equals(0, this.res.write.callCount);
		},

		"multiple messages can be pushed": function () {
			this.classToTest.handleMessage(this.req, this.res);
			this.req.body = 'shazam';

			this.classToTest.handleMessage(this.req, this.res);

			assert.equals({'location': '/messages/1'}, this.res.writeHeader.args[1][1]);
			assert.equals('shazam', this.classToTest.messages[1]);
		}
	});
}());
