var login = function (req, res, hostname, port, http, qs, admin = false) {
	var ssn = {};
	if (req.body.user != ('' || null) && req.body.pass != ('' || null)) {
		ssn.name = req.body.user;
		var options = {
			"method": "POST"
			, "hostname": hostname
			, "port": port
			, "path": (admin) ? "/api/authenticate-admin" : "/api/authenticate"
			, "headers": {
				"content-type": "application/x-www-form-urlencoded"
				, "cache-control": "no-cache"
			}
		};
		var reqInner = http.request(options, function (result) {
			var chunks = [];
			result.on("data", function (chunk) {
				chunks.push(chunk);
			});
			result.on("end", function () {
				var body = JSON.parse(Buffer.concat(chunks).toString());
				if (body.success) {
					ssn.token = body.token;
					res.cookie('ssn', ssn, {
						maxAge: 3600000 // 1hr
							
						, httpOnly: true
					});
					res.redirect('/owner_home');
				}
				else {
					res.redirect('/login');
				}
			});
		});
		reqInner.write(qs.stringify({
			name: req.body.user
			, password: req.body.pass
		}));
		reqInner.end();
	}
	else res.redirect('/index');
}
module.exports = login;