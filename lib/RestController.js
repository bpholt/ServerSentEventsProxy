(function() {
	module.exports = {
		messages: [],

		handleMessage: function (req, res) {
			this.messages.push(req.body);
			res.writeHeader(201, {'location': '/messages/' + (this.messages.length - 1)});
			res.end();
		},

		getMessage: function (req, res) {
			if (!this.messages[req.params.id]) {
				res.writeHeader(404);	
			} else {
				res.writeHeader(200, {'content-type': 'application/json'});	
				res.write(this.messages[req.params.id]);
			}
		}
	};
}());

