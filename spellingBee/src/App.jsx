import { useState } from 'react'
import Spelling from './components/Spelling';
import Definitions from './components/Definitions';

function App() {
  const [currentApp, setCurrentApp] = useState('Spelling')
  
  function returnApp(choice) {
    switch (choice) {
      case 'Spelling':
        return <Spelling />;
      case 'Definitions':
        return <Definitions />
    }
  }

  return (
    <>
      <header>
        <select name="appChoice" id="appchoice" defaultValue='Spelling' onInput={(e)=>{setCurrentApp(e.target.value)}}>
          <option value="Spelling">Spelling</option>
          <option value="Definitions">Definitions</option>
        </select>
      </header>
      {returnApp(currentApp)}
    </>
  )
}

export default App
