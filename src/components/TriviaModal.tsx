'use client'

import { useState } from 'react'

interface TriviaModalProps {
  question: {
    q: string
    options: string[]
    answer: number
  }
  onAnswer: (correct: boolean) => void
}

export default function TriviaModal({ question, onAnswer }: TriviaModalProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (index: number) => {
    if (revealed) return
    setSelected(index)
    setRevealed(true)
    setTimeout(() => {
      onAnswer(index === question.answer)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass rounded-2xl p-5 max-w-sm w-full animate-bounce-slow">
        <div className="text-center mb-4">
          <span className="text-xs font-bold bg-kolam/20 text-kolam px-3 py-1 rounded-full">
            🏛️ Culture Trivia
          </span>
          <p className="text-xs text-white/40 mt-2">+50 pts for correct answer!</p>
        </div>

        <h3 className="text-sm font-bold text-white mb-4 text-center">{question.q}</h3>

        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={revealed}
              className={`w-full p-3 rounded-xl text-sm text-left transition-all ${
                revealed && index === question.answer
                  ? 'bg-green-500/30 border border-green-500 text-green-300'
                  : revealed && index === selected && index !== question.answer
                    ? 'bg-red-500/30 border border-red-500 text-red-300'
                    : selected === index
                      ? 'bg-saffron/20 border border-saffron text-saffron'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:border-white/30'
              }`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>

        {revealed && (
          <div className={`mt-4 text-center text-sm font-bold ${
            selected === question.answer ? 'text-green-400' : 'text-red-400'
          }`}>
            {selected === question.answer ? '🎉 Correct! +50 pts' : '❌ Wrong answer!'}
          </div>
        )}
      </div>
    </div>
  )
}
