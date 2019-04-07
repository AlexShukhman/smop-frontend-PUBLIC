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
var login = require('./helpers/login_owner');
var generic_ajax = require('./helpers/generic_ajax');
var generic_ajax2 = require('./helpers/generic_ajax2');
var create_user = require('./helpers/create_user');
var code_check = require('./helpers/code_check');
var pet_code = require('./helpers/pet_code');
var get_file = require('./helpers/get_file');
var get_zip = require('./helpers/get_zip');

// =======================
// Routes ================
// =======================
/* GET home page. */
router.get('/', function (req, res) {
    // check if token expired
    var ssn = req.cookies.ssn;
    if (!ssn) {
        res.redirect('/login');
    } else {
        var options = {
            req: req,
            res: res,
            method: 'GET',
            path: '/api/checkToken'
        }
        generic_ajax(options, () => {
            res.render('owner_home');
        }, () => {
            res.redirect('/login')
        });
    }
});

router.get('/login', function (req, res) {
    res.render('login_owner');
});

//login
router.post('/login', (req, res) => {
    login(req, res, hostname, port, http, qs);
});

router.get('/new_user', function (req, res) {
    res.render('new_user');
});

router.get('/owner_home', (req, res) => {
    var options = {
        req: req,
        res: res,
        method: 'GET',
        path: '/api/get_info',
        headers: {
            "coderowner": "owner"
        }
    }
    generic_ajax(options, (body) => {
        res.render('owner_home', {
            info: body.info
        });
    }, (body) => {
        res.redirect('/');
    });
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
            result.on('end', () => {
                var body = JSON.parse(Buffer.concat(chunks).toString());
                if (body.success == true) {
                    res.json({
                        success: true
                    });
                } else {
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
        success: false,
        message: 'no email'
    });
});

//logout
router.get('/logout', (req, res) => {
    res.cookie('ssn', '', {
        maxAge: 0,
        httpOnly: true
    });
    res.redirect('/');
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
    generic_ajax2(options, (body) => {
        res.render('forgot', {
            name: body.name,
            token: body.token
        });
    });
});

router.get('/ssn', (req, res) => {
    var ssn = req.cookies.ssn;
    res.json({
        user: ssn.name,
        token: ssn.token
    });
});

router.get('/socket', (req, res) => {
    res.render('socket');
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

router.get('/get_ownertaskfeed', (req, res) => {
	var options = {
		res: res,
		req: req,
		method: "GET",
		path: "/api/get_feed",
		headers: {
			"coderowner": 'owner'
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
	fs.writeFile('public/uploads/' + req.body.filename, req.body.file, (err) => {
		if (err) console.log(err);
		res.json({
			success: true
		});
	});
});
// Accept Completed Task
router.get('/accept_user', (req, res) => {
	var options = {
		req: req,
		res: res,
		method: "GET",
		path: "/api/accept_user",
		headers: {
			id: req.query.task,
			name: req.query.user
		}
	}
	generic_ajax(options, (body) => {
		res.redirect('/owner_home');
	});
});
// Decline Completed Task
router.get('/decline_task', (req, res) => {
	var options = {
		req: req,
		res: res,
		method: "GET",
		path: "/api/decline_task",
		headers: {
			id: req.query.id
		}
	}
	generic_ajax(options, (body) => {
		res.redirect('/owner_home');
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
		path: "/api/get_taskStatus",
		headers: {
			id: req.query.data
		}
	}
	generic_ajax(options, (body) => {
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
// Owner Post Pet Code
router.post('/post_petCode', upload.any(), (req, res) => {
	pet_code(req, res, request, hostname, port, fs);
});
// Post Update Task
router.post('/update_task', (req, res) => {
	var options = {
		res: res,
		req: req,
		method: "POST",
		path: "/api/post_updatetask",
		body: {
			id: req.body.id,
			name: req.body.name,
			lang: req.body.lang,
			task_message_short: req.body.task_message_short,
			task_message_long: req.body.task_message_long,
			task_pet_code: req.body.task_pet_code,
			task_unit_tests: req.body.task_unit_tests,
			bounty: req.body.bounty
		}
	}
	generic_ajax(options);
});
router.post('/post_payCoder', (req, res) => {
	var options = {
		req: req,
		res: res,
		method: "POST",
		path: "/api/post_payCoder",
		headers: {
			id: req.body.data
		}
	}
	generic_ajax(options, (body) => {
		res.json({
			message: body.result
		});
	});
});

// =======================
// Return Router =========
// =======================
// The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function (req, res) {
    res.status(404).send("welp, that's a 404.");
});
router.use((err, res) => {
    if (err) {
        console.log(err);
    }
});
module.exports = router;