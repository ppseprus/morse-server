var userNames = require('./username'),
    paddingIfLessThan10 = require('./commons').zeroPaddingGenerator(10);

(function(){
    
    var config = {
        port: 3000
    };
    
    var app = require('express')(),
        http = require('http').Server(app),
        io = require('socket.io')(http);
    
    
    app.get('/', function (req, res) {
        res.send('socket.io server');
    });
    
    
    function UTCTimeString(date) {
        return paddingIfLessThan10(date.getUTCHours()) +
        ':' + paddingIfLessThan10(date.getUTCMinutes()) +
        ':' + paddingIfLessThan10(date.getUTCSeconds()) +
        '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5);
    }
    
    http.listen(config.port, function(){
        console.log('listening on *:'+config.port);
    });
    
    
    io.on('connection', (client) => {
        //  give the user a guest number
        var username = userNames.getGuestName();
        
        
        //  broadcast = emit for everyone
        function broadcast(event, data, u) {
            if (typeof u === 'undefined') { u = username; }
            
            data.event = event;
            data.username = u;
            io.emit(event, data);
            
            console.log(`${data.timestamp} ${u}: ${data.message}`);
        }
        
        
        //  client connects
        broadcast('user:connect', {
            'timestamp': UTCTimeString(new Date()),
            'message': username+' has connected'
        }, 'server');
        
        //  client disconnects
        client.on('disconnect', function(){
            userNames.free(username);
            broadcast('user:disconnect', {
                'timestamp': UTCTimeString(new Date()),
                'message': username+' has disconnected'
            }, 'server');
        });
        
        //  client joins a.k.a. names himself
        client.on('user:join', function(data){
            if (userNames.claim(data.username)) {
                //  we free up the guest name
                userNames.free(username);
                broadcast('user:join', {
                    'timestamp': UTCTimeString(new Date()),
                    'message': username+' > '+data.username
                }, 'server');
                //  we set the user provided username
                username = data.username;
                
                
                broadcast('user:join', {
                    'timestamp': UTCTimeString(new Date()),
                    'message': username+' has joined'
                }, 'server');
            } else {
                //  let user know, his username was not accepted
            }
            
            client.emit('youare', {
                'event': 'youare',
                'timestamp': UTCTimeString(new Date()),
                'username': 'server',
                'message': username
            });
        });
        
        //  message relay
        client.on('message', function(data){
            broadcast('message', data);
        });
        
    });

})();