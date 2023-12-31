import PropTypes from 'prop-types';
import axios from "axios"
import { useState, useEffect } from "react"

export default function Spelling({userData, setUserData, apiKey}) {
  const {score, correctWords, wrongWords} = userData.spelling;
  const currentLevel = userData.spelling.level;
  const [currentWord, setCurrentWord] = useState('')
  const [streak, setStreak] = useState(0)
  const synth = window.speechSynthesis;
  const chime = document.getElementById('chime')
  const alarm = document.getElementById('alarm')

  const levels = {
    3: {next: 5},
    5: {next: 8, prev: 3},
    8: {next: 12, prev: 5},
    12: {next: 16, prev: 8},
16: {prev: 12}
  }

  useEffect(()=>{
    getRandom()
    setTimeout(()=>{document.querySelector(".dropdown").classList.toggle('hidden')}, 500);
    setTimeout(()=>{
      document.querySelector(".dropdown").classList.toggle('hidden');
    }, 1500)
  }, [])

  function getRandom() {
    const done = [];
    for (const w in correctWords) {
      done.push(w.word);
    }
    let config = {headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': apiKey}}
    axios.get('https://beeyondwords.vercel.app/api/random?grade='+currentLevel, config).then(response => {
      if (done.includes(response.data[0].word)) {
        return getRandom();
      } else {
        setCurrentWord(response.data[0])
        pronounce(response.data[0].word)
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
    setUserData({
      ...userData,
      spelling: {
        ...userData.spelling,
        score: (score < Math.floor(currentWord.gradeLevel / 2)) ? 0 : score - Math.floor(currentWord.gradeLevel / 2),
        wrongWords: [...wrongWords, currentWord]
      }
    })
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
    setUserData({
      ...userData,
      spelling: {
        ...userData.spelling,
        score: score + Math.floor(currentWord.gradeLevel / 2),
        correctWords: [...correctWords, currentWord],
        level: streak > 9 ? levels[currentLevel].next : currentLevel
      }
    })
    setStreak(streak => streak > 9 ? 0 : streak + 1);
    setTimeout(()=>{
      box.style.background = 'initial';
      box.style.color = 'var(--almostwhite)'
      e.target.spelling.value = '';
      check.style.scale = '0';
      getRandom();
    }, 2000)
  }

  function checkSpelling(e) {
    synth.cancel();
    e.preventDefault();
    if (e.target.spelling.value.toLowerCase().trim() === currentWord.word.toLowerCase()) {
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
case 16:
return 'Expert';
    }
  }

  return (
      <article className="appContainer">
            <h3 id="score">Score: {score}</h3>
            <h3 id="level">Level: {levelToWord(currentLevel)}</h3>
            <i id='checkMark' className="bi bi-check-circle-fill"></i>
          <section className="">
            <div id="spellingInputContainer">
              <p id="correctSpelling" className=""></p>
              <form className='' onSubmit={checkSpelling} autoComplete='off' autoCorrect='off'>
                <label className='' htmlFor='spelling'>{currentWord ? Math.floor(currentWord.gradeLevel / 2)+" point word" : "Fetching a word..."}</label>
                <input 
                  type="text" 
                  autoComplete='off' 
                  autoCorrect='off' 
                  autoCapitalize="off" 
                  spellCheck="false" 
                  pattern='\s*[a-zA-Z]*-*[a-zA-Z]+\s*' 
                  title='Please use only letters and/or hyphen characters.' 
                  name='spelling' 
                  id='spelling' 
                  onFocus={(event) => {
                    event.target.setAttribute('autocomplete', 'off');
                    console.log(event.target.autocomplete);
                  }}
                />
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
            <button className='warning' onClick={()=>{getRandom(); setStreak(0)}}>Skip</button>
          </section>
      </article>
  )
}

Spelling.propTypes = {
  userData: PropTypes.object,
  setUserData: PropTypes.func,
  apiKey: PropTypes.string
}