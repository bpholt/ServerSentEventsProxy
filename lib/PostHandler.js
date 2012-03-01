module.exports = PostHandler;

function PostHandler() {
	this.messages = [];
	this.handleMessage = function(req, res) {
		this.messages.push(req.body);
		// res.end();
	};
};