'use client'

import { Round } from '@/lib/gameData'
import { SessionStats } from '@/lib/agents/persistentMemory'

interface GameOverProps {
  rounds: Round[]
  userScore: number
  predictions: Record<number, string>
  sessionStats?: SessionStats
  onReplay: () => void
}

export default function GameOver({ rounds, userScore, predictions, sessionStats, onReplay }: GameOverProps) {
  const correctPredictions = rounds.filter(
    (r, i) => r.status === 'completed' && r.result === predictions[i]
  ).length
  const totalCompleted = rounds.filter(r => r.status === 'completed').length
  const accuracy = totalCompleted > 0 ? Math.round((correctPredictions / totalCompleted) * 100) : 0

  const rank = userScore >= 900 ? 1 : userScore >= 750 ? 2 : userScore >= 600 ? 3 : userScore >= 400 ? 4 : 5

  const titles: Record<number, { title: string; emoji: string }> = {
    1: { title: 'Arena Champion', emoji: '👑' },
    2: { title: 'Bull Whisperer', emoji: '🐂' },
    3: { title: 'Rising Tamer', emoji: '💪' },
    4: { title: 'Arena Rookie', emoji: '🌱' },
    5: { title: 'Spectator', emoji: '👀' },
  }

  const { title, emoji } = titles[rank] || titles[5]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-6 max-w-md w-full space-y-5 text-center animate-pulse-once">
        {/* Title */}
        <div>
          <div className="text-5xl mb-2">{emoji}</div>
          <h2 className="text-2xl font-bold text-gradient">Event Complete!</h2>
          <p className="text-white/50 text-sm mt-1">Alanganallur Jallikattu 2025</p>
        </div>

        {/* Final Score */}
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider">Final Score</p>
          <p className="text-5xl font-bold text-pongal mt-1">{userScore}</p>
          <p className="text-saffron text-sm font-semibold mt-1">{title}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-bold text-white">{correctPredictions}/{totalCompleted}</p>
            <p className="text-xs text-white/40">Predictions</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-bold text-white">{accuracy}%</p>
            <p className="text-xs text-white/40">Accuracy</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-bold text-saffron">#{rank}</p>
            <p className="text-xs text-white/40">Rank</p>
          </div>
        </div>

        {/* Round Results */}
        <div className="space-y-1.5">
          {rounds.filter(r => r.status === 'completed').map((r, i) => {
            const predicted = predictions[i]
            const correct = predicted === r.result
            return (
              <div key={r.id} className="flex items-center justify-between text-xs bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white/60">R{r.id}: {r.bull.name} vs {r.tamer.name}</span>
                <div className="flex items-center gap-2">
                  <span className={r.result === 'tamer_wins' ? 'text-green-400' : 'text-red-400'}>
                    {r.result === 'tamer_wins' ? 'Tamer' : 'Bull'}
                  </span>
                  <span>{correct ? '✅' : predicted ? '❌' : '⏭️'}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lifetime Stats */}
        {sessionStats && sessionStats.totalSessions > 1 && (
          <div className="text-xs text-white/30 bg-white/5 rounded-lg p-2">
            🏆 Best: {sessionStats.highScore} pts | 🔥 Best Streak: {sessionStats.streakBest} | 📊 Sessions: {sessionStats.totalSessions}
          </div>
        )}

        {/* AI Agent Summary */}
        <div className="text-xs text-white/30 bg-saffron/5 border border-saffron/20 rounded-lg p-2">
          🤖 AI Agents analyzed {totalCompleted} rounds with {totalCompleted * 4} agent invocations across 4 phases
        </div>

        {/* Replay Button */}
        <button
          onClick={onReplay}
          className="w-full bg-saffron hover:bg-saffron/80 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 glow-saffron"
        >
          🐂 Play Again — New Matchups!
        </button>
      </div>
    </div>
  )
}
