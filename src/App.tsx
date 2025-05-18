import { useState } from 'react'
import button_test from './pitch_proto.tsx'
import './App.css'
import DifficultyChooser from './components/DifficultyChooser'

type PageKey = 'set-difficulty-page'

type Page = {
  title: string 
}

const pages: Record<PageKey, Page> = {
  'set-difficulty-page': {
    title: 'Choose your difficulty:'
  },
  'game': {
    title: 'Pitch Trainer'
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('set-difficulty-page')
  const [difficulty, setDifficulty] = useState('easy');
  
  const getCurrentPage = (currentPage: string) => {
    switch (currentPage) {
      case 'set-difficulty-page':
        return <DifficultyChooser handleDifficultyClick={setDifficulty} />
    
      default:
        break;
    }
  } 

  return (
    <>
      <h1>{pages[currentPage].title}</h1>
      <div className="card">
        {getCurrentPage(currentPage)}
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}
        {button_test()}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
