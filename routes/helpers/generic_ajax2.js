/* generic_ajax(options[, success(body)[, failure(body)]]);
	options = obj(method, path, req, res[, headers, body]) */
var http = require('http');
var qs = require('querystring');
var hostname = require('../url').hostname;
var port = require('../url').port;
var s = function (o) { // success function
	o.res.json({
		success: true
	});
}
var f = function (body, o) { // failure function
	console.log('ERROR with ' + o.method + ': ' + body.message);
	o.res.json({
		success: false
		, message: body.message
	});
}
var generic_ajax = function (o, success, failure) { // generic_ajax(options[, success(body, options)[, failure(body, options)]]);
	var options = {
		"method": o.method
		, "hostname": hostname
		, "port": port
		, "path": o.path
		, "headers": {
			"cache-control": "no-cache"
			, "content-type": "application/x-www-form-urlencoded"
		}
	}
	for (var header in o.headers) {
		options['headers'][header] = o.headers[header]
	}
	var reqInner = http.request(options, (result) => {
		var chunks = [];
		result.on('data', (chunk) => {
			chunks.push(chunk);
		});
		result.on('end', () => {
			var body = JSON.parse(Buffer.concat(chunks).toString());
			if (body.success) {
				if (success) success(body, o);
				else {
					s(o);
				}
			}
			else {
				if (failure) failure(body, o);
				else f(body, o);
			}
		});
	});
	reqInner.write(qs.stringify(o.body));
	reqInner.end();
}
module.exports = generic_ajax;