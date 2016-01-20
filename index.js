(function(){
    
    var config = {
        port: 3000
    }
    
    var app = require('express')(),
        http = require('http').Server(app),
        io = require('socket.io')(http);
    
    
    app.get('/', function (req, res) {
        res.send('socket.io server');
    });
    
    
    function UTCTimeString(date) {
        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }
        return pad(date.getUTCHours()) +
        ':' + pad(date.getUTCMinutes()) +
        ':' + pad(date.getUTCSeconds()) +
        '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5);
    }
    
    var userNames = (function () {
        var claim = function (name) {
            if (!name || userNames[name]) {
                return false;
            } else {
                userNames[name] = true;
                return true;
            }
        };
        
        // find the lowest unused "guest" name and claim it
        var getGuestName = function () {
            var name,
            nextUserId = 1;
            
            do {
                name = 'guest' + nextUserId;
                nextUserId += 1;
            } while (!claim(name));
            
            return name;
        };
        
        // serialize claimed names as an array
        var get = function () {
            var res = [];
            for (user in userNames) {
                res.push(user);
            }
            
            return res;
        };
        
        var free = function (name) {
            if (userNames[name]) {
                delete userNames[name];
            }
        };
        
        return {
            claim: claim,
            free: free,
            get: get,
            getGuestName: getGuestName
        };
    }());
    
    
    http.listen(config.port, function(){
        console.log('listening on *:'+config.port);
    });
    
    
    io.on('connection', (client) => {
        //  give the user a guest number
        var username = userNames.getGuestName();
        
        
        //  broadcast = emit for everyone
        function bc(event, data, u) {
            if (typeof u === 'undefined') { u = username; }
            
            data.event = event;
            data.username = u;
            data.for = 'everyone';
            
            client.broadcast.emit(event, data);
            client.emit(event, data);
            
            console.log(`${data.timestamp} ${u}: ${data.message}`);
        }
        
        
        //  client connects
        bc('user:connect', {
            'timestamp': UTCTimeString(new Date()),
            'message': username+' has connected'
        }, 'server');
        
        //  client disconnects
        client.on('disconnect', function(){
            userNames.free(username);
            bc('user:disconnect', {
                'timestamp': UTCTimeString(new Date()),
                'message': username+' has disconnected'
            }, 'server');
        });
        
        //  client joins a.k.a. names himself
        client.on('user:join', function(data){
            if (userNames.claim(data.username)) {
                //  we free up the guest name
                userNames.free(username);
                bc('user:join', {
                    'timestamp': UTCTimeString(new Date()),
                    'message': username+' > '+data.username
                }, 'server');
                //  we set the user provided username
                username = data.username;
                
                
                bc('user:join', {
                    'timestamp': UTCTimeString(new Date()),
                    'message': username+' has joined'
                }, 'server');
            } else {
                //  let user know, his username was not accepted
            }
        });
        
        //  message relay
        client.on('message', function(data){
            bc('message', data);
        });
        
    });

})();