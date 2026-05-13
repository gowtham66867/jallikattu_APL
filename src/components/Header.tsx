'use client'

interface HeaderProps {
  score: number
  crowdEnergy: number
}

export default function Header({ score, crowdEnergy }: HeaderProps) {
  return (
    <header className="px-4 py-4 border-b border-white/10 bg-arena/90 backdrop-blur-md">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gradient">🐂 Jallikattu Live</h1>
            <p className="text-xs text-white/50 mt-0.5">Alanganallur Arena • Pongal 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-white/50">Your Score</div>
              <div className="text-lg font-bold text-pongal">{score}</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-right">
              <div className="text-xs text-white/50">Crowd</div>
              <div className={`text-lg font-bold ${crowdEnergy > 80 ? 'text-red-400 animate-pulse-fast' : crowdEnergy > 50 ? 'text-saffron' : 'text-white/70'}`}>
                {crowdEnergy}%
              </div>
            </div>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 mt-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-xs text-red-400 font-semibold">LIVE</span>
          <span className="text-xs text-white/40">• 24,500 fans watching</span>
        </div>
      </div>
    </header>
  )
}
