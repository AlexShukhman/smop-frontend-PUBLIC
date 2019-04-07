#!/usr/bin/env node

/**
 * Module dependencies.
 */
var app = require('../app');
var http = require('http');
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/**
 * Create HTTP server.
 */
var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
/**
 * Listen on port for Socket
 */
var hostname = require('../routes/url').hostname;
var io = require('socket.io').listen(server);

io.on('connection', (client) => {
	console.log('Client Connected...');
	var server = require('socket.io-client').connect('http://' + hostname + ':3001/');
	server.on('error', (err) => {
		console.log(err);
	});
	server.on('connect', (data) => {
		console.log('api connected!');
		var id 
		var user

		client.on('join', (data) => {
			console.log('joined');
			data = JSON.parse(data);
			id = data.id;
			user = data.user
			server.emit('join', JSON.stringify({
				id: id,
				user: user
			}));
			client.join(id);
		});

		client.on('message', (data) => {
			server.emit('message', JSON.stringify({
				message: data
			}));
		});

		server.on('message', (data) => {
			data = JSON.parse(data);
			console.log(data);
			if (data.messages) {
				client.emit('messages', data.messages);
			} else if (data.message) {
				io.sockets.in(id).emit('message', data.message);
			}
		});
	});
});

/**
 * Error Handling
 */
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) {
		// named pipe
		return val;
	}
	if (port >= 0) {
		// port number
		return port;
	}
	return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	var p = port;
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof p === 'string' ? 'Pipe ' + p : 'Port ' + p;
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	console.log('now listening on port', port, '...');
	var s = server;
	var addr = s.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
}