const Users = require('../schemas/Users');
const { Router } = require("express");

const userRouter = new Router();
const emptyGameData = {
  spelling: {
      score: 0,
      level: 3,
      correctWords: [],
      wrongWords: []
  },
  definitions: {
      score: 0,
      level: 3,
      correctWords: [],
      wrongWords: []
  },
  likeness: {
    score: 0,
    level: 3,
    correctWords: [],
    wrongWords: []
}
}

userRouter.use((req, res, next) => {
    let authHead = req.headers.authorization;
    if (!authHead) {
      let err = new Error('No Authorization Header Found in Request.');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err)
    }
    const auth = new Buffer.from(authHead.split(' ')[1],'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
    Users.findOne({username: user, password: pass})
      .then(user => {
        if (!user) {
          let err = new Error('No user account found.')
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
        }
        console.log(user.authLevel)
        if (user.authLevel > 0) {
          next();
        } else {
          let err = new Error('Incorrect credentials, or not a high enough authorization level.');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
        }
      }).catch(err => {
        return next(err)
      })
  })

  userRouter.get('/:sub', (req, res) => {
    Users.findOne({sub: req.params.sub})
        .then(response => {
            if (!response) {
                Users.create({
                    username: 'spellingbee',
                    password: 'champion100!',
                    authLevel: 1,
                    sub: req.params.sub,
                    gameData: {...emptyGameData}
                }).then(result => {res.send(result.gameData)}).catch(err => console.log(err))
            } else if (response === 'guest') {
                Users.findOneAndUpdate({sub: req.params.sub}, {
                  $set: {
                    gameData: {...emptyGameData}
                  }})
                    .then(response => res.send(response.gameData))
                    .catch(err => console.log(err))
            } else {
                res.send(response.gameData)
            }
        }).catch(err => console.log(err))
  })

  userRouter.post('/:sub', (req, res) => {
    Users.findOneAndUpdate({sub: req.params.sub}, {
      $set: {gameData: {...req.body}}
    })
      .then(response => res.send(response))
      .catch(err => console.log(err))
  })

  module.exports = userRouter;