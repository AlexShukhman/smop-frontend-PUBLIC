var express = require('express');
var session = require('express-session');
var bodyParser = require('express-busboy');
var admin = express.Router();
var http = require('http');
var qs = require('querystring');
var sha512 = function (password, salt) {
	var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt: salt,
		passwordHash: value
	};
};
var hostname = require('./url').hostname;
var port = require('./url').port;
admin.get('/', (req, res) => {
	var ssn = req.cookies.ssn_admin;
	if (!ssn) {
		res.redirect('/login');
	} else {
		res.redirect('/admin_home');
	}
});
admin.get('/login', (req, res) => {
	res.render('admin_login');
});
admin.post('/admin_login', (req, res) => {
	var ssn = {};
	ssn.name = req.body.user;
	var options = {
		"method": "POST",
		"hostname": hostname,
		"port": port,
		"path": "/api/authenticate_admin",
		"headers": {
			"content-type": "application/x-www-form-urlencoded",
			"cache-control": "no-cache"
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
				console.log('success!')
				ssn.token = body.token;
				//console.log('ssn:', ssn);
				res.cookie('ssn_admin', ssn, {
					maxAge: 3600000 // 1hr

						,
					httpOnly: true
				});
				res.redirect('/admin_home');
			} else {
				res.redirect('/admin');
			}
		});
	});
	reqInner.write(qs.stringify({
		name: req.body.user,
		password: req.body.pass
	}));
	reqInner.end();
});
admin.get('/admin_home', (req, res) => {
	res.render('admin_home');
});
module.exports = admin;