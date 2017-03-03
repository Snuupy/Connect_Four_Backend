var express = require('express');
var router = express.Router();

io.on('connect', onConnect);

function onConnect(socket){

  // sending to the client
  socket.emit('hello', 'can you hear me?', 1, 2, 'abc');

};


module.exports = router;
