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
  compare: {
    score: 0,
    level: 3,
    correctWords: [],
    wrongWords: []
}
}

userRouter.get('/:sub', (req, res) => {
  console.log('reached server')
  Users.findOne({sub: req.params.sub}, )
      .then(response => {
          if (!response) {
              let user = Users.create({
                  username: process.env.NEW_USER,
                  password: process.env.NEW_PASS,
                  authLevel: 1,
                  sub: req.params.sub,
                  gameData: {...emptyGameData}
                }).catch(err => console.log(err));
                console.log(user)
                res.send(user)
          } else if (response.sub === 'guest') {
              Users.findOneAndUpdate({sub: 'guest'}, {
                $set: {
                  gameData: {...emptyGameData}
                }})
                  .then(response => res.send(response))
                  .catch(err => console.log(err))
          } else {
              res.send(response)
          }
      }).catch(err => console.log(err))
})

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

  userRouter.post('/:sub', (req, res) => {
    Users.findOneAndUpdate({sub: req.params.sub}, {
      $set: {gameData: {...req.body}}
    })
      .then(response => res.send(response))
      .catch(err => console.log(err))
  })

  module.exports = userRouter;