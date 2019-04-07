var express = require('express');
var fs = require('fs');
var session = require('express-session');
const bodyParser = require('express-busboy');
var router = express.Router();
var http = require('http');
var request = require('request');
var qs = require("querystring");
var crypto = require('crypto');
var multer = require('multer');
var exec = require('child_process').exec;
var upload = multer({
	dest: 'public/uploads/',
	onFileUploadComplete: function (file, req, res) {
		console.log("FILE UPLOAD IS COMPLETE");
	}
});
var genRandomString = function (length) {
	return crypto.randomBytes(Math.ceil(length / 2)).toString('hex') /** convert to hexadecimal format */ .slice(0, length); /** return required number of characters */
};
var sha512 = function (password, salt) {
	var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt: salt,
		passwordHash: value
	};
};

// =======================
// helpers ===============
// =======================
var hostname = require('./url').hostname;
var port = require('./url').port;
var login = require('./helpers/login');
var generic_ajax = require('./helpers/generic_ajax');
var generic_ajax2 = require('./helpers/generic_ajax2');
var create_user = require('./helpers/create_user');
var code_check = require('./helpers/code_check');
var parth_test = require('./helpers/parth_test');
var pet_code = require('./helpers/pet_code');
var get_file = require('./helpers/get_file');
var get_zip = require('./helpers/get_zip');
var cli_pull = require('./helpers/cli_pull')
// =======================
// routes ================
// =======================
//webhook
router.post('/hook', (req, res) => {
	var payload = JSON.parse(req.body.payload);
	if (payload['pull_request']) {
		var check = [payload["action"], payload['pull_request']['merged'], payload['pull_request']['base']['ref']];
		console.log(check);
		console.log(check[0] == 'closed' && check[1] == true && check[2] == 'prod');
		if (check[0] == 'closed' && check[1] == true && check[2] == 'prod') {
			exec("git pull https://smop-technologies:SmopFounders1@github.com/AlexShukhman/site4-smop.git", (err, stdout, stderr) => {
				if (err) console.error(err);
				console.log(`stdout: ${stdout}`);
				console.log(`stderr: ${stderr}`);
				exec('npm install; npm run build; pm2 restart www', (err, stdout, stderr) => {
					if (err) console.error(err);
					console.log(`stdout: ${stdout}`);
					console.log(`stderr: ${stderr}`);
				});
			});
		}
	}
	res.json({
		success: true
	});
});

router.get('/ping', function(req, res) {
	res.json({'req':req.header('x-forwarded-for') || req.connection.remoteAddress})
});

router.get('/sitemap.xml', function (req, res) {
	res.header('Content-Type', 'text/xml').send(fs.readFileSync('./views/sitemap.xml'));
});
//countdown
router.get('/countdown', (req, res) => {
	res.redirect('/login');
});

router.get('/terms', (req,res) => {
	res.redirect('https://s3.amazonaws.com/smop-public/Smop+Terms+and+Conditions.pdf');
});

router.get('/privacy', (req, res) => {
	res.redirect('https://s3.amazonaws.com/smop-public/Smop+Privacy+Policy.pdf');
});

router.get('/ssn', (req, res) => {
	var ssn = req.cookies.ssn;
	res.json({
		user: (ssn)?ssn.name:null,
		token: (ssn)?ssn.token:null
	});
});

router.get('/forgot', (req, res) => {
	var options = {
		req: req,
		res: res,
		method: 'GET',
		path: '/checkuser',
		headers: {
			id: req.query._id
		}
	}
	generic_ajax2(options, (body)=>{
		res.render('forgot', {
			name: body.name,
			token: body.token
		});
	});
});

router.post('/remake', (req, res) => {
	var salt = genRandomString(16);
	var data = sha512(req.body.pwd, salt)
	var options = {
		req: req,
		res: res,
		method: 'POST',
		path: '/remake',
		body: {
			name: req.body.name,
			token: req.body.token,
			pwd: data.passwordHash,
			salt: data.salt
		}
	}
	generic_ajax2(options, (body) => {
		res.redirect('/');
	}, (err) => {
		console.log(err)
		res.redirect('/')
	});
});

//login
router.post('/login', (req, res) => {
	login(req, res, hostname, port, http, qs);
});
//logout
router.get('/logout', (req, res) => {
	res.cookie('ssn', '', {
		maxAge: 0,
		httpOnly: true
	});
	res.redirect('/');
});
router.post('/forgot', (req, res) => {
	
	if (req.body.email) {
		var options = {
			method: "POST",
			hostname: hostname,
			port: port,
			path: '/forgot',
			headers: {
				"cache-control": "no-cache",
				"content-type": "application/x-www-form-urlencoded"
			}
		}
		var reqInner = http.request(options, (result) => {
			var chunks = [];
			result.on('data', (chunk) => {
				chunks.push(chunk);
			});
			result.on('end', () =>{
				var body = JSON.parse(Buffer.concat(chunks).toString());
				if (body.success == true) {
					res.json({
						success: true
					});
				}
				else {
					res.json({
						success: false,
						message: body.message
					});
				}
			});
		});

		reqInner.write(qs.stringify({
			email: req.body.email
		}));
		reqInner.end();

	} else res.json({
		success:false,
		message:'no email'});
});

