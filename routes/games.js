var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

var Game = require('../models/game');
var User = require('../models/user');
var Trade = require('../models/trade');

router.use(authMiddleware);

// get games that aren't yours that are available for trade: 
router.get('/', function(req, res, next) {  
  User
  .find({
    '_id': { $ne: req.user._id}
  })
  .populate('games')
  .exec(function(err, users){
    console.log(users, "USERS");
    if(err) return res.status(400).send(err); 
    var games = []; 
    users.forEach(function(entry){
      entry.games.forEach(function(game){
        if (game.canTrade) {
          game.userId = entry._id; 
          games.push(game);
        };
      });
    });
    res.render('index', { title: "Game Trade", user: req.user, games: games , state: "games"});
  });
});


// my games
// find only games that has the user
router.get('/mine', function(req, res, next) {  
  console.log('requser', req.user);
  User
  .findById(req.user._id)
  .populate('games')
  .exec(function(err, user) {
    if (err) { res.status(400).send(err); return; };
    res.render('inventory', {games: user.games, user: req.user});
  });
});


router.get('/offerTrade/:desiredGame/:owner', function(req, res, next) {  
  console.log('requser', req.user);
  User
  .findById(req.user._id)
  .populate('games')
  .exec(function(err, user) {
    if (err) { res.status(400).send(err); return; };
    res.render('inventory', {
      state: "offerTrade",
      games: user.games, 
      user: req.user,
      desiredgame: req.params.desiredGame, 
      ownerid: req.params.owner
    });
  });
});

router.post('/', function(req, res) {
  User.findById(req.user._id, function(err, user) {
    req.body.userId = req.user._id; 
    var game = new Game(req.body); 
    game.save(function(err, savedGame){
      if (err) {res.status(400).send(err)};
      user.games.push(game._id);
      user.save(function(err, savedUser) {
        res.status(err ? 400 : 200).send(err || savedUser); 
      });
    });
  });
});


// Game detail show page: 
router.get('/showpage/:gameId/:ownerId', function(req, res, next){
  Game.findById(req.params.gameId, function(err, game){
    if(err) res.status(400).send(err); 
    User.findById(req.params.ownerId, function(err, owner){
      res.render('showPage', {
        user: req.user,
        game:game, owner:owner,
        gameid: req.params.gameId,
        ownerid: req.params.ownerId
      });
    });
  }); 
});

router.put('/toggle/:gameid', function(req, res, next){
  Game.findById(req.params.gameid, function(err, game){
    if(err) res.status(400).send(err);
    game.canTrade = !game.canTrade;
    game.save(function(err, savedGame){
      res.status(err ? 400 : 200).send(err || savedGame);
      console.log('toggled game');
    });
  });
});

module.exports = router;