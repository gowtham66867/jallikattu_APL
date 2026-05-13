import { agentTools } from '@/lib/agents/tools'
import { SharedContext } from '@/lib/agents/types'

function makeContext(overrides: Partial<SharedContext> = {}): SharedContext {
  return {
    bullName: 'Veerabhadra',
    bullStats: { aggression: 9, speed: 8, breed: 'Kangayam', pastWins: 12 },
    tamerName: 'Karthik',
    tamerStats: { experience: 6, successRate: 45, village: 'Madurai' },
    crowdEnergy: 70,
    userPrediction: null,
    roundResult: null,
    holdDuration: null,
    distance: null,
    eventName: 'Alanganallur Jallikattu 2026',
    totalRounds: 6,
    completedRounds: 0,
    userScore: 0,
    ...overrides,
  }
}

describe('Agent Tools', () => {
  describe('assess_drama_level', () => {
    it('should return high/extreme for aggressive bull + high crowd', () => {
      const result = agentTools.assess_drama_level(makeContext({
        bullStats: { aggression: 10, speed: 9, breed: 'Kangayam', pastWins: 15 },
        crowdEnergy: 90,
      }))
      expect(['high', 'extreme']).toContain(result.level)
      expect(result.score).toBeGreaterThan(0)
      expect(result.reason).toBeTruthy()
    })

    it('should return low for weak bull + strong tamer', () => {
      const result = agentTools.assess_drama_level(makeContext({
        bullStats: { aggression: 3, speed: 3, breed: 'Umbalachery', pastWins: 1 },
        tamerStats: { experience: 12, successRate: 80, village: 'Theni' },
        crowdEnergy: 30,
      }))
      expect(['low', 'moderate']).toContain(result.level)
    })

    it('should return object with level, score, and reason', () => {
      const result = agentTools.assess_drama_level(makeContext())
      expect(result).toHaveProperty('level')
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('reason')
      expect(typeof result.level).toBe('string')
      expect(typeof result.score).toBe('number')
      expect(typeof result.reason).toBe('string')
    })
  })

  describe('reference_history', () => {
    it('should return Kangayam-specific fact for Kangayam breed', () => {
      const result = agentTools.reference_history(makeContext({
        bullStats: { aggression: 9, speed: 8, breed: 'Kangayam', pastWins: 12 },
      }))
      expect(result.fact).toContain('Kangayam')
      expect(result.relevance).toBeTruthy()
    })

    it('should return Pulikulam-specific fact for Pulikulam breed', () => {
      const result = agentTools.reference_history(makeContext({
        bullStats: { aggression: 7, speed: 9, breed: 'Pulikulam', pastWins: 8 },
      }))
      expect(result.fact).toContain('Pulikulam')
    })

    it('should return Umbalachery-specific fact for Umbalachery breed', () => {
      const result = agentTools.reference_history(makeContext({
        bullStats: { aggression: 10, speed: 7, breed: 'Umbalachery', pastWins: 15 },
      }))
      expect(result.fact).toContain('Umbalachery')
    })

    it('should return generic fact for unknown breed', () => {
      const result = agentTools.reference_history(makeContext({
        bullStats: { aggression: 5, speed: 5, breed: 'Unknown', pastWins: 0 },
      }))
      expect(result.fact).toContain('Jallikattu')
    })
  })

  describe('build_narrative', () => {
    it('should return Opening Act for early rounds', () => {
      const result = agentTools.build_narrative(makeContext({ completedRounds: 0, totalRounds: 6 }))
      expect(result.arc).toContain('Opening')
    })

    it('should return Rising Action for mid rounds', () => {
      const result = agentTools.build_narrative(makeContext({ completedRounds: 3, totalRounds: 6 }))
      expect(result.arc).toContain('Rising')
    })

    it('should return Climax for later rounds', () => {
      const result = agentTools.build_narrative(makeContext({ completedRounds: 4, totalRounds: 6 }))
      expect(result.arc).toContain('Climax')
    })

    it('should return Climax or Grand Finale for late rounds', () => {
      const result = agentTools.build_narrative(makeContext({ completedRounds: 5, totalRounds: 6 }))
      // 5/6 = 0.83, falls in Climax range (0.6-0.9)
      expect(result.arc).toMatch(/Climax|Finale/)
    })

    it('should return Grand Finale when >= 90% complete', () => {
      const result = agentTools.build_narrative(makeContext({
        completedRounds: 9, totalRounds: 10, userScore: 500,
      }))
      expect(result.arc).toContain('Finale')
      expect(result.nextBeat).toContain('500')
    })
  })

  describe('calculate_breed_advantage', () => {
    it('should return higher modifier for Kangayam (power breed)', () => {
      const kangayam = agentTools.calculate_breed_advantage(makeContext({
        bullStats: { aggression: 9, speed: 8, breed: 'Kangayam', pastWins: 12 },
      }))
      const umbalachery = agentTools.calculate_breed_advantage(makeContext({
        bullStats: { aggression: 5, speed: 8, breed: 'Umbalachery', pastWins: 5 },
      }))
      expect(kangayam.modifier).toBeGreaterThan(umbalachery.modifier)
    })

    it('should return explanation containing breed name', () => {
      const result = agentTools.calculate_breed_advantage(makeContext())
      expect(result.explanation).toContain('Kangayam')
      expect(result.explanation).toContain('Power')
    })

    it('should handle unknown breed gracefully', () => {
      const result = agentTools.calculate_breed_advantage(makeContext({
        bullStats: { aggression: 5, speed: 5, breed: 'Unknown', pastWins: 0 },
      }))
      expect(typeof result.modifier).toBe('number')
      expect(result.explanation).toBeTruthy()
    })
  })

  describe('analyze_fatigue', () => {
    it('should return Fresh for early rounds', () => {
      const result = agentTools.analyze_fatigue(makeContext({ completedRounds: 0 }))
      expect(result.tamerFatigue).toBe('Fresh')
    })

    it('should return Moderate for middle rounds', () => {
      const result = agentTools.analyze_fatigue(makeContext({ completedRounds: 2 }))
      expect(result.tamerFatigue).toBe('Moderate')
    })

    it('should return High for late rounds', () => {
      const result = agentTools.analyze_fatigue(makeContext({ completedRounds: 4 }))
      expect(result.tamerFatigue).toBe('High')
      expect(result.impact).toContain('-15%')
    })
  })

  describe('calculate_cheer_momentum', () => {
    it('should return Peak for high cheer rate + high energy', () => {
      const result = agentTools.calculate_cheer_momentum(3, 90)
      expect(result.momentum).toBe('Peak')
    })

    it('should return Low for no cheers and low energy', () => {
      const result = agentTools.calculate_cheer_momentum(0, 10)
      expect(result.momentum).toBe('Low')
    })

    it('should always return momentum and suggestion', () => {
      const result = agentTools.calculate_cheer_momentum(1, 50)
      expect(result.momentum).toBeTruthy()
      expect(result.suggestion).toBeTruthy()
    })
  })

  describe('detect_upset_potential', () => {
    it('should detect upset when both bull and tamer are strong', () => {
      const result = agentTools.detect_upset_potential(makeContext({
        bullStats: { aggression: 9, speed: 8, breed: 'Kangayam', pastWins: 15 },
        tamerStats: { experience: 12, successRate: 75, village: 'Theni' },
      }))
      expect(result.isUpset).toBe(true)
    })

    it('should detect upset when both are weak', () => {
      const result = agentTools.detect_upset_potential(makeContext({
        bullStats: { aggression: 5, speed: 5, breed: 'Umbalachery', pastWins: 2 },
        tamerStats: { experience: 3, successRate: 30, village: 'Test' },
      }))
      expect(result.isUpset).toBe(true)
    })

    it('should not detect upset when clear favorite', () => {
      const result = agentTools.detect_upset_potential(makeContext({
        bullStats: { aggression: 9, speed: 8, breed: 'Kangayam', pastWins: 15 },
        tamerStats: { experience: 3, successRate: 30, village: 'Test' },
      }))
      expect(result.isUpset).toBe(false)
    })
  })
})
