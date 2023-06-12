const Words = require("../schemas/Words");
const { Router } = require("express");

const wordRouter = new Router();

wordRouter.get("/", (req, res) => {
  Words.find()
    .then((words) => {
      res.send(words);
    })
    .catch((err) => {
      res.status(400).json("Error occured:", err);
    });
});
wordRouter.get("/words/:word", (req, res) => {
  Words.findOne({ word: req.params.word })
    .then((word) => {
      if (!word) {
        res.status(400).json(`The word >>| ${req.params.word} |<< is not present in our database.`)
        return;
      }
      res.send(word);
    })
    .catch((err) => {
      res.status(400).json("Error occured:", err);
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
        res.status(400).json(`Improper query format. Parameter >>| ${q} |<< not found in API query options.`)
        return;
      } 
    }
  Words.find(filter).limit(req.query.limit)
    .then((words) => {
      res.send(words);
      console.log(`Returned ${words.length} results`)
    })
    .catch((err) => {
      res.status(400).json("Error occured:", err);
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
        res.status(400).json(`Improper query format. Parameter >>| ${q} |<< not found in API query options.`)
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
      res.status(400).json("Error occured:", err);
    });
})

module.exports = wordRouter;