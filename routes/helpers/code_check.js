const { Progress } = require('express-progressbar');
var code_check = function(req, res, hostname, port, http, qs){
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	// actual codeCheck
	var options2 = {
		"method": "POST"
		, "hostname": hostname
		, "port": port
		, "path": "/api/post_codeCheck"
		, 'headers': {
			"x-access-token": ssn !== undefined ? ssn.token : req.body.token
			, "x-access-name": ssn !== undefined ? ssn.name : "none"
			, "content-type": "application/x-www-form-urlencoded"
		}
	};
	var reqInner = http.request(options2, function (result) {
		const p = new Progress(res);
		result.on("data", function (chunk) {
			p.update(chunk.toString());
		});
		result.on("end", function () {
			p.close();
		});
	});
	reqInner.write(qs.stringify({
		id: req.body.id
	}));
	reqInner.end();
}
module.exports = code_check;