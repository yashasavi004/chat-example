/*var app = require('express')();
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
*/

//new index js file

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function(){
  console.log('listening on *:3000');
});

var onlineUser = [];
var onlineUserName = [];

io.on('connection', function(socket){
	
	console.log('a user connected');
	socket.on('userData',function(name) {
		onlineUser.push({socketObj : socket, username : name, id : socket.id});
		onlineUserName.push({username : name});
		console.log(onlineUser.length);
		io.emit('onlineUser',onlineUserName);
	});
	
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});
	
	socket.on('private', function(chatObj) {
		var chateeInd = findWithAttr(onlineUser, 'username', chatObj.name);
		if(chateeInd != -1) {
			onlineUser[chateeInd].socketObj.emit('chat message', chatObj.msg);
		}
		
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		var ind = findWithAttr(onlineUser, 'id', socket.id);
		if( ind != -1)
		{
			var deletename = onlineUser[ind].username;
			onlineUser.splice(ind,1);
			onlineUserName.splice(findWithAttr(onlineUserName,'username',deletename),1);
		}
		console.log(onlineUser.length);
		io.emit('onlineUser',onlineUserName);
		
  });
  
  
});

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}


