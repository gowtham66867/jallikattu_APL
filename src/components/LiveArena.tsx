'use client'

import { useState, useEffect } from 'react'
import { Round } from '@/lib/gameData'

interface LiveArenaProps {
  round: Round
  isSimulating: boolean
  onStartRound: () => void
}

export default function LiveArena({ round, isSimulating, onStartRound }: LiveArenaProps) {
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (!isSimulating) {
      setTimer(0)
      return
    }
    const interval = setInterval(() => {
      setTimer(prev => prev + 0.1)
    }, 100)
    return () => clearInterval(interval)
  }, [isSimulating])

  if (!round) return null

  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      {/* Background Arena Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-temple/20 via-transparent to-saffron/10 pointer-events-none" />

      {/* Round Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-saffron/20 text-saffron px-2 py-1 rounded-full">
            Round {round.id}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            round.status === 'active' ? 'bg-green-500/20 text-green-400' :
            round.status === 'completed' ? 'bg-white/10 text-white/50' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {round.status === 'active' ? '⚡ ACTIVE' : round.status === 'completed' ? '✓ Done' : '⏳ Next'}
          </span>
        </div>
        {isSimulating && (
          <div className="text-lg font-mono font-bold text-pongal animate-pulse-fast">
            {timer.toFixed(1)}s
          </div>
        )}
      </div>

      {/* Bull vs Tamer Face-off */}
      <div className="relative flex items-center justify-between gap-4 mb-4">
        {/* Bull Card */}
        <div className={`flex-1 bg-red-900/30 rounded-xl p-3 border border-red-500/20 ${isSimulating ? 'animate-shake' : ''}`}>
          <div className="text-2xl mb-1">🐂</div>
          <h3 className="font-bold text-sm text-red-300">{round.bull.name}</h3>
          <p className="text-xs text-white/50">{round.bull.breed} • {round.bull.weight}kg</p>
          <div className="flex gap-2 mt-2">
            <div className="text-xs">
              <span className="text-white/40">AGR</span>
              <div className="flex gap-0.5 mt-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-1.5 h-3 rounded-sm ${i < round.bull.aggression ? 'bg-red-500' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
            <div className="text-xs">
              <span className="text-white/40">SPD</span>
              <div className="flex gap-0.5 mt-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-1.5 h-3 rounded-sm ${i < round.bull.speed ? 'bg-yellow-500' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-white/40 mt-1">🏆 {round.bull.pastWins} wins • {round.bull.village}</p>
        </div>

        {/* VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className={`w-10 h-10 rounded-full bg-arena border-2 border-saffron flex items-center justify-center text-xs font-bold text-saffron ${isSimulating ? 'glow-saffron animate-pulse' : ''}`}>
            VS
          </div>
        </div>

        {/* Tamer Card */}
        <div className="flex-1 bg-blue-900/30 rounded-xl p-3 border border-blue-500/20">
          <div className="text-2xl mb-1">🧑‍🌾</div>
          <h3 className="font-bold text-sm text-blue-300">{round.tamer.name}</h3>
          <p className="text-xs text-white/50">{round.tamer.village} • {round.tamer.experience}yr exp</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-white/40">
              <span>Success Rate</span>
              <span>{round.tamer.successRate}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full mt-1">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${round.tamer.successRate}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-white/40 mt-1">📊 {round.tamer.wins}/{round.tamer.totalAttempts} attempts</p>
        </div>
      </div>

      {/* Action Button */}
      {round.status === 'active' && !isSimulating && !round.result && (
        <button
          onClick={onStartRound}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron to-temple text-white font-bold text-sm hover:opacity-90 transition-all glow-saffron active:scale-95"
        >
          🚪 Open Vaadi Vaasal — Start the Run!
        </button>
      )}

      {/* Simulation Running */}
      {isSimulating && (
        <div className="text-center py-3">
          <div className="text-sm text-white/70 animate-pulse">
            🐂💨 Bull charging through the arena...
          </div>
          <div className="flex justify-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-saffron rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Result Display */}
      {round.result && (
        <div className={`text-center py-3 rounded-xl mt-2 ${
          round.result === 'tamer_wins' ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'
        }`}>
          <div className="text-2xl mb-1">
            {round.result === 'tamer_wins' ? '🏆' : '🐂'}
          </div>
          <div className={`font-bold ${round.result === 'tamer_wins' ? 'text-green-400' : 'text-red-400'}`}>
            {round.result === 'tamer_wins' ? `${round.tamer.name} Conquered!` : `${round.bull.name} Breaks Free!`}
          </div>
          <div className="text-xs text-white/50 mt-1">
            Hold: {round.holdDuration?.toFixed(1)}s • Distance: {round.distance?.toFixed(1)}m
          </div>
        </div>
      )}
    </div>
  )
}
