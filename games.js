var _ = require('underscore');
var persist = require('./persist');
// var readGame = false;

var Player = function(username, id, symbol){
  this.username = username;
  this.id = id;
  this.playerSymbol = symbol;
}

var Game = function(){
  this.board = [];
  this.isStarted = false;
  this.currentTurn = null;
  this.player1 = Player;
  this.player2 = Player;
  this.numPlayers = 0;
  this.isCompleted = false;
}

Game.prototype.addPlayer = function(username, id){

  if(this.numPlayers >= 2){
    throw "Game is already full. Join a different game."
  }
  else if(this.isStarted){
    throw "Game has already started. Cannot join game."
  } else{
    if(username === ""){
      throw "Username is empty."
    }

    for(var k in this.players){
      throw "Username is not unique";
    }

    if(this.numPlayers === 0){
      var newPlayer = new Player(username, id, 1);
      this.player1 = newPlayer;
      this.numPlayers++;
      return newPlayer.id;
    }else{
      var newPlayer = new Player(username, id, 2);
      this.player2 = newPlayer;
      this.numPlayers++;
      return newPlayer.id;
    }
  }
}

Game.prototype.nextPlayer(){
  if(!this.currentTurn){
    this.currentTurn = this.player1;
  }else if(this.currentTurn.id === this.player1.id){
    this.currentTurn = this.player2;
  }else{
    this.currentTurn = this.player1;
  }
}

Game.prototype.startGame = function(){

  if(this.isStarted){
    throw "Game has already started."
  }

  if(this.numPlayers< 2){
    throw "Fewer than 2 people in game.";
  }

  if(this.numPlayers > 2){
    throw "Too many people in game.";
  }

  this.isStarted = true;

  for(var i=0; i<6; i++){
    this.board.push([0, 0, 0, 0, 0, 0, 0]);
  }

  this.currentTurn = this.player1;
}

// Code was written with reference to http://stackoverflow.com/questions/32770321/connect-4-check-for-a-win-algorithm
Game.prototype.hasWon = function(playerId, rowNum, colNum){

  if(!this.isStarted){
    throw "Game hasn't started yet.";
  }

  var currentPlayer;

  if(playerId === this.player1.id){
    currentPlayer = this.player1;
  }else if(playerId === this.player2.id){
    currentPlayer = this.player2;
  }else{
    throw "That player is not a part of this game.";
  }

  var currentSymbol = currentPlayer.playerSymbol;
  var count = 0;

  //Horizontal Check
  for(var i=0; i<7; i++){
    if(this.board[rowNum][i] === currentSymbol){
      count++;
    }else{
      count = 0;
    }

    if(count >= 4){
      return true;
    }
  }

  //Vertical Check
  for(var i=0; i<6; i++){
    if(this.board[i][colNum] === currentSymbol){
      count++;
    }
    else{
      count = 0;
    }
    if(count >= 4){
      return true;
    }
  }

  //TOP-LEFT TO BOTTOM-RIGHT
  for(var i=0; i<(6-4); i++){
    count=0;
    var int, col;
    for(var j=i, col=0; j<6 && i<7; j++, col++){
      if(this.board[j][col] === currentSymbol){
        count++;
        if(count >= 4){
          return true;
        }
      }else{
        count = 0;
      }
    }
  }

    // top-left to bottom-right - red diagonals
  for(var colStart = 1; colStart < (7 - 4); rowStart++){
      count = 0;
      int row, col;
      for(var row = 0, col = colStart; row < 6 && col < 7; row++, col++ ){
          if(gridTable[row][col] == currentSymbol){
              count++;
              if(count >= 4) return true;
          }
          else {
              count = 0;
          }
      }
  }
  return false;
}

Game.prototype.completeGame(function(){
  if(!this.isStarted){
    throw "Game hasn't started yet.";
  }else{
    if(!this.isCompleted){
      throw "Game has already ended";
    }else{
      //END THE GAME
      this.isCompleted = true;
    }
  }
});

/*
Insert player symbol into a specific columns' lowest available row.
Return true if successful and false otherwise
*/
Game.prototype.insertToken = function(colNum, playerSymbol, playerId){

  var insertTokenSuccess = false;
  var rowNum;

  for(var i=0; i<6; i++){
    if(this.board[i][colNum] === 0){
      this.board[i][colNum] = playerSymbol;
      insertTokenSuccess = true;
      rowNum = i;
    }
  }

  if(!insertTokenSuccess){
    throw "Was not able to place a token in that column.";
  }

  var hasWon = false;
  if(insertTokenSuccess){
    hasWon = this.hasWon(playerId, rowNum, colNum);
  }

  return hasWon;

}

module.exports = Game;
