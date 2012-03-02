
function RestController () { 
	this.messages = [];
	this.connections = [];
}

RestController.prototype.handleMessage = function (req, res) {
	this.messages.push(req.body);
	res.writeHeader(201, {'location': '/messages/' + (this.messages.length - 1)});
	res.end();
};

RestController.prototype.getMessage = function (req, res) {
	if (!this.messages[req.params.id]) {
		res.writeHeader(404);	
	} else {
		res.writeHeader(200, {'content-type': 'application/json'});	
		res.write(this.messages[req.params.id]);
	}
};

RestController.prototype.subscribe = function (req, res) {

	if ('text/event-stream' === req.headers.accept) {
		this.connections.push(res);

		res.writeHeader(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		});

		if (!req.headers['last-event-id']) {
			res.write('id\n\n');	
		}
		
	} else {
		res.writeHeader(406);
		res.end();	
	}
};

module.exports = RestController;
