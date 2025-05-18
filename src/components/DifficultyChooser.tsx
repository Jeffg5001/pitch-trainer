const difficulties = ['Easy', 'Medium', 'Hard']

type Difficulty = typeof difficulties[number]

type DifficultyChooserProps = {
    handleDifficultyClick: (difficulty: Difficulty) => void
}

function DifficultyChooser({ handleDifficultyClick }: DifficultyChooserProps) {
    return (
    <div>
        {difficulties.map((difficulty) => (
        <button onClick={() => handleDifficultyClick(difficulty)}>
            {difficulty}
        </button>))}
    </div>)
}

export default DifficultyChooser