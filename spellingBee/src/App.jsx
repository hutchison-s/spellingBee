import { useState } from 'react'
import Spelling from './components/Spelling';
import Definitions from './components/Definitions';
import './App.css'

function App() {
  const [currentApp, setCurrentApp] = useState('Spelling')
  const auth = 'Basic c3BlbGxpbmdiZWU6Y2hhbXBpb24xMDAh';
  
  function returnApp(choice) {
    switch (choice) {
      case 'Spelling':
        return <Spelling auth={auth}/>;
      case 'Definitions':
        return <Definitions auth={auth}/>
    }
  }

  return (
    <>
      <header>
        <div className="logoContainer">
          <img className='logoIcon' src="./src/assets/bee-honey-icon.svg" alt="Beeyond" />
          <h1 className="title">
            <span className="logoFont">Beeyond</span>
          </h1>
          <select name="appChoice" id="appChoice" className='appFont' defaultValue='Spelling' onInput={(e)=>{setCurrentApp(e.target.value)}}>
          <option value="Spelling">Spelling</option>
          <option value="Definitions">Definitions</option>
        </select>
        </div>
      </header>
      {returnApp(currentApp)}
      <footer>
        <nav>
          <div><a href="#"><i className="bi bi-person-circle"></i></a></div>
          <div><a href="##"><i className="bi bi-bar-chart-line-fill"></i></a></div>
          <div><a href="###"><i className="bi bi-info-circle"></i></a></div>
        </nav>
      </footer>
    </>
  )
}

export default App
