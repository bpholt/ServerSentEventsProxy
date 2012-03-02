(function() {
	var buster = require('buster'),
		sinon = require('sinon'),
		RestController = require('../lib/RestController');

	buster.testCase("RestController", {
		setUp: function () {
			this.body = 'wow!';
			this.classToTest = new RestController();

			// this.classToTest.messages = [];
			this.req = {body: this.body,
			   	 	    params: {id: 0}};

			this.res = {writeHeader: sinon.spy(),
				   		write: sinon.spy(),
				   		end: sinon.spy()};
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
		},

		"the id can be a string and it behaves reasonably by returning 404": function () {
			this.req.params.id = "bobdole";

			this.classToTest.messages = [];

			this.classToTest.getMessage(this.req, this.res);

			assert.equals(404, this.res.writeHeader.args[0][0]);
			assert.equals(0, this.res.write.callCount);
		},

		"when a client does not request text/event-stream we do close the connection": function () {
			this.req.headers = {'accept': 'anything'};

			this.classToTest.subscribe(this.req, this.res);

			assert.equals(1, this.res.end.callCount);
		},

		"when a client requests text/event-stream we don't close the connection": function () {
			this.req.headers = {'accept': 'text/event-stream'};

			this.classToTest.subscribe(this.req, this.res);

			assert.equals(0, this.res.end.callCount);
		},

		"connections exists as an array": function () {
			assert.equals(0, this.classToTest.connections.length);
		},

		"when a client requests text/event-stream we remember them": function () {
			this.req.headers = {'accept': 'text/event-stream'};
			this.classToTest.subscribe(this.req, this.res);

			assert.equals(true, -1 < this.classToTest.connections.indexOf(this.res));
		},

		"when a client doesn't request text/event-stream we don't remember them": function () {
			this.req.headers = {'accept': 'foo'};
			this.classToTest.subscribe(this.req, this.res);

			assert.equals(true, -1 === this.classToTest.connections.indexOf(this.res));
			assert.calledOnce(this.res.writeHeader);
			assert.equals(406, this.res.writeHeader.args[0][0]);
		},

		"when a client requests text/event-stream we respond with a 200 header and the right content-type": function () {
			var expectedHeaders = {'Content-Type': 'text/event-stream',
								   'Cache-Control': 'no-cache',
								   'Connection': 'keep-alive'};

			this.req.headers = {'accept': 'text/event-stream'};
			this.classToTest.subscribe(this.req, this.res);

			assert.equals(200, this.res.writeHeader.args[0][0]);
			assert.equals(expectedHeaders, this.res.writeHeader.args[0][1]);
		},

		"id is written out by default": function () {
			this.req.headers = {'accept': 'text/event-stream'};
			this.classToTest.subscribe(this.req, this.res);

			assert.equals('id\n\n', this.res.write.args[0][0]);
		},

		"if the client gives us a last-event-id header we don't reset their event counter": function () {
			this.req.headers = {
				'accept': 'text/event-stream',
				'last-event-id': 42
			};
			this.classToTest.subscribe(this.req, this.res);

			refute.calledOnce(this.res.write);
		}
	});
}());
