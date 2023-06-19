import axios from "axios"
import { useState, useEffect } from "react"
import PropTypes from 'prop-types'

export default function Spelling(auth) {
  const [currentWord, setCurrentWord] = useState('')
  const [score, setScore] = useState(0);
  const [correctWords, setCorrectWords] = useState([]);
  const [streak, setStreak] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(3)
  const synth = window.speechSynthesis;
  const chime = document.getElementById('chime')
  const alarm = document.getElementById('alarm')

  const levels = {
    3: {next: 5},
    5: {next: 8, prev: 3},
    8: {next: 12, prev: 5},
    12: {prev: 8}
  }

  useEffect(()=>{
    getRandom()
  }, [])

  function getRandom() {
    let config = {headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': auth}}
    axios.get('/api/random?grade='+currentLevel, config).then(response => {
      if (correctWords.includes(response.data.word)) {
        return getRandom();
      } else {
        setCurrentWord(response.data)
        pronounce(response.data.word)
      }
    }).catch(err => {
      console.log("Error occured while calling server:", err)
    })
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

  function wrongAnswer(e) {
    let box = document.getElementById('spelling');
    let ans = document.getElementById('correctSpelling')
    box.style.background = "orangered";
    if (score < Math.floor(currentWord.gradeLevel / 2)) {
      setScore(0)
    } else {
      setScore(score => score - Math.floor(currentWord.gradeLevel / 2))
    }
    setStreak(0)
    ans.innerHTML = currentWord.word;
    setTimeout(()=>{
      box.style.background = 'initial';
      e.target.spelling.value = '';
      ans.innerHTML = '';
      getRandom();
    }, 3000)
  }

  function rightAnswer(e) {
    let box = document.getElementById('spelling');
    box.style.background = "cornsilk";
    box.style.color = 'darkblue';
    let check = document.getElementById('checkMark');
    check.style.scale = '1.5';
    setScore(score => score + Math.floor(currentWord.gradeLevel / 2))
    setCorrectWords([...correctWords, currentWord.word])
    setStreak(streak => streak + 1);
    console.log(streak)
    if (streak > 9) {
      setCurrentLevel(levels[currentLevel].next);
      setStreak(0);
    }
    setTimeout(()=>{
      box.style.background = 'initial';
      box.style.color = '#EDF2EF'
      e.target.spelling.value = '';
      check.style.scale = '0';
      getRandom();
    }, 2000)
  }

  function checkSpelling(e) {
    synth.cancel();
    e.preventDefault();
    if (e.target.spelling.value.toLowerCase() === currentWord.word.toLowerCase()) {
      chime.play()
      rightAnswer(e)
    } else {
      alarm.play()
      wrongAnswer(e)
    }
  }

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

  return (
      <article className="appContainer">
            <h3 id="score">Score: {score}</h3>
            <h3 id="level">Level: {levelToWord(currentLevel)}</h3>
            <i id='checkMark' className="bi bi-check-circle-fill"></i>
          <section className="">
            <div className="">
              <p id="correctSpelling" className=""></p>
              <form className='' onSubmit={checkSpelling}>
                <label className='' htmlFor='spelling'>{Math.floor(currentWord.gradeLevel / 2)} point word</label>
                <input type="text" autoComplete='false' className='' name='spelling' id='spelling'/>
                <button className='primary' type='submit'>Check</button>
              </form>
            </div>
            <div className="speechContainer">
              <button onClick={()=>{pronounce(currentWord.word)}} className='speech'>Repeat Word</button>
              <button onClick={()=>{pronounce(currentWord.definition)}} className='speech'>Definition</button>
              <button onClick={()=>{pronounce(currentWord.part_of_speech)}} className='speech'>Part of Speech</button>
              <button onClick={()=>{pronounce(currentWord.etymology)}} className='speech'>Etymology</button>
              <button onClick={()=>{pronounce(currentWord.example_sentence)}} className='speech'>Use in a Sentence</button>
            </div>
          </section>
          <section className="">
            <button className='warning' onClick={()=>{getRandom()}}>Skip</button>
          </section>
      </article>
  )
}

Spelling.propTypes = {
  auth: PropTypes.string
}