# Morse server
This is the backend for the chat application. It is using socket.io

## How to run

```
npm install
npm start
```

The server will listen on port: **3000**


## API

### Event types

**user:connect**
When the user connects, a guest number is assigned.
```
data = {
	'event': 'user:connect',
	'username': 'server',
	'for': 'everyone',
	'timestamp': <HH:mm:ss.sss UTC>,
	'message': '<username> has connected'
}
```

**user:disconnect**
```
data = {
	'event': 'user:disconnect',
	'username': 'server',
	'for': 'everyone',
	'timestamp': <HH:mm:ss.sss UTC>,
	'message': '<username> has disconnected'
}
```

**user:join**
This event is where the user actually claims a username and IF it is claimed (=the username was not previously taken), the following two events are emitted.
The first event shows which guest user took the actual username, while the second event is just a log.
```
data = {
	'event': 'user:join',
	'username': 'server',
	'for': 'everyone',
	'timestamp': <HH:mm:ss.sss UTC>,
	'message': '<guest#> > <username>'
}

data = {
	'event': 'user:join',
	'username': 'server',
	'for': 'everyone',
	'timestamp': <HH:mm:ss.sss UTC>,
	'message': '<username> has joined'
}
```

**message**
This event type is a relay. Any message sent with this event type is sent to every client.
```
data = {
	'event': 'user:disconnect',
	'username': <username>,
	'for': 'everyone',
	'timestamp': <HH:mm:ss.sss UTC>,
	'message': <message>
}
```