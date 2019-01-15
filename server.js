
'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

/*var PORT = process.env.PORT || 3000
var express = require('express');

var app = express();
var http = require('http');
var server = http.Server(app);

app.use(express.static('public'));

server.listen(PORT,function(){
  console.log("my socket server is running");
});


var socket = require('socket.io');

var io = socket(server);*/

var users = [];
var cardPairs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
var cardPairIndex = 0;

io.sockets.on('connection', newConnection);

function newConnection(socket)
{
  console.log('newConnection ' + socket.id);

  socket.on('startGame',startGame);
  socket.on('socketId', socketMsg);
  socket.on('cardFlip',cardFlip);
  socket.on('cardUnflip',cardUnflip);
  socket.on('cardMatch',cardMatch);
  socket.on('endGame',endGame);
  //helper functions
  function startGame(data)
  {
    if(data.type == "player")
    {
      if(users.length < 4)
      {
        users.push(socket.id);
        io.to(socket.id).emit('cardPairs',{pair1:cardPairs[cardPairIndex],pair2:cardPairs[cardPairIndex+1],pair3:cardPairs[cardPairIndex+2],
                                          pair4:cardPairs[cardPairIndex+3],pair5:cardPairs[cardPairIndex+4],pair6:cardPairs[cardPairIndex+5]});
        cardPairIndex += 6;
      }
      else
      {
        users.push(socket.id);
        io.to(socket.id).emit('tooManyPlayers');
      }
    }
  }

  function socketMsg(data)
  {
    socket.broadcast.emit('socketId', data.id);
  }

  function cardFlip(data)
  {
    socket.broadcast.emit('cardFlip',data.cardId);
  }

  function cardUnflip(data)
  {
    socket.broadcast.emit('cardUnflip',data);
  }

  function cardMatch(data)
  {
    socket.broadcast.emit('cardMatch',data);
  }

  function endGame()
  {
    users=[];
    cardPairIndex = 0;
    socket.broadcast.emit('reset');
    socket.disconnect();
  }


}
