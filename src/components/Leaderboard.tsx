'use client'

import { SessionStats } from '@/lib/agents/persistentMemory'

interface LeaderboardProps {
  userScore: number
  sessionStats?: SessionStats
}

const fakeLeaderboard = [
  { name: 'TamilTiger_23', score: 850, avatar: '🦁' },
  { name: 'MaduraiKing', score: 720, avatar: '👑' },
  { name: 'BullWhisperer', score: 680, avatar: '🐂' },
  { name: 'PongalPride', score: 550, avatar: '🌾' },
  { name: 'NandiRider', score: 500, avatar: '⚡' },
  { name: 'VaadiVaasal', score: 450, avatar: '🚪' },
  { name: 'KangayamFan', score: 400, avatar: '🏆' },
  { name: 'ArenaMaster', score: 350, avatar: '🎯' },
]

export default function Leaderboard({ userScore, sessionStats }: LeaderboardProps) {
  const allPlayers = [
    ...fakeLeaderboard,
    { name: 'You', score: userScore, avatar: '⭐' }
  ].sort((a, b) => b.score - a.score)

  return (
    <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
      {/* Your Rank Card */}
      <div className="glass rounded-2xl p-4 glow-gold">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50">Your Rank</p>
            <p className="text-3xl font-bold text-pongal">
              #{allPlayers.findIndex(p => p.name === 'You') + 1}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50">Total Points</p>
            <p className="text-3xl font-bold text-white">{userScore}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-4 text-xs text-white/40">
          <span>🔮 {sessionStats?.totalPredictions || 0} Predictions</span>
          <span>📣 {sessionStats?.totalCheers || 0} Cheers</span>
          <span>🏛️ {sessionStats?.totalTriviaCorrect || 0}/{sessionStats?.totalTriviaAnswered || 0} Trivia</span>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="glass rounded-2xl p-4">
        <h3 className="text-sm font-bold text-kolam mb-3">🏆 Live Leaderboard</h3>
        <div className="space-y-2">
          {allPlayers.map((player, index) => (
            <div
              key={player.name}
              className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                player.name === 'You'
                  ? 'bg-saffron/20 border border-saffron/30'
                  : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold w-6 ${
                  index === 0 ? 'text-pongal' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-white/40'
                }`}>
                  {index + 1}
                </span>
                <span className="text-lg">{player.avatar}</span>
                <span className={`text-sm font-medium ${player.name === 'You' ? 'text-saffron' : 'text-white/80'}`}>
                  {player.name}
                </span>
              </div>
              <span className="text-sm font-bold text-white/70">{player.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Persistent Stats */}
      {sessionStats && sessionStats.totalSessions > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold text-kolam mb-3">📊 Lifetime Stats</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-white/40">Sessions</div>
              <div className="text-lg font-bold text-white">{sessionStats.totalSessions}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-white/40">High Score</div>
              <div className="text-lg font-bold text-pongal">{sessionStats.highScore}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-white/40">Rounds Watched</div>
              <div className="text-lg font-bold text-white">{sessionStats.totalRoundsWatched}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-white/40">Best Streak</div>
              <div className="text-lg font-bold text-saffron">🔥 {sessionStats.streakBest}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-white/40">Prediction Accuracy</div>
              <div className="text-lg font-bold text-white">
                {sessionStats.totalPredictions > 0
                  ? `${Math.round((sessionStats.totalCorrectPredictions / sessionStats.totalPredictions) * 100)}%`
                  : '—'}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-white/40">Total Cheers</div>
              <div className="text-lg font-bold text-white">📣 {sessionStats.totalCheers}</div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="glass rounded-2xl p-4">
        <h3 className="text-sm font-bold text-kolam mb-3">�️ Achievements</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '🔮', label: 'First Prediction', unlocked: userScore > 0 },
            { icon: '🎯', label: '3 Correct', unlocked: userScore >= 300 },
            { icon: '📣', label: 'Crowd Pleaser', unlocked: userScore >= 150 },
            { icon: '🏛️', label: 'Culture Buff', unlocked: userScore >= 200 },
            { icon: '🐂', label: 'Bull Whisperer', unlocked: userScore >= 500 },
            { icon: '👑', label: 'Arena King', unlocked: userScore >= 800 },
          ].map((ach) => (
            <div
              key={ach.label}
              className={`text-center p-2 rounded-xl ${
                ach.unlocked ? 'bg-pongal/10 border border-pongal/30' : 'bg-white/5 border border-white/5 opacity-40'
              }`}
            >
              <div className="text-xl">{ach.icon}</div>
              <div className="text-xs text-white/60 mt-1">{ach.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
