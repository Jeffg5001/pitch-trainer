import React, { useState, useEffect } from 'react';
import './App.css';

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return noteNames[noteIndex] + octave;
}

function generateOptionsForDifficulty(currentMidi, difficulty) {
  const options = new Set();
  const noteIndex = currentMidi % 12;
  
  switch(difficulty) {
    case 'octave':
      // Add all notes of the same pitch class in different octaves
      for (let midi = 22; midi <= 120; midi++) {
        if (midi % 12 === noteIndex) {
          options.add(midi);
        }
      }
      break;
      
    case 'half-octave':
      // Add notes in steps of 6 semitones
      for (let midi = 22; midi <= 120; midi++) {
        if ((midi - currentMidi) % 6 === 0) {
          options.add(midi);
        }
      }
      // Make sure current note is included
      options.add(currentMidi);
      break;
      
    case 'semitone':
      // Add all notes
      for (let midi = 22; midi <= 120; midi++) {
        options.add(midi);
      }
      break;
      
    default:
      break;
  }
  
  return Array.from(options).sort((a, b) => a - b).map(midi => ({
    value: midi,
    label: midiToNoteName(midi)
  }));
}

function App() {
  const [currentMidi, setCurrentMidi] = useState(null);
  const [selectedNote, setSelectedNote] = useState('');
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [difficulty, setDifficulty] = useState('semitone');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
    generateNewNote();
  }, []);

  const generateNewNote = () => {
    const newMidi = Math.floor(Math.random() * (120 - 22 + 1)) + 22;
    setCurrentMidi(newMidi);
    setSelectedNote('');
    setShowResult(false);
    setOptions(generateOptionsForDifficulty(newMidi, difficulty));
  };

  useEffect(() => {
    if (currentMidi) {
      setOptions(generateOptionsForDifficulty(currentMidi, difficulty));
    }
  }, [difficulty, currentMidi]);

  const playNote = () => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(midiToFrequency(currentMidi), audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  };

  const handleGuess = () => {
    if (!selectedNote) return;

    setTotalGuesses(prev => prev + 1);
    if (parseInt(selectedNote) === currentMidi) {
      setCorrectGuesses(prev => prev + 1);
    }
    setShowResult(true);
  };

  const accuracy = totalGuesses > 0 ? (correctGuesses / totalGuesses * 100).toFixed(1) : 0;

  return (
    <div className="App">
      <h1>Perfect Pitch Trainer</h1>
      
      <div className="difficulty-selector">
        <label>Difficulty: </label>
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="octave">Octave</option>
          <option value="half-octave">Half-octave</option>
          <option value="semitone">Semitone</option>
        </select>
      </div>

      <div className="game-container">
        <button onClick={playNote}>Play Note</button>

        <select 
          value={selectedNote} 
          onChange={(e) => setSelectedNote(e.target.value)}
          disabled={showResult}
        >
          <option value="">Select a note</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button onClick={handleGuess} disabled={!selectedNote || showResult}>
          Submit Guess
        </button>

        {showResult && (
          <div className="result">
            <p>Actual note: <span className="highlight">{midiToNoteName(currentMidi)}</span></p>
            <p>Your guess: <span className="highlight">{midiToNoteName(parseInt(selectedNote))}</span></p>
            <p className="accuracy">Accuracy: <span className="highlight">{accuracy}%</span></p>
            <button onClick={generateNewNote}>Next Note</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;