router.get('/get_username', (req, res) => {
	var options = {
		req: req,
		res: res,
		method: 'GET',
		path: '/get_user',
		headers: {
			user: req.query.username
		}
	}
	generic_ajax2(options, (body) => {
		res.json(body);
	});
});
router.get('/verify_email', (req, res) => {
	var options = {
		req: req,
		res: res,
		method: 'POST',
		path: '/verifyUser',
		body: {
			_id: req.query._id
		}
	}
	generic_ajax2(options, () => {
		res.redirect('/');
	}, () => {
		res.redirect('/');
	});
});
router.post('/create_user', (req, res) => {
	create_user(req, res, hostname, port, sha512, genRandomString, http, qs);
});

router.post('/cli_pull', (req,res) => {
	cli_pull(req,res, hostname, port, http, qs);
});

// post editor save
router.post('/post_EditorSave', (req, res) => {
	var options = {
		req: req,
		res: res,
		method: "POST",
		path: '/api/post_ResponseSave',
		body: {
			data: req.body.data,
			id: req.body.id
		}
	}
	generic_ajax(options);
});

// post codeCheck
router.post('/post_CodeCheck', (req, res) => {
	code_check(req, res, hostname, port, http, qs);
});

// .parth npm webhook
router.post('/parth_test', (req,res)=>{
	parth_test(req, res, hostname, port, http, qs);
});

// get task feeds
router.get('/get_codertaskfeed', (req, res) => {
	var options = {
		res: res,
		req: req,
		method: "GET",
		path: "/api/get_feed",
		headers: {
			"coderowner": 'coder',
			lang: ['', 'js']
		}
	}
	generic_ajax(options, (body) => {
		res.json({
			message: body.result
		});
	}, () => {
		res.redirect('/');
	});
});

router.get('/get_codertaskfeed_ssnless', (req, res) => {
	var options = {
		res: res,
		req: req,
		method: "GET",
		path: "/get_feed",
		headers: {
			"coderowner": 'coder',
			lang: ['', 'js']
		}
	}
	generic_ajax2(options, (body) => {
		res.json({
			message: body.result
		});
	}, () => {
		res.redirect('/');
	});
});

// Owner Post Pet Code
router.post('/post_petCode', upload.any(), (req, res) => {
	pet_code(req, res, request, hostname, port, fs);
});

// Get Zipped folder of something
router.get('/get_zip', (req, res) => {
	get_zip(req, res, hostname, port, http, fs);
});

// Owner Create Task
router.post('/create_task', (req, res) => {
	var options = {
		res: res,
		req: req,
		method: "POST",
		path: "/api/post_newtask",
		body: {
			name: req.body.name,
			lang: req.body.lang,
			task_message_short: req.body.task_message_short,
			task_message_long: req.body.task_message_long,
			bounty: req.body.bounty,
			task_unit_tests: req.body.task_unit_tests
		}
	}
	generic_ajax(options, (body) => {
		res.json({
			success: true,
			id: body.id
		});
	}, (body) => {
		res.json({
			success: false,
			error: body
		});
	});
});

// Get Single Task
router.get('/get_singletask', (req, res) => {
	var options = {
		res: res,
		req: req,
		method: "GET",
		path: "/api/get_singletask",
		headers: {
			id: req.query.data,
			coder_owner: req.query.coder_owner
		}
	}
	generic_ajax(options, (body) => {
		res.json(body);
	});
});

// get one file by filepath from s3
router.get('/get_file', (req, res) => {
	get_file(req, res, hostname, port, http, fs);
});

// create file
router.post('/post_createFile', (req, res) => {
	console.log(req.body)
	fs.writeFile('public/uploads/' + req.body.filename, req.body.file, (err) => {
		if (err) console.log(err);
		res.json({
			success: true
		});
	});
});

// Get Task Cost to Owner
router.get('/get_taskCost', (req, res) => {
	var options = {
		req: req,
		res: res,
		method: "GET",
		path: "/api/get_taskCost",
		headers: {
			id: req.query.data
		}
	}
	generic_ajax(options, (body) => {
		res.json({
			message: body.result
		});
	});
});

// Get Task Status
router.get('/get_taskStatus', (req, res) => {
	var options = {
		req: req,
		res: res,
		method: "GET",
		path: "/get_taskStatus",
		headers: {
			id: req.query.data
		}
	}
	generic_ajax2(options, (body) => {
		res.json({
			message: body.result,
			r: body.r
		});
	}, (body) => {
		res.json({
			message: 'fail'
		});
	});
});

// The React Router Route (ALWAYS Keep this as the last route)
router.get('*', function (req, res) {
	res.render('root');
});

router.use((err, res) => {
	if (err) {
		console.log(err);
	}
});
module.exports = router;