import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [words, setWords] = useState([])
  const [filter, setFilter] = useState('search')
  const synth = window.speechSynthesis;
  useEffect(()=>{
    axios.get('/api/words').then(response => {
      setWords(response.data)
    }).catch(err => {
      console.log("Error occured while calling server:", err)
    })
  }, [])

  useEffect(()=>{
    getAllWords()
  }, [filter])

  function pronounce (text) {
    synth.cancel();
    const msg = new SpeechSynthesisUtterance();
    msg.rate = 0.8;
    msg.pitch = 1.1;
    msg.text = text;
    msg.lang = 'en'
    synth.speak(msg);
  }

  function getAllWords() {
    axios.get('/api/words').then(response => {
      setWords(response.data)
    }).catch(err => {
      console.log("Error occured while calling server:", err)
    })
  }

  function handleSearch(e) {
    if (!e.target.value) {getAllWords(); return;}
    axios.get('/api/words/search/'+e.target.value).then(response => {
      setWords(response.data)
    }).catch (err => {
      console.log("Error occured while calling server:", err)
    })
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

  function handleFilterChange() {
    const filters = document.querySelectorAll('input[name="filter"]');
    for (let f of filters) {
      if (f.checked == true) {
        setFilter(f.value)
      }
    }
  }

  function handleLevelChange(e) {
    if (e.target.value == '') {return}
    axios.get('/api/words/bylevel/'+e.target.value).then(response => {
      setWords(response.data)
    }).catch(err => {
      console.log("Error occured while calling server:", err)
    })
  }

  const filterBar = {
    search: 
      <>
        <label htmlFor="search">Search for a word: </label>
        <input type="search" name='search' id='search' onInput={handleSearch}/>
        <button onClick={getAllWords}>Clear Search</button>
      </>,
    level:
      <>
        <select onInput={handleLevelChange}>
          <option value=""> </option>
          <option value={5}>5th</option>
          <option value={8}>8th</option>
          <option value={12}>12th</option>
        </select>
      </>
  }

  return (
    <>
      <h1>Words:</h1>
      <p>Filter by:</p>
      <div>
        <label htmlFor="filterBySearch">Search</label>
        <input type="radio" name="filter" id="filterBySearch" value='search' defaultChecked onInput={handleFilterChange}/>
        <label htmlFor="filterByLevel">Grade Level</label>
        <input type="radio" name="filter" id="filterByLevel" value='level' onInput={handleFilterChange}/>
      </div>
      {filterBar[filter]}
      {words.length != 0
        ? words.map(word => (
        <div key={word._id}>
          <h3><button onClick={()=>{pronounce(word.word)}}>Word: </button>{toTitleCase(word?.word)}</h3>
          <table>
            <tbody>
            <tr>
              <td><button onClick={()=>{pronounce(word.definition)}}>Definition:</button></td>
              <td>{word?.definition}</td>
            </tr>
            <tr>
              <td><button onClick={()=>{pronounce(word.part_of_speech)}}>Part of Speech:</button></td>
              <td>{word?.part_of_speech}</td>
            </tr>
            <tr>
              <td><button onClick={()=>{pronounce(word.etymology)}}>Etymology:</button></td>
              <td>{word?.etymology}</td>
            </tr>
            <tr>
              <td><button onClick={()=>{pronounce(word.example_sentence)}}>Example Sentence:</button></td>
              <td>{word?.example_sentence}</td>
            </tr>
            </tbody>
          </table>
        </div>
      ))
      : <p>I have no words</p>
    }
    </>
  )
}

export default App
