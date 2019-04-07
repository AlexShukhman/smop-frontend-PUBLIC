var cli_pull = function (req, res, hostname, port, http, qs) {
    console.log('hit cli pull on index');
	console.log(req.body.taskOrlang)
	var options = {
		"method": "POST"
		, "hostname": hostname
		, "port": port
		, "path": "/api/post_cliPull"
		, "headers": {
			"x-access-token": req.body.token
			,"content-type": "application/x-www-form-urlencoded"
			, "cache-control": "no-cache"
			, "flag": req.body.flag
			, "taskOrlang": req.body.taskOrlang
		}
	};
	var reqInner = http.request(options, function (result) {
		var chunks = [];
		result.on("data", function (chunk) {
			chunks.push(chunk);
		});
		result.on("end", function () {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			res.send(body.message);
		});
	});
	reqInner.end();
}
module.exports = cli_pull;