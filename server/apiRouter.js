module.exports = (socketHandler) => {
  const passport = require('passport');
  const auth = require('./authHelpers.js');

  let router = require('express').Router();
  let db = require('../database');

  // Returns data about the user who sent this request
  router.get('/currentuser', auth.isLoggedIn, (req, res) => {
    res.send(JSON.stringify(req.user));
  });

  router.get('/messages', auth.isLoggedIn, (req, res) => {
    // Get a list of messages with a particular user
    db.getMessages(req.user.email, req.query.user)
    .then(JSON.stringify)
    .then(res.send)
    .catch((error) => {
      res.send(JSON.stringify({error}));
    });
  });

  router.get('/friends', auth.isLoggedIn, (req, res) => {
    // Get a list of all friends and pending friend requests
    db.getFriendData(req.user.email).then(JSON.stringify).then((data) => {
      res.send(data);
    });
  });
  router.post('/friends', auth.isLoggedIn, (req, res) => {
    if (req.body.type === 'request') {
      db.sendFriendRequest(req.user.email, req.body.user)
      .then(() => {
        res.send(JSON.stringify({message: 'success'}));
      })
      .catch((error) => {
        res.send(JSON.stringify({error}));
      });
    } else if (req.body.type === 'accept') {
      db.acceptFriendRequest(req.user.email, req.body.user)
      .then(() => {
        res.send(JSON.stringify({message: 'success'}));
      })
      .catch((error) => {
        res.send(JSON.stringify({error}));
      });
    } else {
      res.send(JSON.stringify({error: 'Did not specify whether a friend request was sent or accepted'}));
    }
  });
  router.delete('/friends', auth.isLoggedIn, (req, res) => {
    db.removeFriend(req.user.email, req.query.user)
    .then(() => {
      res.send(JSON.stringify({message: 'success'}));
    })
    .catch((error) => {
      res.send(JSON.stringify({error}));
    });
  });

  // Expects another user's email in req.body.userEmail
  // and then adds a friend request with that particular user
  router.post('/friends', auth.isLoggedIn, (req, res) => {
    var friender = req.user;
    var friendee;
    db.getUser({email: req.body.userEmail}).then((user) => {
      friendee = user;
    }).then(() => {
      return db.addFriend(friender.id, friendee.id, 'create');
    }).catch((err) => {
      res.send('The email you entered is not linked to an existing user');
    }).then((data) => {
      if (data) {
        res.send('Friend request sent');
      } else {
        res.send('Something went wrong when submitting friend request');
      }
    });
  });
  // TODO - Link these together
  router.post('/friends', auth.isLoggedIn, (req, res) => {
    var friender = req.user;
    var friendee;
    db.getUser({id: req.body.friendId}).then((user) => {
      friendee = user;
      return db.addFriend(friender.id, friendee.id, 'accept')
    }).then(() => {
      res.send('Friend request accepted');
    });
  });

  router.delete('/friends', auth.isLoggedIn, (req, res) => {
    var unfriender = req.user;
    var unfriendee;
    db.getUser({id: req.body.friendId}).then((user) => {
      unfriendee = user;
      db.removeFriend(unfriender.id, unfriendee.id)
    }).then(() => {
      res.send('Friend successfully removed');
    });
  });

  router.get('/*', (req, res) => {
    res.send();
  });

  return router;
};