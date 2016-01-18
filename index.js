var config = {
    port: 3000
}

var express = require('express'),
    socket = require('socket.io'),
    app = express(),
    http = require('http'),
    server = http.createServer(app).listen(config.port),
    io = socket.listen(server);

app.get('/', function (req, res) {
    res.send('Hello World!');
});

io.sockets.on('connection', (client) => {
    console.log(`client connected`);

    client.on('join', handleUserJoin);

    client.on('messages', handleUserMessage);

    function handleUserJoin(name) {
        client.set('username', name);
    }

    /**
     * data: {
     *      message: 'your message',
     *      timestamp: new Date()
     * }
     */
    function handleUserMessage(data) {
        client.get('username', function(err, name) {
            client.broadcast.emit('chat', `${name}: ${data.message}`);
        });
    }
});