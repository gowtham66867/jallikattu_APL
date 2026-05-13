'use client'

import { useState } from 'react'

interface CrowdEnergyProps {
  energy: number
  onCheer: () => void
  isSimulating: boolean
}

export default function CrowdEnergy({ energy, onCheer, isSimulating }: CrowdEnergyProps) {
  const [cheerCount, setCheerCount] = useState(0)
  const [showCheerEffect, setShowCheerEffect] = useState(false)

  const handleCheer = () => {
    onCheer()
    setCheerCount(prev => prev + 1)
    setShowCheerEffect(true)
    setTimeout(() => setShowCheerEffect(false), 500)
  }

  const getEnergyLabel = () => {
    if (energy >= 90) return { text: 'ERUPTING!', color: 'text-red-400' }
    if (energy >= 70) return { text: 'Electric!', color: 'text-saffron' }
    if (energy >= 50) return { text: 'Building...', color: 'text-yellow-400' }
    return { text: 'Warming up', color: 'text-white/50' }
  }

  const label = getEnergyLabel()

  return (
    <div className="glass rounded-2xl p-4 relative overflow-hidden">
      {showCheerEffect && (
        <div className="absolute inset-0 bg-saffron/20 animate-pulse pointer-events-none rounded-2xl" />
      )}

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-kolam">📣 Crowd Energy</h3>
        <span className={`text-xs font-bold ${label.color}`}>{label.text}</span>
      </div>

      {/* Energy Bar */}
      <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            energy >= 90 ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse-fast' :
            energy >= 70 ? 'bg-gradient-to-r from-saffron to-yellow-500' :
            energy >= 50 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
            'bg-white/30'
          }`}
          style={{ width: `${energy}%` }}
        />
      </div>

      {/* Cheer Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCheer}
          disabled={!isSimulating}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            isSimulating
              ? 'bg-saffron/20 border border-saffron/40 text-saffron hover:bg-saffron/30'
              : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          👏 Cheer! ({cheerCount})
        </button>
        <button
          onClick={() => { handleCheer(); handleCheer(); }}
          disabled={!isSimulating}
          className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            isSimulating
              ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
              : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          🔥
        </button>
        <button
          onClick={handleCheer}
          disabled={!isSimulating}
          className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            isSimulating
              ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30'
              : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          🎺
        </button>
      </div>

      <p className="text-xs text-white/30 text-center mt-2">
        {isSimulating ? 'Tap to cheer during the run!' : 'Cheering available during active runs'}
      </p>
    </div>
  )
}
