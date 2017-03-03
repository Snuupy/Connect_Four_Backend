"use strict";

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // Not used yet below this line
  email: String,
  sessionId: String
});

var gameBoardSchema = mongoose.Schema({
  board: {
    type: [[]],
    required: true
  },
  playerOne: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'

  },
  playerTwo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

userSchema.plugin(findOrCreate);

module.exports = {
  User: mongoose.model('User', userSchema),
  GameBoard: mongoose.model('GameBoard', gameBoardSchema)
};
