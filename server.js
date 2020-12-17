var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

connections = [];

server.listen(3000);
console.log('Server is running...');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {

	connections.push(socket);
	console.log('Connected : %s sockets is connecting', connections.length);

	// Disconnect
	socket.on('disconnect', function(data) {
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected : %s sockets is disconnect', connections.length);
	});

	// Send Message from client
	socket.on('send message', function(data) {
		// join to particular room
		socket.join(data.room);
		io.sockets.to(data.room).emit('new message', {
			room: data.room,
			msg: data.msg, 
			username: data.username
		});
		// broadcast message again
		// io.sockets.emit('new message', {
		// 	room: data.room
		// 	msg: data.msg, 
		// 	username: data.username
		// });
	});
});