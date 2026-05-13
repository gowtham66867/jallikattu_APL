import { UserProfile, AgentMessage } from './types'

const STORAGE_KEYS = {
  USER_PROFILE: 'jallikattu_user_profile',
  AGENT_MEMORY: 'jallikattu_agent_memory',
  SESSION_STATS: 'jallikattu_session_stats',
  AGENT_FEEDBACK: 'jallikattu_agent_feedback',
}

export interface SessionStats {
  totalSessions: number
  totalRoundsWatched: number
  totalPredictions: number
  totalCorrectPredictions: number
  totalCheers: number
  totalTriviaCorrect: number
  totalTriviaAnswered: number
  lastSessionDate: string
  highScore: number
  streakBest: number
  streakCurrent: number
  favoriteAgent: string | null
}

export interface AgentFeedback {
  agentId: string
  rating: 'helpful' | 'not_helpful'
  timestamp: number
}

const defaultProfile: UserProfile = {
  predictionsCorrect: 0,
  predictionsTotal: 0,
  preferredLanguage: 'mixed',
  engagementLevel: 'medium',
  culturalKnowledge: 'beginner',
  cheerCount: 0,
  roundsWatched: 0,
  favoriteOutcome: 'neutral',
}

const defaultStats: SessionStats = {
  totalSessions: 0,
  totalRoundsWatched: 0,
  totalPredictions: 0,
  totalCorrectPredictions: 0,
  totalCheers: 0,
  totalTriviaCorrect: 0,
  totalTriviaAnswered: 0,
  lastSessionDate: '',
  highScore: 0,
  streakBest: 0,
  streakCurrent: 0,
  favoriteAgent: null,
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

export const PersistentMemory = {
  // User Profile
  loadProfile(): UserProfile {
    return safeGet(STORAGE_KEYS.USER_PROFILE, defaultProfile)
  },

  saveProfile(profile: UserProfile): void {
    safeSet(STORAGE_KEYS.USER_PROFILE, profile)
  },

  // Agent Memory (last N messages across sessions)
  loadAgentMemory(): AgentMessage[] {
    return safeGet(STORAGE_KEYS.AGENT_MEMORY, [])
  },

  saveAgentMemory(messages: AgentMessage[]): void {
    // Keep last 50 messages max
    const trimmed = messages.slice(-50)
    safeSet(STORAGE_KEYS.AGENT_MEMORY, trimmed)
  },

  // Session Stats
  loadSessionStats(): SessionStats {
    return safeGet(STORAGE_KEYS.SESSION_STATS, defaultStats)
  },

  saveSessionStats(stats: SessionStats): void {
    safeSet(STORAGE_KEYS.SESSION_STATS, stats)
  },

  startNewSession(): SessionStats {
    const stats = this.loadSessionStats()
    stats.totalSessions += 1
    stats.lastSessionDate = new Date().toISOString()
    this.saveSessionStats(stats)
    return stats
  },

  recordPrediction(correct: boolean): void {
    const stats = this.loadSessionStats()
    stats.totalPredictions += 1
    if (correct) {
      stats.totalCorrectPredictions += 1
      stats.streakCurrent += 1
      stats.streakBest = Math.max(stats.streakBest, stats.streakCurrent)
    } else {
      stats.streakCurrent = 0
    }
    this.saveSessionStats(stats)
  },

  recordCheer(): void {
    const stats = this.loadSessionStats()
    stats.totalCheers += 1
    this.saveSessionStats(stats)
  },

  recordTrivia(correct: boolean): void {
    const stats = this.loadSessionStats()
    stats.totalTriviaAnswered += 1
    if (correct) stats.totalTriviaCorrect += 1
    this.saveSessionStats(stats)
  },

  recordRound(): void {
    const stats = this.loadSessionStats()
    stats.totalRoundsWatched += 1
    this.saveSessionStats(stats)
  },

  updateHighScore(score: number): void {
    const stats = this.loadSessionStats()
    stats.highScore = Math.max(stats.highScore, score)
    this.saveSessionStats(stats)
  },

  // Agent Feedback
  loadFeedback(): AgentFeedback[] {
    return safeGet(STORAGE_KEYS.AGENT_FEEDBACK, [])
  },

  saveFeedback(feedback: AgentFeedback): void {
    const existing = this.loadFeedback()
    existing.push(feedback)
    // Keep last 100 feedback entries
    safeSet(STORAGE_KEYS.AGENT_FEEDBACK, existing.slice(-100))
  },

  // Clear all
  clearAll(): void {
    if (typeof window === 'undefined') return
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  },
}
