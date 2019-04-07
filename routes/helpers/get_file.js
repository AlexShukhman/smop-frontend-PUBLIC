var get_file = function (req, res, hostname, port, http, fs) {
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	var options = {
		"method": "GET"
		, "hostname": hostname
		, "port": port
		, "path": "/api/get_file"
		, "headers": {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
			, "file": (req.body.file) ? req.body.file : req.query['file']
			, "id": (req.body.id) ? req.body.id : req.query['id']
		}
	}
	var reqInner = http.request(options, (result) => {
		if (req.query['read']) {
			var chunks = []
			result.on('data', (chunk) => {
				chunks.push(chunk);
			});
			result.on('end', () => {
				var body = Buffer.concat(chunks).toString();
				res.json({
					file: body
				});
			});
		}
		else {
			var pipe = result.pipe(res);
			pipe.on('finish', () => {
				res.end();
			});
		}
	});
	reqInner.end();
}
module.exports = get_file;