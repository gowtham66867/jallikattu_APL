'use client'

import { Round } from '@/lib/gameData'

interface PredictionPanelProps {
  round: Round
  roundIndex: number
  prediction?: string
  onPredict: (roundId: number, prediction: string) => void
  isSimulating: boolean
}

export default function PredictionPanel({ round, roundIndex, prediction, onPredict, isSimulating }: PredictionPanelProps) {
  if (!round || round.status === 'completed') return null

  // Calculate quick stats hint
  const bullPower = round.bull.aggression + round.bull.speed
  const tamerChance = round.tamer.successRate
  const bullFavored = bullPower > 14 || tamerChance < 40
  const tamerFavored = tamerChance >= 55 && bullPower < 16
  const hint = bullFavored
    ? `⚡ ${round.bull.name} (AGR ${round.bull.aggression} + SPD ${round.bull.speed}) looks dangerous!`
    : tamerFavored
    ? `💪 ${round.tamer.name} has a ${tamerChance}% success rate — strong odds!`
    : `⚖️ Close matchup — trust your instincts!`

  return (
    <div className="glass rounded-2xl p-4 border border-saffron/20">
      <h3 className="text-sm font-bold text-kolam mb-1">🔮 Predict the Outcome</h3>
      <p className="text-xs text-white/50 mb-1">
        Will the tamer hold the bull for 15 meters, or will the bull break free?
      </p>
      {!prediction && !isSimulating && (
        <p className="text-xs text-saffron/80 mb-3 bg-saffron/10 rounded-lg px-2 py-1">
          💡 {hint}
        </p>
      )}
      {(prediction || isSimulating) && <div className="mb-3" />}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onPredict(roundIndex, 'tamer_wins')}
          disabled={isSimulating || !!prediction}
          className={`p-3 rounded-xl border transition-all ${
            prediction === 'tamer_wins'
              ? 'border-green-500 bg-green-500/20 glow-saffron'
              : 'border-white/10 bg-white/5 hover:border-green-500/50 hover:bg-green-500/10'
          } ${isSimulating || prediction ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
        >
          <div className="text-xl mb-1">🧑‍🌾</div>
          <div className="text-xs font-bold text-green-300">Tamer Wins</div>
          <div className="text-xs text-white/40 mt-0.5">Holds the hump</div>
        </button>

        <button
          onClick={() => onPredict(roundIndex, 'bull_wins')}
          disabled={isSimulating || !!prediction}
          className={`p-3 rounded-xl border transition-all ${
            prediction === 'bull_wins'
              ? 'border-red-500 bg-red-500/20 glow-saffron'
              : 'border-white/10 bg-white/5 hover:border-red-500/50 hover:bg-red-500/10'
          } ${isSimulating || prediction ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
        >
          <div className="text-xl mb-1">🐂</div>
          <div className="text-xs font-bold text-red-300">Bull Breaks Free</div>
          <div className="text-xs text-white/40 mt-0.5">Charges away</div>
        </button>
      </div>

      {prediction && !isSimulating && !round.result && (
        <div className="mt-3 text-center text-xs text-pongal">
          ✅ Prediction locked! Start the round to see the result.
        </div>
      )}

      {prediction && round.result && (
        <div className={`mt-3 text-center text-sm font-bold ${
          prediction === round.result ? 'text-green-400' : 'text-red-400'
        }`}>
          {prediction === round.result ? '🎉 Correct! +100 pts' : '❌ Wrong prediction'}
        </div>
      )}
    </div>
  )
}
