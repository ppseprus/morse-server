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

The following events are also emitted for every client
- user:connect
- user:disconnect
- user:join
- message