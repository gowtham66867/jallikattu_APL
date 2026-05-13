import { PersistentMemory, SessionStats } from '@/lib/agents/persistentMemory'

// Each test group uses clearAll + verify to ensure isolation
function resetStorage() {
  // Remove all keys by setting them to fresh defaults via clearAll
  PersistentMemory.clearAll()
  // Also wipe any stray keys
  try { localStorage.clear() } catch { /* noop */ }
}

describe('PersistentMemory', () => {
  beforeEach(() => {
    resetStorage()
  })

  describe('User Profile', () => {
    it('should return default profile when nothing is stored', () => {
      const profile = PersistentMemory.loadProfile()
      expect(profile.predictionsCorrect).toBe(0)
      expect(profile.predictionsTotal).toBe(0)
      expect(profile.preferredLanguage).toBe('mixed')
      expect(profile.engagementLevel).toBe('medium')
      expect(profile.culturalKnowledge).toBe('beginner')
      expect(profile.cheerCount).toBe(0)
      expect(profile.roundsWatched).toBe(0)
    })

    it('should save and load profile correctly', () => {
      const profile = PersistentMemory.loadProfile()
      profile.predictionsCorrect = 5
      profile.predictionsTotal = 10
      profile.cheerCount = 20
      PersistentMemory.saveProfile(profile)

      const loaded = PersistentMemory.loadProfile()
      expect(loaded.predictionsCorrect).toBe(5)
      expect(loaded.predictionsTotal).toBe(10)
      expect(loaded.cheerCount).toBe(20)
    })
  })

  describe('Session Stats', () => {
    it('should return default stats when nothing is stored', () => {
      const stats = PersistentMemory.loadSessionStats()
      expect(stats.totalSessions).toBe(0)
      expect(stats.totalRoundsWatched).toBe(0)
      expect(stats.totalPredictions).toBe(0)
      expect(stats.totalCorrectPredictions).toBe(0)
      expect(stats.totalCheers).toBe(0)
      expect(stats.highScore).toBe(0)
      expect(stats.streakBest).toBe(0)
      expect(stats.streakCurrent).toBe(0)
      expect(stats.favoriteAgent).toBeNull()
    })

    it('startNewSession should increment session count', () => {
      const stats1 = PersistentMemory.startNewSession()
      expect(stats1.totalSessions).toBe(1)
      expect(stats1.lastSessionDate).toBeTruthy()

      const stats2 = PersistentMemory.startNewSession()
      expect(stats2.totalSessions).toBe(2)
    })

    it('startNewSession should set lastSessionDate', () => {
      const before = new Date().toISOString()
      const stats = PersistentMemory.startNewSession()
      const after = new Date().toISOString()
      expect(stats.lastSessionDate >= before).toBe(true)
      expect(stats.lastSessionDate <= after).toBe(true)
    })
  })

  describe('Predictions', () => {
    it('recordPrediction(true) should increment correct count and streak', () => {
      PersistentMemory.startNewSession()
      PersistentMemory.recordPrediction(true)

      const stats = PersistentMemory.loadSessionStats()
      expect(stats.totalPredictions).toBe(1)
      expect(stats.totalCorrectPredictions).toBe(1)
      expect(stats.streakCurrent).toBe(1)
      expect(stats.streakBest).toBe(1)
    })

    it('recordPrediction(false) should reset current streak', () => {
      PersistentMemory.startNewSession()
      PersistentMemory.recordPrediction(true)
      PersistentMemory.recordPrediction(true)
      PersistentMemory.recordPrediction(false)

      const stats = PersistentMemory.loadSessionStats()
      expect(stats.totalPredictions).toBe(3)
      expect(stats.totalCorrectPredictions).toBe(2)
      expect(stats.streakCurrent).toBe(0)
      expect(stats.streakBest).toBe(2)
    })

    it('streak best should persist across wrong predictions', () => {
      PersistentMemory.startNewSession()
      // Streak of 3
      PersistentMemory.recordPrediction(true)
      PersistentMemory.recordPrediction(true)
      PersistentMemory.recordPrediction(true)
      PersistentMemory.recordPrediction(false)
      // Streak of 2
      PersistentMemory.recordPrediction(true)
      PersistentMemory.recordPrediction(true)

      const stats = PersistentMemory.loadSessionStats()
      expect(stats.streakBest).toBe(3) // not overridden by 2
      expect(stats.streakCurrent).toBe(2)
    })
  })

  describe('Cheers', () => {
    it('recordCheer should increment cheer count', () => {
      PersistentMemory.startNewSession()
      PersistentMemory.recordCheer()
      PersistentMemory.recordCheer()
      PersistentMemory.recordCheer()

      const stats = PersistentMemory.loadSessionStats()
      expect(stats.totalCheers).toBe(3)
    })
  })

  describe('Trivia', () => {
    it('recordTrivia(true) should increment both answered and correct', () => {
      PersistentMemory.startNewSession()
      PersistentMemory.recordTrivia(true)

      const stats = PersistentMemory.loadSessionStats()
      expect(stats.totalTriviaAnswered).toBe(1)
      expect(stats.totalTriviaCorrect).toBe(1)
    })

    it('recordTrivia(false) should increment only answered', () => {
      PersistentMemory.startNewSession()
      PersistentMemory.recordTrivia(false)

      const stats = PersistentMemory.loadSessionStats()
      expect(stats.totalTriviaAnswered).toBe(1)
      expect(stats.totalTriviaCorrect).toBe(0)
    })
  })

  describe('Rounds', () => {
    it('recordRound should increment rounds watched', () => {
      PersistentMemory.startNewSession()
      PersistentMemory.recordRound()
      PersistentMemory.recordRound()

      const stats = PersistentMemory.loadSessionStats()
      expect(stats.totalRoundsWatched).toBe(2)
    })
  })

  describe('High Score', () => {
    it('updateHighScore should save higher score', () => {
      PersistentMemory.startNewSession()
      PersistentMemory.updateHighScore(500)
      expect(PersistentMemory.loadSessionStats().highScore).toBe(500)

      PersistentMemory.updateHighScore(300) // lower — should NOT update
      expect(PersistentMemory.loadSessionStats().highScore).toBe(500)

      PersistentMemory.updateHighScore(800) // higher — should update
      expect(PersistentMemory.loadSessionStats().highScore).toBe(800)
    })
  })

  describe('Agent Feedback', () => {
    it('should save and load feedback', () => {
      PersistentMemory.saveFeedback({
        agentId: 'commentary',
        rating: 'helpful',
        timestamp: Date.now(),
      })

      const feedback = PersistentMemory.loadFeedback()
      expect(feedback).toHaveLength(1)
      expect(feedback[0].agentId).toBe('commentary')
      expect(feedback[0].rating).toBe('helpful')
    })

    it('should accumulate multiple feedback entries', () => {
      PersistentMemory.saveFeedback({ agentId: 'commentary', rating: 'helpful', timestamp: 1 })
      PersistentMemory.saveFeedback({ agentId: 'prediction', rating: 'not_helpful', timestamp: 2 })
      PersistentMemory.saveFeedback({ agentId: 'sentiment', rating: 'helpful', timestamp: 3 })

      const feedback = PersistentMemory.loadFeedback()
      expect(feedback).toHaveLength(3)
    })

    it('should cap feedback at 100 entries', () => {
      for (let i = 0; i < 110; i++) {
        PersistentMemory.saveFeedback({ agentId: `agent_${i}`, rating: 'helpful', timestamp: i })
      }
      const feedback = PersistentMemory.loadFeedback()
      expect(feedback.length).toBeLessThanOrEqual(100)
    })
  })

  describe('Agent Memory', () => {
    it('should save and load agent messages', () => {
      PersistentMemory.saveAgentMemory([
        { role: 'agent', content: 'test message', agentId: 'commentary', timestamp: Date.now() },
      ])
      const memory = PersistentMemory.loadAgentMemory()
      expect(memory).toHaveLength(1)
      expect(memory[0].content).toBe('test message')
    })

    it('should trim messages to last 50', () => {
      const messages = Array.from({ length: 60 }, (_, i) => ({
        role: 'agent' as const,
        content: `message_${i}`,
        agentId: 'test',
        timestamp: i,
      }))
      PersistentMemory.saveAgentMemory(messages)
      const memory = PersistentMemory.loadAgentMemory()
      expect(memory).toHaveLength(50)
      expect(memory[0].content).toBe('message_10') // first 10 trimmed
    })
  })

  describe('clearAll', () => {
    it('should remove session stats key from localStorage', () => {
      localStorage.setItem('jallikattu_session_stats', JSON.stringify({ totalSessions: 99 }))
      expect(localStorage.getItem('jallikattu_session_stats')).not.toBeNull()

      PersistentMemory.clearAll()

      expect(localStorage.getItem('jallikattu_session_stats')).toBeNull()
      expect(localStorage.getItem('jallikattu_agent_feedback')).toBeNull()
      expect(localStorage.getItem('jallikattu_agent_memory')).toBeNull()
      expect(localStorage.getItem('jallikattu_user_profile')).toBeNull()
    })

    it('should return defaults after clearing', () => {
      // Directly set known values
      localStorage.setItem('jallikattu_session_stats', JSON.stringify({
        totalSessions: 50, totalRoundsWatched: 100, totalPredictions: 20,
        totalCorrectPredictions: 10, totalCheers: 30, totalTriviaCorrect: 5,
        totalTriviaAnswered: 8, lastSessionDate: '', highScore: 999,
        streakBest: 5, streakCurrent: 2, favoriteAgent: null,
      }))
      localStorage.setItem('jallikattu_agent_feedback', JSON.stringify([{ agentId: 'x', rating: 'helpful', timestamp: 1 }]))

      PersistentMemory.clearAll()

      const stats = PersistentMemory.loadSessionStats()
      expect(stats.totalSessions).toBe(0)
      expect(stats.highScore).toBe(0)
      expect(PersistentMemory.loadFeedback()).toHaveLength(0)
      expect(PersistentMemory.loadAgentMemory()).toHaveLength(0)
    })
  })
})
