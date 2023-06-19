import axios from "axios";
import { useState, useEffect } from "react";

export default function Definitions() {
  const [currentWord, setCurrentWord] = useState('')
  const [score, setScore] = useState(0)
  const [options, setOptions] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [streak, setStreak] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(3)
  const chime = document.getElementById('chime')
  const alarm = document.getElementById('alarm')
  const synth = window.speechSynthesis;

  const levels = {
    3: {next: 5},
    5: {next: 8, prev: 3},
    8: {next: 12, prev: 5},
    12: {prev: 8}
  }

  useEffect(()=>{
    getOptions()
  }, [])

  function levelToWord(level) {
    switch (level) {
      case 3:
        return 'Novice';
      case 5:
        return 'Beginner';
      case 8:
        return 'Skilled';
      case 12:
        return 'Advanced';
    }
  }

  function pronounce (text) {
    synth.cancel();
    const msg = new SpeechSynthesisUtterance();
    msg.rate = 0.8;
    msg.pitch = 1.1;
    msg.text = text;
    msg.lang = 'en'
    synth.speak(msg);
  }

  async function getOptions() {
    
    let config = {headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Basic c3BlbGxpbmdiZWU6Y2hhbXBpb24xMDAh'}}
    const ops = [];
    for (let i=0; i<4; i++) {
      const res = await axios.get('/api/random?grade='+currentLevel, config)
      if (correctWords.includes(res.data.word)) {
        i--;
      } else {
        ops.push(res.data)
      }
    }
    setOptions([...ops])
    const word = ops[Math.floor(Math.random() * ops.length)]
    console.log(word)
    console.log(ops)
    setCurrentWord(await word)
    pronounce(await word.word)
  }

  function toTitleCase(string) {
    if (!string) {return string}
    const arr = string.split('');
    arr[0] = arr[0].toUpperCase();
    for (let i = 1; i<arr.length; i++) {
      arr[i] = arr[i].toLowerCase()
    }
    return arr.join('')
  }

  function wrongAnswer() {
    let box = document.getElementById('currentWord');
    box.style.background = "orangered";
    const defs = document.querySelectorAll('.definition');
    for (let def of defs) {
      if (def.innerHTML !== currentWord.definition) {
        def.style.opacity = '0.1'
      }
    }
    if (score < Math.floor(currentWord.gradeLevel / 2)) {
      setScore(0)
    } else {
      setScore(score => score - Math.floor(currentWord.gradeLevel / 2))
    }
    setStreak(0)
    setTimeout(()=>{
      for (let def of defs) {
        def.style.opacity = '1'
      }
      box.style.background = 'initial';
      getOptions();
    }, 3000)
  }

  function rightAnswer() {
    let box = document.getElementById('currentWord');
    box.style.background = "cornsilk";
    box.style.color = 'darkblue'
    let check = document.getElementById('checkMark');
    check.style.scale = '1.5';
    setScore(score => score + Math.floor(currentWord.gradeLevel / 2))
    setCorrectWords([...correctWords, currentWord.word])
    setStreak(streak => streak + 1);
    console.log(streak);
    if (streak > 9) {
      setCurrentLevel(levels[currentLevel].next);
      setStreak(0);
    }
    setTimeout(()=>{
      box.style.background = 'initial';
      box.style.color = '#EDF2EF'
      check.style.scale = '0'
      getOptions();
    }, 2000)
  }

  function checkAnswer(e) {
    e.preventDefault();
    if (e.target.innerHTML.toLowerCase() === currentWord.definition.toLowerCase()) {
      chime.play();
      rightAnswer(e);
    } else {
      alarm.play();
      wrongAnswer(e);
    }
  }

  return (
      <article className="appContainer">
          <h3 id="score">Score: {score}</h3>
          <h3 id="level">Level: {levelToWord(currentLevel)}</h3>
          <i id='checkMark' className="bi bi-check-circle-fill"></i>
          <button
            id='currentWord'
            onClick={()=>{pronounce(currentWord.word)}}>{currentWord && toTitleCase(currentWord.word)}</button>
          <p><small>{currentWord && Math.floor(currentWord.gradeLevel / 2)} point word</small></p>
          <div className="defContainer">
            {options.map((op, idx) => (
                  <button className='definition' onClick={checkAnswer} key={idx}>{op.definition}</button>
              ))
            }
          </div>
            <button className='warning' onClick={()=>{setStreak(0); getOptions()}}>Skip</button>
      </article>
  )
}
