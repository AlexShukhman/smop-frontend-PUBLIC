var parth_test = function(req, res, hostname, port, http, qs){
	// actual codeCheck
	var options = {
		"method": "POST"
		, "hostname": hostname
		, "port": port
		, "path": "/parth_test"
		, 'headers': {
            "content-type": "application/x-www-form-urlencoded",
            "r": req.headers.r,
            "e": req.headers.e,
            "t": req.headers.t,
			"p": req.headers.p,
			"ip": req.header('x-forwarded-for') || req.connection.remoteAddress
		}
	};
	var reqInner = http.request(options, function (result) {
		result.on("data", function (chunk) {
			console.log(chunk.toString())
			res.write(chunk.toString())
		});
		result.on("end", function () {
            	res.end();
		});
	});
	reqInner.end();
}
module.exports = parth_test;