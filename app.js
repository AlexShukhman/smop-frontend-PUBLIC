var express = require('express');
var subdomain = require('express-subdomain');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var admin = require('./routes/admin');
var owner = require('./routes/owner');
var robots = require('robots.txt')
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
// Pass in the absolute path to your robots.txt file
app.use(robots('routes/robots.txt'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(subdomain('admin', admin));
app.use(subdomain('owner', owner));
app.use('/', routes);
app.use('/images', express.static(__dirname+'/public/images/'));
// catch 404 and forward to error handler
app.use(function (req, res) {
	var err = new Error('Not Found');
	err.status = 404;
	res.send(err);
});
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});
module.exports = app;
