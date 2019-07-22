var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const connections = [];

io.sockets.on('connection',(socket) => {
   connections.push(socket);
   console.log(' %s sockets is connected', connections.length);
  socket.on('disconnect', () => {
      connections.splice(connections.indexOf(socket), 1);
   });
  socket.on('sending message', (message) => {
      console.log('Message is received :', message);
    io.sockets.emit('new message', {message: message});
   });
});

/*io.on('connection', function(socket){
  socket.username = "Test";
  socket.on('change_username', (data) => {
    socket.username = data.username;
  })
  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});*/

http.listen(port, function(){
  console.log('listening on *:' + port);
});
