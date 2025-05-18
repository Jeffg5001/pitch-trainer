import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
type Difficulty = 'octave' | 'half-octave' | 'semitone';

interface NoteOption {
  value: number;
  label: string;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const noteNames: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const midiToFrequency = (midi: number): number => {
  return 440 * Math.pow(2, (midi - 69) / 12);
};

const midiToNoteName = (midi: number): string => {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return noteNames[noteIndex] + octave;
};

const generateOptionsForDifficulty = (currentMidi: number, difficulty: Difficulty): NoteOption[] => {
  const options = new Set<number>();
  const noteIndex = currentMidi % 12;
  
  switch(difficulty) {
    case 'octave':
      for (let midi = 22; midi <= 120; midi++) {
        if (midi % 12 === noteIndex) {
          options.add(midi);
        }
      }
      break;
      
    case 'half-octave':
      for (let midi = 22; midi <= 120; midi++) {
        if ((midi - currentMidi) % 6 === 0) {
          options.add(midi);
        }
      }
      options.add(currentMidi);
      break;
      
    case 'semitone':
      for (let midi = 22; midi <= 120; midi++) {
        options.add(midi);
      }
      break;
  }
  
  return Array.from(options)
    .sort((a, b) => a - b)
    .map(midi => ({
      value: midi,
      label: midiToNoteName(midi)
    }));
};

const App: React.FC = () => {
  const [currentMidi, setCurrentMidi] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<string>('');
  const [totalGuesses, setTotalGuesses] = useState<number>(0);
  const [correctGuesses, setCorrectGuesses] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('semitone');
  const [options, setOptions] = useState<NoteOption[]>([]);

  const generateNewNote = (): void => {
    const newMidi = Math.floor(Math.random() * (120 - 22 + 1)) + 22;
    console.log('note:', midiToNoteName(newMidi))
    setCurrentMidi(newMidi);
    setSelectedNote('');
    setShowResult(false);
    setOptions(generateOptionsForDifficulty(newMidi, difficulty));
  };

  const memoizedGenerateNewNote = useCallback(generateNewNote, [difficulty])
  
  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
    memoizedGenerateNewNote()
  }, [memoizedGenerateNewNote]);

  useEffect(() => {
    if (currentMidi !== null) {
      setOptions(generateOptionsForDifficulty(currentMidi, difficulty));
    }
  }, [difficulty, currentMidi]);

  const playNote = (): void => {
    if (!audioContext || currentMidi === null) return;

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

  const handleGuess = (): void => {
    if (!selectedNote || currentMidi === null) return;

    setTotalGuesses(prev => prev + 1);
    if (parseInt(selectedNote) === currentMidi) {
      setCorrectGuesses(prev => prev + 1);
    }
    setShowResult(true);
  };

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setDifficulty(event.target.value as Difficulty);
  };

  const handleNoteSelection = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedNote(event.target.value);
  };

  const accuracy = totalGuesses > 0 ? (correctGuesses / totalGuesses * 100).toFixed(1) : '0';

  return (
    <div className="App">
      <h1>Perfect Pitch Trainer</h1>
      
      <div className="difficulty-selector">
        <label>Difficulty: </label>
        <select 
          value={difficulty} 
          onChange={handleDifficultyChange}
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
          onChange={handleNoteSelection}
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

        {showResult && currentMidi !== null && selectedNote && (
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
};

export default App;