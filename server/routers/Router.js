const Words = require("../schemas/Words");
const Users = require('../schemas/Users');
const { Router } = require("express");

const wordRouter = new Router();

wordRouter.get("/stats", (req, res) =>{
  Words.find()
    .then(allWords => {
      const stats = {
        words: 0,
        parts_of_speech: {},
        etymologies: {},
        gradeLevels: {}
      };
      for (const word of allWords) {
        stats.words += 1;
        stats.parts_of_speech[word.part_of_speech]
          ? stats.parts_of_speech[word.part_of_speech] += 1
          : stats.parts_of_speech[word.part_of_speech] = 1;
        stats.etymologies[word.etymology]
          ? stats.etymologies[word.etymology] += 1
          : stats.etymologies[word.etymology] = 1;
        stats.gradeLevels[word.gradeLevel]
          ? stats.gradeLevels[word.gradeLevel] += 1
          : stats.gradeLevels[word.gradeLevel] = 1;
      }
      res.send(stats)
    })
    .catch((err) => {
      res.status(400).send("Error occured: "+err);
    });
})

wordRouter.use((req, res, next) => {
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

wordRouter.get("/", (req, res) => {
  Words.find()
    .then((words) => {
      res.send(words);
    })
    .catch((err) => {
      res.status(400).send("Error occured: "+err);
    });
});
wordRouter.get("/words/:word", (req, res) => {
  Words.findOne({ word: req.params.word })
    .then((word) => {
      if (!word) {
        res.status(400).send(`The word >>| ${req.params.word} |<< is not present in our database.`)
        return;
      }
      res.send(word);
    })
    .catch((err) => {
      res.status(400).send("Error occured: "+err);
    });
});

wordRouter.get("/words", (req, res) => {
    const filter = {};
    const keys = {
      word: {term: "word", val: new RegExp(`.*${req.query.word}.*`, 'i')},
      grade: {term: "gradeLevel", val: req.query.grade},
      part: {term: "part_of_speech", val: new RegExp(`.*${req.query.part}.*`, 'i')},
      origin: {term: "etymology", val: new RegExp(`.*${req.query.origin}.*`, 'i')}
    }
    for (let q in req.query) {
      if (keys.hasOwnProperty(q)) {
        filter[keys[q].term] = keys[q].val;
      } else {
        if (q == "limit") {
          break;
        }
        res.status(400).send(`Improper query format. Parameter >>| ${q} |<< not found in API query options.`)
        return;
      } 
    }
  Words.find(filter).limit(req.query.limit)
    .then((words) => {
      res.send(words);
      console.log(`Returned ${words.length} results`)
    })
    .catch((err) => {
      res.status(400).send("Error occured: "+err);
    });
})

wordRouter.get("/random", (req, res) => {
  const filter = {};
    const keys = {
      grade: {term: "gradeLevel", val: req.query.grade},
      part: {term: "part_of_speech", val: new RegExp(`.*${req.query.part}.*`, 'i')},
      origin: {term: "etymology", val: new RegExp(`.*${req.query.origin}.*`, 'i')}
    }
    for (let q in req.query) {
      if (keys.hasOwnProperty(q)) {
        filter[keys[q].term] = keys[q].val;
      } else {
        res.status(400).send(`Improper query format. Parameter >>| ${q} |<< not found in API query options.`)
        return;
      } 
    }
    Words.find(filter)
    .then((words) => {
      const random = words[Math.floor(Math.random() * words.length-1)]
      res.send(random);
      console.log(`Returned one random word: ${random.word}, from ${words.length} results`)
    })
    .catch((err) => {
      res.status(400).send("Error occured: "+err);
    });
})

module.exports = wordRouter;