export interface AgentMessage {
  role: 'system' | 'agent' | 'user' | 'tool'
  content: string
  agentId?: string
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface AgentMemory {
  shortTerm: AgentMessage[]
  longTerm: Record<string, unknown>
  userProfile: UserProfile
}

export interface UserProfile {
  predictionsCorrect: number
  predictionsTotal: number
  preferredLanguage: 'en' | 'ta' | 'mixed'
  engagementLevel: 'low' | 'medium' | 'high'
  culturalKnowledge: 'beginner' | 'intermediate' | 'expert'
  cheerCount: number
  roundsWatched: number
  favoriteOutcome: 'tamer_wins' | 'bull_wins' | 'neutral'
}

export interface AgentTool {
  name: string
  description: string
  parameters: Record<string, { type: string; description: string }>
  execute: (params: Record<string, unknown>) => Promise<unknown>
}

export interface AgentConfig {
  id: string
  name: string
  role: string
  systemPrompt: string
  tools: AgentTool[]
  temperature: number
  maxTokens: number
}

export interface AgentResponse {
  agentId: string
  thought: string // Chain-of-thought reasoning (visible to user)
  action: string // What the agent decided to do
  output: string // The final output for the user
  toolCalls?: { tool: string; params: Record<string, unknown>; result: unknown }[]
  confidence: number // 0-1
  emotionalTone: 'excited' | 'tense' | 'celebratory' | 'dramatic' | 'informative'
}

export interface OrchestratorState {
  currentRound: number
  roundPhase: 'pre_run' | 'during_run' | 'post_run' | 'between_rounds'
  agents: Record<string, AgentResponse | null>
  sharedContext: SharedContext
}

export interface SharedContext {
  bullName: string
  bullStats: { aggression: number; speed: number; breed: string; pastWins: number }
  tamerName: string
  tamerStats: { experience: number; successRate: number; village: string }
  crowdEnergy: number
  userPrediction: string | null
  roundResult: string | null
  holdDuration: number | null
  distance: number | null
  eventName: string
  totalRounds: number
  completedRounds: number
  userScore: number
}
