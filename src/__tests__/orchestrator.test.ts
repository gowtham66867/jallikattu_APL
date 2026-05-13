import { AgentOrchestrator } from '@/lib/agents/orchestrator'

// Mock Gemini API so we don't need a real key
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => '{"thought":"test","action":"test","output":"test","confidence":0.8,"emotionalTone":"excited"}',
          functionCalls: () => null,
        },
      }),
    }),
  })),
  SchemaType: { OBJECT: 'OBJECT', STRING: 'STRING', NUMBER: 'NUMBER' },
}))

describe('AgentOrchestrator', () => {
  let orchestrator: AgentOrchestrator

  beforeEach(() => {
    orchestrator = new AgentOrchestrator()
  })

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const state = orchestrator.getState()
      expect(state.currentRound).toBe(0)
      expect(state.roundPhase).toBe('pre_run')
      expect(state.agents.commentary).toBeNull()
      expect(state.agents.prediction).toBeNull()
      expect(state.agents.sentiment).toBeNull()
      expect(state.agents.personalization).toBeNull()
    })

    it('should have default shared context', () => {
      const state = orchestrator.getState()
      expect(state.sharedContext.bullName).toBe('')
      expect(state.sharedContext.crowdEnergy).toBe(50)
      expect(state.sharedContext.totalRounds).toBe(6)
      expect(state.sharedContext.userScore).toBe(0)
    })
  })

  describe('Context Updates', () => {
    it('should update shared context', () => {
      orchestrator.updateContext({
        bullName: 'Veerabhadra',
        crowdEnergy: 80,
        userScore: 300,
      })
      const state = orchestrator.getState()
      expect(state.sharedContext.bullName).toBe('Veerabhadra')
      expect(state.sharedContext.crowdEnergy).toBe(80)
      expect(state.sharedContext.userScore).toBe(300)
    })

    it('should merge context without losing existing values', () => {
      orchestrator.updateContext({ bullName: 'Nandi' })
      orchestrator.updateContext({ tamerName: 'Karthik' })
      const state = orchestrator.getState()
      expect(state.sharedContext.bullName).toBe('Nandi')
      expect(state.sharedContext.tamerName).toBe('Karthik')
    })
  })

  describe('Phase Setting', () => {
    it('should update round phase', () => {
      orchestrator.setPhase('during_run')
      expect(orchestrator.getState().roundPhase).toBe('during_run')
    })
  })

  describe('Sync Orchestration (fallback)', () => {
    it('should return all 4 agent responses for pre_run', () => {
      orchestrator.updateContext({
        bullName: 'Veerabhadra',
        bullStats: { aggression: 9, speed: 8, breed: 'Kangayam', pastWins: 12 },
        tamerName: 'Karthik',
        tamerStats: { experience: 6, successRate: 45, village: 'Madurai' },
        crowdEnergy: 70,
      })

      const result = orchestrator.orchestrateSync('pre_run')

      expect(result.commentary).toBeDefined()
      expect(result.commentary.agentId).toBe('commentary')
      expect(result.commentary.output).toBeTruthy()

      expect(result.prediction).toBeDefined()
      expect(result.prediction.agentId).toBe('prediction')
      expect(result.prediction.odds).toBeDefined()

      expect(result.sentiment).toBeDefined()
      expect(result.sentiment.agentId).toBe('sentiment')

      expect(result.personalization).toBeDefined()
      expect(result.personalization.agentId).toBe('personalization')
    })

    it('should return orchestrator decision string', () => {
      const result = orchestrator.orchestrateSync('pre_run')
      expect(result.orchestratorDecision).toContain('Phase: pre_run')
      expect(result.orchestratorDecision).toContain('Primary:')
    })

    it('pre_run should prioritize prediction agent', () => {
      const result = orchestrator.orchestrateSync('pre_run')
      expect(result.orchestratorDecision).toContain('Primary: prediction')
    })

    it('during_run should prioritize commentary agent', () => {
      const result = orchestrator.orchestrateSync('during_run')
      expect(result.orchestratorDecision).toContain('Primary: commentary')
    })

    it('post_run should prioritize commentary agent', () => {
      const result = orchestrator.orchestrateSync('post_run')
      expect(result.orchestratorDecision).toContain('Primary: commentary')
    })

    it('between_rounds should prioritize personalization agent', () => {
      const result = orchestrator.orchestrateSync('between_rounds')
      expect(result.orchestratorDecision).toContain('Primary: personalization')
    })

    it('prediction odds should have tamerWins, bullWins, reasoning', () => {
      orchestrator.updateContext({
        bullStats: { aggression: 9, speed: 8, breed: 'Kangayam', pastWins: 12 },
        tamerStats: { experience: 6, successRate: 45, village: 'Madurai' },
      })
      const result = orchestrator.orchestrateSync('pre_run')
      expect(result.prediction.odds).toBeDefined()
      expect(result.prediction.odds!.tamerWins).toBeGreaterThan(0)
      expect(result.prediction.odds!.bullWins).toBeGreaterThan(0)
      expect(result.prediction.odds!.tamerWins + result.prediction.odds!.bullWins).toBeCloseTo(100, 0)
      expect(result.prediction.odds!.reasoning.length).toBeGreaterThan(0)
    })
  })

  describe('Agent Responses', () => {
    it('each agent should have required fields', () => {
      const result = orchestrator.orchestrateSync('pre_run')
      const agents = [result.commentary, result.prediction, result.sentiment, result.personalization]

      agents.forEach(agent => {
        expect(agent).toHaveProperty('agentId')
        expect(agent).toHaveProperty('thought')
        expect(agent).toHaveProperty('action')
        expect(agent).toHaveProperty('output')
        expect(agent).toHaveProperty('confidence')
        expect(agent).toHaveProperty('emotionalTone')
        expect(agent.confidence).toBeGreaterThanOrEqual(0)
        expect(agent.confidence).toBeLessThanOrEqual(1)
      })
    })

    it('emotional tone should be valid', () => {
      const validTones = ['excited', 'tense', 'celebratory', 'dramatic', 'informative']
      const result = orchestrator.orchestrateSync('pre_run')
      const agents = [result.commentary, result.prediction, result.sentiment, result.personalization]

      agents.forEach(agent => {
        expect(validTones).toContain(agent.emotionalTone)
      })
    })
  })

  describe('Inter-Agent Communication', () => {
    it('recordCheer should not throw', () => {
      expect(() => orchestrator.recordCheer()).not.toThrow()
    })

    it('recordPrediction should not throw', () => {
      expect(() => orchestrator.recordPrediction('tamer_wins')).not.toThrow()
    })

    it('recordTrivia should not throw', () => {
      expect(() => orchestrator.recordTrivia(true)).not.toThrow()
      expect(() => orchestrator.recordTrivia(false)).not.toThrow()
    })

    it('recordStoryRead should not throw', () => {
      expect(() => orchestrator.recordStoryRead()).not.toThrow()
    })

    it('recordRoundComplete should not throw', () => {
      expect(() => orchestrator.recordRoundComplete()).not.toThrow()
    })

    it('getAdaptations should return an object', () => {
      const adaptations = orchestrator.getAdaptations()
      expect(typeof adaptations).toBe('object')
    })
  })

  describe('State Persistence', () => {
    it('orchestration results should be stored in state', () => {
      orchestrator.orchestrateSync('pre_run')
      const state = orchestrator.getState()

      expect(state.agents.commentary).not.toBeNull()
      expect(state.agents.prediction).not.toBeNull()
      expect(state.agents.sentiment).not.toBeNull()
      expect(state.agents.personalization).not.toBeNull()
      expect(state.roundPhase).toBe('pre_run')
    })

    it('phase should update after orchestration', () => {
      orchestrator.orchestrateSync('during_run')
      expect(orchestrator.getState().roundPhase).toBe('during_run')

      orchestrator.orchestrateSync('post_run')
      expect(orchestrator.getState().roundPhase).toBe('post_run')
    })
  })
})
