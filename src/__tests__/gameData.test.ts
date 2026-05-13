import { bulls, tamers, triviaQuestions, generateRounds, Round } from '@/lib/gameData'

describe('Game Data', () => {
  describe('Bulls', () => {
    it('should have exactly 6 bulls', () => {
      expect(bulls).toHaveLength(6)
    })

    it('each bull should have all required properties', () => {
      bulls.forEach(bull => {
        expect(bull.id).toBeTruthy()
        expect(bull.name).toBeTruthy()
        expect(bull.breed).toBeTruthy()
        expect(bull.weight).toBeGreaterThan(0)
        expect(bull.age).toBeGreaterThanOrEqual(3) // minimum age to participate
        expect(bull.aggression).toBeGreaterThanOrEqual(1)
        expect(bull.aggression).toBeLessThanOrEqual(10)
        expect(bull.speed).toBeGreaterThanOrEqual(1)
        expect(bull.speed).toBeLessThanOrEqual(10)
        expect(bull.pastWins).toBeGreaterThanOrEqual(0)
        expect(bull.owner).toBeTruthy()
        expect(bull.village).toBeTruthy()
      })
    })

    it('each bull should have a unique id', () => {
      const ids = bulls.map(b => b.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('each bull should have a unique name', () => {
      const names = bulls.map(b => b.name)
      expect(new Set(names).size).toBe(names.length)
    })

    it('bulls should be from recognized breeds', () => {
      const validBreeds = ['Kangayam', 'Pulikulam', 'Umbalachery', 'Malaimadu']
      bulls.forEach(bull => {
        expect(validBreeds).toContain(bull.breed)
      })
    })
  })

  describe('Tamers', () => {
    it('should have exactly 6 tamers', () => {
      expect(tamers).toHaveLength(6)
    })

    it('each tamer should have all required properties', () => {
      tamers.forEach(tamer => {
        expect(tamer.id).toBeTruthy()
        expect(tamer.name).toBeTruthy()
        expect(tamer.age).toBeGreaterThanOrEqual(18)
        expect(tamer.village).toBeTruthy()
        expect(tamer.experience).toBeGreaterThan(0)
        expect(tamer.successRate).toBeGreaterThan(0)
        expect(tamer.successRate).toBeLessThanOrEqual(100)
        expect(tamer.totalAttempts).toBeGreaterThan(0)
        expect(tamer.wins).toBeGreaterThanOrEqual(0)
        expect(tamer.wins).toBeLessThanOrEqual(tamer.totalAttempts)
      })
    })

    it('success rate should be roughly consistent with wins/attempts', () => {
      tamers.forEach(tamer => {
        const calculatedRate = Math.round((tamer.wins / tamer.totalAttempts) * 100)
        // Allow some rounding tolerance (up to 5% difference)
        expect(Math.abs(calculatedRate - tamer.successRate)).toBeLessThanOrEqual(5)
      })
    })

    it('each tamer should have a unique id', () => {
      const ids = tamers.map(t => t.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('Trivia Questions', () => {
    it('should have at least 6 questions (one per between-rounds break)', () => {
      expect(triviaQuestions.length).toBeGreaterThanOrEqual(6)
    })

    it('each question should have valid structure', () => {
      triviaQuestions.forEach(q => {
        expect(q.q).toBeTruthy()
        expect(q.options).toHaveLength(4)
        expect(q.answer).toBeGreaterThanOrEqual(0)
        expect(q.answer).toBeLessThan(4)
        q.options.forEach(opt => expect(opt).toBeTruthy())
      })
    })

    it('answer index should point to a valid option', () => {
      triviaQuestions.forEach(q => {
        expect(q.options[q.answer]).toBeTruthy()
      })
    })
  })

  describe('generateRounds()', () => {
    let rounds: Round[]

    beforeEach(() => {
      rounds = generateRounds()
    })

    it('should generate exactly 6 rounds', () => {
      expect(rounds).toHaveLength(6)
    })

    it('rounds should be numbered 1 through 6', () => {
      rounds.forEach((r, i) => {
        expect(r.id).toBe(i + 1)
      })
    })

    it('first round should be active, rest upcoming', () => {
      expect(rounds[0].status).toBe('active')
      rounds.slice(1).forEach(r => {
        expect(r.status).toBe('upcoming')
      })
    })

    it('each round should have a bull and tamer', () => {
      rounds.forEach(r => {
        expect(r.bull).toBeDefined()
        expect(r.bull.name).toBeTruthy()
        expect(r.tamer).toBeDefined()
        expect(r.tamer.name).toBeTruthy()
      })
    })

    it('no result or holdDuration should be set initially', () => {
      rounds.forEach(r => {
        expect(r.result).toBeUndefined()
        expect(r.holdDuration).toBeUndefined()
        expect(r.distance).toBeUndefined()
      })
    })

    it('each round should have crowd energy between 50-80', () => {
      rounds.forEach(r => {
        expect(r.crowdEnergy).toBeGreaterThanOrEqual(50)
        expect(r.crowdEnergy).toBeLessThan(80)
      })
    })

    it('should use all 6 unique bulls', () => {
      const bullNames = rounds.map(r => r.bull.name)
      expect(new Set(bullNames).size).toBe(6)
    })

    it('should produce different shuffles on repeated calls', () => {
      const rounds2 = generateRounds()
      const order1 = rounds.map(r => r.bull.name).join(',')
      const order2 = rounds2.map(r => r.bull.name).join(',')
      // Extremely unlikely to be the same twice (6! = 720 permutations)
      // But not impossible, so we run 3 tries
      const rounds3 = generateRounds()
      const order3 = rounds3.map(r => r.bull.name).join(',')
      const allSame = order1 === order2 && order2 === order3
      expect(allSame).toBe(false)
    })
  })
})
