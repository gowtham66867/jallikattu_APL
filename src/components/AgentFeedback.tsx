'use client'

import { useState } from 'react'

interface AgentFeedbackProps {
  agentId: string
  agentName: string
  onFeedback: (agentId: string, rating: 'helpful' | 'not_helpful') => void
}

export default function AgentFeedback({ agentId, agentName, onFeedback }: AgentFeedbackProps) {
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState<'helpful' | 'not_helpful' | null>(null)

  const handleFeedback = (r: 'helpful' | 'not_helpful') => {
    setRating(r)
    setSubmitted(true)
    onFeedback(agentId, r)
    setTimeout(() => setSubmitted(false), 3000)
  }

  if (submitted) {
    return (
      <span className="text-xs text-green-400/60">
        {rating === 'helpful' ? '👍 Thanks!' : '👎 Noted!'}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-white/20 mr-1">Rate:</span>
      <button
        onClick={() => handleFeedback('helpful')}
        className="text-xs text-white/30 hover:text-green-400 transition-colors px-1"
        title={`${agentName} was helpful`}
      >
        👍
      </button>
      <button
        onClick={() => handleFeedback('not_helpful')}
        className="text-xs text-white/30 hover:text-red-400 transition-colors px-1"
        title={`${agentName} was not helpful`}
      >
        👎
      </button>
    </div>
  )
}
