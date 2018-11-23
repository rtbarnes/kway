const express = require('express');
const routes = require('./routes.js');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//Express App setup
app.use('/', routes);
app.use(express.static(__dirname + '/public'));

//Server Settings
const port = 8080;

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    let usr = socket.client.id;
    console.log(msg);
    io.emit('chat message', `${usr}: ${msg}`);
  });
});

http.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
})


