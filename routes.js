"use strict";

var bcrypt = require('bcrypt');
var express = require('express');
var models = require('./models');
var User = models.User;
var Message = models.Message;
var _ = require('underscore');
var multer = require('multer');

module.exports = function (passport) {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.send("Hello");
  });

  /* Authentication routes */

  router.get('/login/failure', function(req, res) {
    res.status(401).json({
      success: false,
      error: req.flash('error')[0]
    });
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/login/success',
    failureRedirect: '/login/failure',
    failureFlash: true
  }));

  router.post('/register', function(req, res, next) {

    var params = _.pick(req.body, ['username', 'password']);
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(params.password, salt, function(err, hash) {
        // Store hash in your password DB.
        params.password = hash;
        models.User.create(params, function(err, user) {
          if (err) {
            res.status(400).json({
              success: false,
              error: err.message
            });
          } else {
            res.json({
              success: true,
              user: user
            });
          }
        });
      });
    });
  });

  // Beyond this point the user must be logged in
  router.use(function(req, res, next) {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        success: false,
        error: 'not authenticated'
      });
    } else {
      next();
    }
  });
  router.get('/logout', function(req, res) {
    req.logout();
    res.json({
      success: true,
      message: 'logged out.'
    });
  });

  router.get('/login/success', function(req, res) {
    var user = _.pick(req.user, 'username', '_id');
    res.json({
      success: true,
      user: user
    });
  });

  router.get('/users', function(req, res) {
    User
    .find()
    // .limit(req.query.limit || 25)
    .exec(function(err, users) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          users: users.map(_.partial(_.pick, _, ['username', '_id']))
        });
      }
    });
  });

  return router;
};
