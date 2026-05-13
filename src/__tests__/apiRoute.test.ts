/**
 * API Route Tests
 * Tests the /api/agents/orchestrate endpoint logic
 */

import { AgentOrchestrator } from '@/lib/agents/orchestrator'

// Mock Gemini API
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

describe('API Route Logic', () => {
  let orchestrator: AgentOrchestrator

  beforeEach(() => {
    orchestrator = new AgentOrchestrator()
  })

  describe('Context Updates', () => {
    it('should update context from request body', () => {
      const context = {
        bullName: 'Veerabhadra',
        bullStats: { aggression: 9, speed: 8, breed: 'Kangayam', pastWins: 12 },
        tamerName: 'Karthik',
        tamerStats: { experience: 6, successRate: 45, village: 'Madurai' },
        crowdEnergy: 70,
      }
      orchestrator.updateContext(context)
      const state = orchestrator.getState()
      expect(state.sharedContext.bullName).toBe('Veerabhadra')
      expect(state.sharedContext.crowdEnergy).toBe(70)
    })
  })

  describe('Action Processing', () => {
    it('should process cheer action without error', () => {
      expect(() => orchestrator.recordCheer()).not.toThrow()
    })

    it('should process prediction action', () => {
      expect(() => orchestrator.recordPrediction('tamer_wins')).not.toThrow()
    })

    it('should process trivia action (correct)', () => {
      expect(() => orchestrator.recordTrivia(true)).not.toThrow()
    })

    it('should process trivia action (incorrect)', () => {
      expect(() => orchestrator.recordTrivia(false)).not.toThrow()
    })

    it('should process story_read action', () => {
      expect(() => orchestrator.recordStoryRead()).not.toThrow()
    })

    it('should process round_complete action', () => {
      expect(() => orchestrator.recordRoundComplete()).not.toThrow()
    })
  })

  describe('Orchestration Phases', () => {
    const phases: Array<'pre_run' | 'during_run' | 'post_run' | 'between_rounds'> = [
      'pre_run', 'during_run', 'post_run', 'between_rounds'
    ]

    phases.forEach(phase => {
      it(`should handle ${phase} phase via sync orchestration`, () => {
        const result = orchestrator.orchestrateSync(phase)

        expect(result).toHaveProperty('commentary')
        expect(result).toHaveProperty('prediction')
        expect(result).toHaveProperty('sentiment')
        expect(result).toHaveProperty('personalization')
        expect(result).toHaveProperty('orchestratorDecision')
        expect(result.orchestratorDecision).toContain(`Phase: ${phase}`)
      })
    })

    phases.forEach(phase => {
      it(`should handle ${phase} phase via async orchestration`, async () => {
        const result = await orchestrator.orchestrate(phase)

        expect(result).toHaveProperty('commentary')
        expect(result).toHaveProperty('prediction')
        expect(result).toHaveProperty('sentiment')
        expect(result).toHaveProperty('personalization')
        expect(result).toHaveProperty('orchestratorDecision')
      })
    })
  })

  describe('Response Shape', () => {
    it('sync response should match expected API shape', () => {
      const result = orchestrator.orchestrateSync('pre_run')
      const adaptations = orchestrator.getAdaptations()

      // Simulate the API response construction
      const apiResponse = {
        success: true,
        hasAI: false,
        phase: 'pre_run',
        agents: result,
        adaptations,
        orchestratorState: {
          decision: result.orchestratorDecision,
          activePhase: 'pre_run',
        },
      }

      expect(apiResponse.success).toBe(true)
      expect(apiResponse.hasAI).toBe(false)
      expect(apiResponse.phase).toBe('pre_run')
      expect(apiResponse.agents.commentary.agentId).toBe('commentary')
      expect(apiResponse.agents.prediction.agentId).toBe('prediction')
      expect(apiResponse.agents.sentiment.agentId).toBe('sentiment')
      expect(apiResponse.agents.personalization.agentId).toBe('personalization')
      expect(apiResponse.orchestratorState.decision).toBeTruthy()
    })
  })

  describe('Error Resilience', () => {
    it('should handle empty context update gracefully', () => {
      expect(() => orchestrator.updateContext({})).not.toThrow()
    })

    it('should handle rapid phase changes', () => {
      expect(() => {
        orchestrator.orchestrateSync('pre_run')
        orchestrator.orchestrateSync('during_run')
        orchestrator.orchestrateSync('post_run')
        orchestrator.orchestrateSync('between_rounds')
      }).not.toThrow()
    })

    it('should handle multiple cheers in rapid succession', () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          orchestrator.recordCheer()
        }
      }).not.toThrow()
    })
  })
})
