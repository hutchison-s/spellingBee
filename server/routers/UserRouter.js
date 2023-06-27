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
  Users.findOne({sub: req.params.sub}, )
      .then(response => {
          if (!response) {
              res.send(null)
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

userRouter.post('/create', (req, res) => {
  let newUser = {
    username: process.env.NEW_USER,
    password: process.env.NEW_PASS,
    name: req.body.name,
    email: req.body.email,
    sub: req.body.sub,
    gamerName: '',
    gameData: emptyGameData
  }
  Users.create(newUser).catch(err => console.log(err))
  res.send(newUser)
})

userRouter.get('/leaderboard/:game', (req, res) => {
  if (req.params.game !== 'all') {
    const board = [];
    Users.find({name: {$ne: null}}).then(allUsers => {
      for (const user of allUsers) {
        board.push({name: user.gamerName, score: user.gameData[req.params.game].score})
      }
      board.sort((a,b) => (b.score - a.score));
      if (board.length > 20) {
        board.splice(20, board.length-20)
      }
      res.send(board)
    }).catch(err => console.log(err))
  } else {
    Users.find({name: {$ne: null}}).then(allUsers => {
      const board = [];
      for (const user of allUsers) {
        let totalScore = (
          user.gameData.spelling.score
          + user.gameData.definitions.score
          + user.gameData.compare.score
        )
        board.push({name: user.gamerName, score: totalScore})
      }
      board.sort((a,b) => (b.score - a.score));
      if (board.length > 20) {
        board.splice(20, board.length-20)
      }
      res.send(board)
    }).catch(err => console.log(err))
  }
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
    }, {new: true})
      .then(response => res.send(response))
      .catch(err => console.log(err))
  })

  userRouter.put('/:sub', (req, res) => {
    Users.findOneAndUpdate({sub: req.params.sub}, req.body, {new: true})
      .then(response => res.send(response))
      .catch(err => console.log(err))
  })

  userRouter.delete('/:sub', (req, res) => {
    Users.findOneAndDelete({sub: req.params.sub})
      .then(response => res.send(response))
      .catch(err => console.log(err))
  })

  module.exports = userRouter;