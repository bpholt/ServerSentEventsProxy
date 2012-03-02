(function() {
	module.exports = {
		messages: [],

		handleMessage: function (req, res) {
			this.messages.push(req.body);
			res.writeHeader(201, {'location': '/messages/0'});
			res.end();
		},

		getMessage: function (req, res) {
			res.write(this.messages[0]);
		}
	};
}());

