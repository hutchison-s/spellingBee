import axios from "axios"
import { useState, useEffect } from "react"

export default function Spelling() {
  const [currentWord, setCurrentWord] = useState('')
  const [score, setScore] = useState(0);
  const [correctWords, setCorrectWords] = useState([]);
  const synth = window.speechSynthesis;

  useEffect(()=>{
    getRandom()
  }, [])

  useEffect(()=>{
    pronounce(currentWord.word)
  }, [currentWord])

  function getRandom() {
    let config = {headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Basic c3BlbGxpbmdiZWU6Y2hhbXBpb24xMDAh'}}
    axios.get('/api/random', config).then(response => {
      if (correctWords.includes(response.data.word)) {
        return getRandom();
      } else {
        setCurrentWord(response.data)
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
    let cb = document.getElementById('cardbody');
    cb.style.background = "orangered";
    if (score < Math.floor(currentWord.gradeLevel / 2)) {
      setScore(0)
    } else {
      setScore(score => score - Math.floor(currentWord.gradeLevel / 2))
    }
    setTimeout(()=>{
      cb.style.background = 'initial';
      e.target.spelling.value = '';
      getRandom();
    }, 2000)
  }

  function rightAnswer(e) {
    let cb = document.getElementById('cardbody');
    cb.style.background = "lime";
    setScore(score => score + Math.floor(currentWord.gradeLevel / 2))
    setCorrectWords([...correctWords, currentWord.word])
    setTimeout(()=>{
      cb.style.background = 'initial';
      e.target.spelling.value = '';
      getRandom();
    }, 2000)
  }

  function checkSpelling(e) {
    synth.cancel();
    e.preventDefault();
    if (e.target.spelling.value.toLowerCase() === currentWord.word.toLowerCase()) {
      rightAnswer(e)
    } else {
      wrongAnswer(e)
    }
  }

  return (
      <article className="card p-4 text-center shadow-lg container-lg" id='cardbody'>
        
          <section className="row mb-4">
            <h1 className='cart-title'>Spell the Word</h1>
            <h3>Score: {score}</h3>
          </section>
          <section className="row">
            <div className="col-8 d-flex ">
              <form className='m-auto' onSubmit={checkSpelling}>
                <label className='form-label' htmlFor='spelling'>{Math.floor(currentWord.gradeLevel / 2)} point word</label>
                <input type="text" className='form-control' name='spelling' id='spelling'/>
                <button className='btn btn-outline-primary mt-2' type='submit'>Check</button>
              </form>
            </div>
            <div className="col d-grid">
              <button onClick={()=>{pronounce(currentWord.word)}} className='btn btn-secondary my-1'>Repeat Word</button>
              <button onClick={()=>{pronounce(currentWord.definition)}} className='btn btn-secondary my-1'>Definition</button>
              <button onClick={()=>{pronounce(currentWord.part_of_speech)}} className='btn btn-secondary my-1'>Part of Speech</button>
              <button onClick={()=>{pronounce(currentWord.etymology)}} className='btn btn-secondary my-1'>Etymology</button>
              <button onClick={()=>{pronounce(currentWord.example_sentence)}} className='btn btn-secondary my-1'>Use in a Sentence</button>
            </div>
          </section>
          <section className="row mt-4">
            <button className='btn btn-primary col-4 mx-auto' onClick={getRandom}>New Word</button>
          </section>
      </article>
  )
}