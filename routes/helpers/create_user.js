var create_user = function (req, res, hostname, port, sha512, genRandomString, http, qs) {
	if (req.body.user2 != '' && req.body.pass2 != '' && req.body.passCheck != '') {
		var options = {
			"method": "POST"
			, "hostname": hostname
			, "port": port
			, "path": "/newuser"
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
					res.redirect('/');
				}
				else {
					res.redirect('/');
				}
			});
		});
		var salt = genRandomString(16); // salt length of 16
		var data = sha512(req.body.pass, salt);
		reqInner.write(qs.stringify({
			name: req.body.user
			, password: data.passwordHash
			, salt: data.salt
			, email: req.body.email
			, admin: false
		}));
		reqInner.end();
	}
	else {
		res.redirect('/');
	}
}
module.exports = create_user;