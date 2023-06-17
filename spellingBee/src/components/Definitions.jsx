import axios from "axios";
import { useState, useEffect } from "react";

export default function Definitions() {
  const [currentWord, setCurrentWord] = useState('')
  const [score, setScore] = useState(0)
  const [options, setOptions] = useState([]);
  const synth = window.speechSynthesis;

  useEffect(()=>{
    getOptions()
  }, [])

  useEffect(()=>{
    pronounce(currentWord.word)
  }, [currentWord])

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
    console.log(options)
    let config = {headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Basic c3BlbGxpbmdiZWU6Y2hhbXBpb24xMDAh'}}
    const ops = [];
    for (let i=0; i<4; i++) {
      const res = await axios.get('/api/random', config)
      ops.push(res.data)
    }
    setOptions([...ops])
    setCurrentWord(ops[Math.floor(Math.random() * ops.length - 1)])
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
    let cb = document.getElementById('cardbody');
    cb.style.background = "orangered";
    if (score < Math.floor(currentWord.gradeLevel / 2)) {
      setScore(0)
    } else {
      setScore(score => score - Math.floor(currentWord.gradeLevel / 2))
    }
    setTimeout(()=>{
      cb.style.background = 'initial';
      getOptions();
    }, 2000)
  }

  function rightAnswer() {
    let cb = document.getElementById('cardbody');
    cb.style.background = "lime";
    setScore(score => score + Math.floor(currentWord.gradeLevel / 2))
    setTimeout(()=>{
      cb.style.background = 'initial';
      getOptions();
    }, 2000)
  }

  function checkAnswer(e) {
    e.preventDefault();
    if (e.target.innerHTML.toLowerCase() === currentWord.definition.toLowerCase()) {
      rightAnswer(e)
    } else {
      wrongAnswer(e)
    }
  }

  return (
      <article className="card p-4 text-center shadow-lg container-lg" id='cardbody'>
          <section className="row mb-4">
            <h1 className='cart-title'>Choose the Correct Definition</h1>
            <h3>Score: {score}</h3>
          </section>
          <h2>{currentWord && toTitleCase(currentWord.word)}</h2>
          <p><small>{currentWord && Math.floor(currentWord.gradeLevel / 2)} point word</small></p>
          {options.map((op, idx) => (
                <button className='btn btn-primary col-4 mx-auto my-10' onClick={checkAnswer} key={idx}>{op.definition}</button>
            ))
          }
          <section className="row mt-4">
            <button className='btn btn-danger col-2 mr-0' onClick={getOptions}>Skip</button>
          </section>
      </article>
  )
}