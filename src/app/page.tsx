'use client'

import { useState, useEffect, useCallback } from 'react'
import { generateRounds, triviaQuestions, Round } from '@/lib/gameData'
import { AgentResponse } from '@/lib/agents/types'
import { PersistentMemory } from '@/lib/agents/persistentMemory'
import LiveArena from '@/components/LiveArena'
import PredictionPanel from '@/components/PredictionPanel'
import CrowdEnergy from '@/components/CrowdEnergy'
import Leaderboard from '@/components/Leaderboard'
import TriviaModal from '@/components/TriviaModal'
import CulturalStories from '@/components/CulturalStories'
import Header from '@/components/Header'
import AgentPanel from '@/components/AgentPanel'
import AgentArchitecture from '@/components/AgentArchitecture'

interface AgentState {
  commentary: AgentResponse | null
  prediction: (AgentResponse & { odds?: { tamerWins: number; bullWins: number; reasoning: string[] } }) | null
  sentiment: AgentResponse | null
  personalization: AgentResponse | null
}

export default function Home() {
  const [rounds, setRounds] = useState<Round[]>([])
  const [currentRound, setCurrentRound] = useState(0)
  const [userScore, setUserScore] = useState(0)
  const [predictions, setPredictions] = useState<Record<number, string>>({})
  const [showTrivia, setShowTrivia] = useState(false)
  const [triviaIndex, setTriviaIndex] = useState(0)
  const [crowdEnergy, setCrowdEnergy] = useState(60)
  const [isSimulating, setIsSimulating] = useState(false)
  const [tab, setTab] = useState<'arena' | 'culture' | 'leaderboard'>('arena')

  // AI Agent State
  const [agentState, setAgentState] = useState<AgentState>({
    commentary: null,
    prediction: null,
    sentiment: null,
    personalization: null,
  })
  const [orchestratorDecision, setOrchestratorDecision] = useState('')
  const [agentLoading, setAgentLoading] = useState(false)
  const [hasAI, setHasAI] = useState(false)
  const [sessionStats, setSessionStats] = useState(PersistentMemory.loadSessionStats())

  useEffect(() => {
    setRounds(generateRounds())
    // Start new session and load persisted data
    const stats = PersistentMemory.startNewSession()
    setSessionStats(stats)
    // Load persisted high score as starting score bonus indicator
    if (stats.highScore > 0) {
      console.log(`Returning player! High score: ${stats.highScore}, Sessions: ${stats.totalSessions}`)
    }
  }, [])

  // Call agents when round changes or phase changes
  const callAgents = useCallback(async (phase: string, extraContext?: Record<string, unknown>) => {
    if (rounds.length === 0) return
    const round = rounds[currentRound]
    if (!round) return

    setAgentLoading(true)
    try {
      const res = await fetch('/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          context: {
            bullName: round.bull.name,
            bullStats: {
              aggression: round.bull.aggression,
              speed: round.bull.speed,
              breed: round.bull.breed,
              pastWins: round.bull.pastWins,
            },
            tamerName: round.tamer.name,
            tamerStats: {
              experience: round.tamer.experience,
              successRate: round.tamer.successRate,
              village: round.tamer.village,
            },
            crowdEnergy,
            userPrediction: predictions[currentRound] || null,
            roundResult: round.result || null,
            holdDuration: round.holdDuration || null,
            distance: round.distance || null,
            totalRounds: rounds.length,
            completedRounds: rounds.filter(r => r.status === 'completed').length,
            userScore,
            ...extraContext,
          },
        }),
      })

      const data = await res.json()
      if (data.success) {
        setAgentState({
          commentary: data.agents.commentary,
          prediction: data.agents.prediction,
          sentiment: data.agents.sentiment,
          personalization: data.agents.personalization,
        })
        setOrchestratorDecision(data.agents.orchestratorDecision)
        if (data.hasAI !== undefined) setHasAI(data.hasAI)
      }
    } catch (err) {
      console.error('Agent call failed:', err)
    }
    setAgentLoading(false)
  }, [rounds, currentRound, crowdEnergy, predictions, userScore])

  // Trigger agents on round load
  useEffect(() => {
    if (rounds.length > 0 && rounds[currentRound]) {
      callAgents('pre_run')
    }
  }, [currentRound, rounds.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const simulateRound = useCallback(() => {
    if (isSimulating || rounds.length === 0) return
    setIsSimulating(true)

    const round = rounds[currentRound]
    if (!round) return

    // Call agents for during_run phase
    callAgents('during_run')

    // Simulate bull run over 3 seconds
    const tamerWinChance = round.tamer.successRate / 100

    setTimeout(() => {
      const outcome = Math.random()
      const result = outcome < tamerWinChance ? 'tamer_wins' : 'bull_wins'
      const holdDuration = result === 'tamer_wins'
        ? 8 + Math.random() * 12
        : 1 + Math.random() * 5
      const distance = result === 'tamer_wins'
        ? 15 + Math.random() * 10
        : 2 + Math.random() * 8

      setRounds(prev => prev.map((r, i) =>
        i === currentRound
          ? { ...r, status: 'completed' as const, result, holdDuration, distance }
          : i === currentRound + 1
            ? { ...r, status: 'active' as const }
            : r
      ))

      // Score prediction
      const userPrediction = predictions[currentRound]
      const isCorrect = userPrediction === result
      if (isCorrect) {
        setUserScore(prev => prev + 100)
        setCrowdEnergy(prev => Math.min(100, prev + 15))
      }
      PersistentMemory.recordPrediction(isCorrect)
      PersistentMemory.recordRound()

      setCrowdEnergy(prev => {
        const excitement = result === 'tamer_wins' ? 20 : 10
        return Math.min(100, prev + excitement)
      })

      setIsSimulating(false)

      // Call agents for post_run phase
      callAgents('post_run', { roundResult: result, holdDuration, distance })

      // Record round complete for personalization agent
      fetch('/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: 'post_run', action: { type: 'round_complete' } }),
      })

      // Show trivia between rounds
      if (currentRound < rounds.length - 1) {
        setTimeout(() => {
          setShowTrivia(true)
          setTriviaIndex(prev => (prev + 1) % triviaQuestions.length)
        }, 2500)
      }
    }, 3000)
  }, [currentRound, isSimulating, predictions, rounds, callAgents])

  const handlePrediction = (roundId: number, prediction: string) => {
    setPredictions(prev => ({ ...prev, [roundId]: prediction }))
    // Notify agents of prediction
    fetch('/api/agents/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase: 'pre_run', action: { type: 'prediction', data: prediction } }),
    })
  }

  const handleNextRound = () => {
    setCurrentRound(prev => prev + 1)
    setShowTrivia(false)
  }

  const handleTriviaAnswer = (correct: boolean) => {
    if (correct) {
      setUserScore(prev => prev + 50)
      setCrowdEnergy(prev => Math.min(100, prev + 5))
    }
    PersistentMemory.recordTrivia(correct)
    // Notify agents of trivia result
    fetch('/api/agents/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase: 'between_rounds', action: { type: 'trivia', data: correct } }),
    })
    setShowTrivia(false)
    handleNextRound()
  }

  const handleCheer = () => {
    setCrowdEnergy(prev => Math.min(100, prev + 3))
    PersistentMemory.recordCheer()
    // Notify agents of cheer
    fetch('/api/agents/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase: 'during_run', action: { type: 'cheer' } }),
    })
  }

  const handleAgentFeedback = (agentId: string, rating: 'helpful' | 'not_helpful') => {
    PersistentMemory.saveFeedback({ agentId, rating, timestamp: Date.now() })
  }

  // Persist high score on change
  useEffect(() => {
    PersistentMemory.updateHighScore(userScore)
  }, [userScore])

  if (rounds.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-saffron animate-pulse">Loading Jallikattu Arena...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pb-20">
      <Header score={userScore} crowdEnergy={crowdEnergy} />

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 px-4 py-3 sticky top-0 z-40 bg-arena/80 backdrop-blur-md border-b border-white/10">
        {(['arena', 'culture', 'leaderboard'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              tab === t
                ? 'bg-saffron text-white glow-saffron'
                : 'glass text-white/70 hover:text-white'
            }`}
          >
            {t === 'arena' ? '🐂 Arena' : t === 'culture' ? '🏛️ Culture' : '🏆 Rankings'}
          </button>
        ))}
      </div>

      {tab === 'arena' && (
        <div className="max-w-lg mx-auto px-4 space-y-4 mt-4">
          {/* AI Agent Panel - THE KEY DIFFERENTIATOR */}
          <AgentPanel
            agents={agentState}
            orchestratorDecision={orchestratorDecision}
            isLoading={agentLoading}
            onAgentFeedback={handleAgentFeedback}
          />

          {/* Architecture Visualizer */}
          <AgentArchitecture
            activePhase={orchestratorDecision.split('Phase: ')[1]?.split(' |')[0] || ''}
            hasAI={hasAI}
          />

          <LiveArena
            round={rounds[currentRound]}
            isSimulating={isSimulating}
            onStartRound={simulateRound}
          />

          <PredictionPanel
            round={rounds[currentRound]}
            roundIndex={currentRound}
            prediction={predictions[currentRound]}
            onPredict={handlePrediction}
            isSimulating={isSimulating}
          />

          <CrowdEnergy
            energy={crowdEnergy}
            onCheer={handleCheer}
            isSimulating={isSimulating}
          />

          {/* Completed Rounds Summary */}
          {rounds.filter(r => r.status === 'completed').length > 0 && (
            <div className="glass rounded-2xl p-4">
              <h3 className="text-sm font-bold text-kolam mb-3">Completed Rounds</h3>
              <div className="space-y-2">
                {rounds.filter(r => r.status === 'completed').map(r => (
                  <div key={r.id} className="flex items-center justify-between text-xs bg-white/5 rounded-lg p-2">
                    <span className="font-medium">{r.bull.name} vs {r.tamer.name}</span>
                    <span className={r.result === 'tamer_wins' ? 'text-green-400' : 'text-red-400'}>
                      {r.result === 'tamer_wins' ? '🏆 Tamer Won' : '🐂 Bull Won'}
                    </span>
                    <span className="text-white/50">
                      {r.holdDuration?.toFixed(1)}s / {r.distance?.toFixed(1)}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'culture' && <CulturalStories />}
      {tab === 'leaderboard' && <Leaderboard userScore={userScore} sessionStats={sessionStats} />}

      {showTrivia && (
        <TriviaModal
          question={triviaQuestions[triviaIndex]}
          onAnswer={handleTriviaAnswer}
        />
      )}
    </main>
  )
}
