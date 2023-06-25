import axios from "axios";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

export default function Compare({ userData, setUserData }) {
  const { score, correctWords, wrongWords } = userData.compare;
  const currentLevel = userData.compare.level;
  const [currentWord, setCurrentWord] = useState(null);
  const [otherWord, setOtherWord] = useState([]);
  const [streak, setStreak] = useState(0);
  const chime = document.getElementById("chime");
  const alarm = document.getElementById("alarm");
  const synth = window.speechSynthesis;

  let config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic c3BlbGxpbmdiZWU6Y2hhbXBpb24xMDAh",
    },
  };

  const levels = {
    3: { next: 5 },
    5: { next: 8, prev: 3 },
    8: { next: 12, prev: 5 },
    12: { next: 16, prev: 8 },
    16: { prev: 12 },
  };

  useEffect(() => {
    getOptions();
  }, []);

  function levelToWord(level) {
    switch (level) {
      case 3:
        return "Novice";
      case 5:
        return "Beginner";
      case 8:
        return "Skilled";
      case 12:
        return "Advanced";
      case 16:
        return "Expert";
    }
  }

  function pronounce(text) {
    synth.cancel();
    const msg = new SpeechSynthesisUtterance();
    msg.rate = 0.8;
    msg.pitch = 1.1;
    msg.text = text;
    msg.lang = "en";
    synth.speak(msg);
  }

  async function getOptions() {
    axios
      .get(
        `https://beeyondwords.vercel.app/api/random?part=adjective|verb|adverb&grade=${currentLevel}`,
        config
      )
      .then((current) => {
        axios
          .get(
            `https://beeyondwords.vercel.app/api/random?part=adjective|verb|adverb&grade=${currentLevel}`,
            config
          )
          .then((unrelated) => {
            const { synonyms, antonyms } = current.data;
            const nonWord = [unrelated.data.word];
            const choice = [synonyms, antonyms, nonWord][
              Math.floor(Math.random() * 3)
            ];
            let comparison = choice[Math.floor(Math.random() * choice.length)];
            setOtherWord(comparison);
            setCurrentWord(current.data);
            pronounce(`${current.data.word}, ${comparison}`)
          });
      });
  }

  function wrongAnswer(correct) {
    let box = document.getElementById("currentWord");
    let other = document.getElementById("otherWord");
    box.style.background = "orangered";
    other.style.background = "orangered";
    const defs = document.querySelectorAll(".definition");
    for (let def of defs) {
      if (def.innerHTML !== correct) {
        def.style.opacity = "0.1";
      }
    }
    setUserData({
      ...userData,
      compare: {
        ...userData.compare,
        score:
          score < Math.floor(currentWord.gradeLevel / 2)
            ? 0
            : score - Math.floor(currentWord.gradeLevel / 2),
        wrongWords: [...wrongWords, currentWord],
      },
    });
    setStreak(0);
    setTimeout(() => {
      for (let def of defs) {
        def.style.opacity = "1";
      }
      box.style.background = "initial";
      other.style.background = "initial";
      getOptions();
    }, 3000);
  }

  function rightAnswer() {
    let box = document.getElementById("currentWord");
    let other = document.getElementById("otherWord");
    box.style.background = "var(--almostwhite)";
    box.style.color = "var(--raisin)";
    other.style.background = "var(--almostwhite)";
    other.style.color = "var(--raisin)";
    let check = document.getElementById("checkMark");
    check.style.scale = "1.5";
    setUserData({
      ...userData,
      compare: {
        ...userData.compare,
        score: score + Math.floor(currentWord.gradeLevel / 2),
        correctWords: [...correctWords, currentWord],
        level: streak > 9 ? levels[currentLevel].next : currentLevel,
      },
    });
    setStreak((streak) => (streak > 9 ? 0 : streak + 1));
    setTimeout(() => {
      box.style.background = "initial";
      box.style.color = "var(--almostwhite)";
      other.style.background = "initial";
      other.style.color = "var(--almostwhite)";
      check.style.scale = "0";
      getOptions();
    }, 2000);
  }

  function checkAnswer(e) {
    e.preventDefault();
    let isSyn = currentWord.synonyms.includes(otherWord);
    let isAnt = currentWord.antonyms.includes(otherWord);
    let isNone =
      !currentWord.synonyms.includes(otherWord) &&
      !currentWord.antonyms.includes(otherWord);
    let correct;

    switch (true) {
      case isSyn:
        correct = "Synonyms";
        break;
      case isAnt:
        correct = "Antonyms";
        break;
      case isNone:
        correct = "Unrelated";
        break;
    }

    if (e.target.innerHTML === correct) {
      chime.play();
      rightAnswer();
    } else {
      alarm.play();
      wrongAnswer(correct);
    }
  }

  return (
    <article className="appContainer">
      <h3 id="score">Score: {score}</h3>
      <h3 id="level">Level: {levelToWord(currentLevel)}</h3>
      <i id="checkMark" className="bi bi-check-circle-fill"></i>
      <button
        id="currentWord"
        className="honeyWord"
        onClick={() => {
          pronounce(currentWord.word);
        }}
      >
        {currentWord && currentWord.word}
      </button>
      <button
        id="otherWord"
        className="honeyWord"
        onClick={() => {
          pronounce(otherWord);
        }}
      >
        {otherWord && otherWord}
      </button>
      <p>
        <small>
          {currentWord && Math.floor(currentWord.gradeLevel / 2)} points
        </small>
      </p>
      <div className="defContainer">
        <button className="definition" onClick={checkAnswer}>
          Synonyms
        </button>
        <button className="definition" onClick={checkAnswer}>
          Antonyms
        </button>
        <button className="definition" onClick={checkAnswer}>
          Unrelated
        </button>
      </div>
      <button
        className="warning"
        onClick={() => {
          setStreak(0);
          getOptions();
        }}
      >
        Skip
      </button>
    </article>
  );
}

Compare.propTypes = {
  userData: PropTypes.object,
  setUserData: PropTypes.func,
};
