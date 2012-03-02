/**/
(function() {
	module.exports = RestController;

	function RestController () {
		this.messages = [];
	};

	RestController.prototype.handleMessage = function (req, res) {
		this.messages.push(req.body);
		res.writeHeader(201, {'location': '/messages/0'});
		res.end();
	};

	RestController.prototype.getMessage = function (req, res) {
		res.write(this.messages[0]);
	};
}());
/**/

/*
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
})
/**/