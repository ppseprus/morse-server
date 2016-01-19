var config = {
    port: 3000
}

var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.send('socket.io server');
});

http.listen(config.port, function(){
    console.log('listening on *:'+config.port);
});

io.on('connection', (client) => {
    console.log('client connected');
    
    
    //client.on('join', handleUserJoin);
    
    //function handleUserJoin(name) {
    //    client.set('username', name);
    //}
    
    //client.on('messages', handleUserMessage);
    
    
    /**
    * data: {
    *      message: 'your message',
    *      timestamp: new Date()
    * }
    */
    /*function handleUserMessage(data) {
        client.get('username', function(err, name) {
            client.broadcast.emit('messages', `${name}: ${data.message}`);
        });
    }*/
});