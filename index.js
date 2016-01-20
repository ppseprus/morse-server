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


io.on('connection', (client) => {
    //  give the user a guest number
    var username = userNames.getGuestName();
    
    
    function bc(event, data, u) {
        if (typeof u === 'undefined') { u = username; }
        client.broadcast.emit(event, `${data.timestamp} ${u}: ${data.message}`);
        console.log(`${data.timestamp} ${u}: ${data.message}`);
    }
    
    
    //  client connects
    bc('user:connect', {
        'timestamp': (new Date()).toISOString(),
        'message': username+' has connected'
    }, 'server');
    
    //  client disconnects
    client.on('disconnect', function(){
        userNames.free(username);
        bc('user:disconnect', {
            'timestamp': (new Date()).toISOString(),
            'message': username+' has disconnected'
        }, 'server');
    });
    
    //  client joins a.k.a. names himself
    client.on('user:join', function(data){
        if (userNames.claim(data.username)) {
            //  we free up the guest name
            userNames.free(username);
            bc('user:join', {
                'timestamp': (new Date()).toISOString(),
                'message': username+' > '+data.username
            }, 'server');
            //  we set the user provided username
            username = data.username;
            
            
            bc('user:join', {
                'timestamp': (new Date()).toISOString(),
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