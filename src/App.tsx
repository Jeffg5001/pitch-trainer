import { useState } from 'react'
import button_test from './pitch_proto.tsx'
import './App.css'
import DifficultyChooser, { type Difficulty } from './components/DifficultyChooser'

type PageKey = 'set-difficulty-page'

type Page = {
  title: string 
}

const modeTitles: Record<Difficulty, string> = {
  easy: 'guess the octive, 1-7',
  medium: 'guess the note to the nearest half octive',
  hard: 'guess the note to the nearest semitone'
}



function App() {
  const [currentPage, setCurrentPage] = useState('set-difficulty-page')
  const [difficulty, setDifficulty] = useState('easy');

  const pages: Record<PageKey, Page> = {
    'set-difficulty-page': {
      title: 'Choose your difficulty:'
    },
    'game': {
      title: modeTitles[difficulty]
    }
  }
  
  const getCurrentPage = (currentPage: string) => {
    switch (currentPage) {
      case 'set-difficulty-page':
        return <DifficultyChooser handleDifficultyClick={setDifficulty} />
    
      case 'game':
        return <Game />
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
      </div>
    </>
  )
}

export default App
