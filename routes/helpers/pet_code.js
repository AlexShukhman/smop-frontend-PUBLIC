var pet_code = function (req, res, request, hostname, port, fs) {
	var ssn = req.cookies.ssn;
	if (!ssn) res.redirect('/');
	// Uses Request framework instead of http.request framework because it handles files better
	var body = {
		url: "http://" + hostname + ((port == '') ? '' : ":" + port) + "/api/post_petCode"
		, headers: {
			"x-access-token": ssn.token
			, "x-access-name": ssn.name
		}
	}
	if (req.body.filename) {
		var filename = req.body.filename;
		var originalname = req.body.filename
		var id = req.body.id;
	}
	else {
		var filename = req.files[0].filename;
		var originalname = req.files[0].originalname;
		var id = req.headers['taskid'];
	}
	if (fs.existsSync('./public/uploads/' + filename)){
		var reqinner = request.post(body, (error, response, body) => {
			if (error) console.error(error);
			fs.unlink('./public/uploads/' + filename, () => {
				res.json({
					success: true
				});
			});
		});
		body = reqinner.form();
		body.append('file', fs.createReadStream('./public/uploads/' + filename))
		body.append('name', originalname);
		body.append('id', id);
	}
}
module.exports = pet_code;