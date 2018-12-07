const express = require('express');
const routes = require('./routes.js');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//Express App setup
app.use('/', routes);
app.use(express.static(__dirname + '/public'));

//Server Settings
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

io.on('connection', function(socket){
  console.log(`new connection`);
  
  socket.on('message', function(msg){
    let usr = socket.client.id;
    console.log(msg);
    io.emit('message', `${usr}: ${msg}`);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
})


