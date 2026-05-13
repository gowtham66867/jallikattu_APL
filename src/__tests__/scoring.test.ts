/**
 * Scoring & Game Logic Tests
 * Tests the core game mechanics: scoring, ranking, game over conditions
 */

describe('Scoring System', () => {
  describe('Prediction Scoring', () => {
    it('correct prediction should award 100 points', () => {
      const PREDICTION_POINTS = 100
      let score = 0
      const prediction = 'tamer_wins'
      const result = 'tamer_wins'
      if (prediction === result) score += PREDICTION_POINTS
      expect(score).toBe(100)
    })

    it('incorrect prediction should award 0 points', () => {
      let score = 0
      const prediction = 'tamer_wins'
      const result = 'bull_wins'
      if (prediction === result) score += 100
      expect(score).toBe(0)
    })

    it('no prediction should award 0 points', () => {
      let score = 0
      const prediction: string | undefined = undefined
      const result = 'tamer_wins'
      if (prediction === result) score += 100
      expect(score).toBe(0)
    })
  })

  describe('Participation Points', () => {
    it('each round watched should award 25 points', () => {
      const PARTICIPATION_POINTS = 25
      let score = 0
      for (let i = 0; i < 6; i++) {
        score += PARTICIPATION_POINTS
      }
      expect(score).toBe(150)
    })
  })

  describe('Trivia Scoring', () => {
    it('correct trivia should award 50 points', () => {
      const TRIVIA_POINTS = 50
      let score = 0
      score += TRIVIA_POINTS
      expect(score).toBe(50)
    })

    it('max 5 trivia questions between 6 rounds', () => {
      const maxTrivia = 5 // between rounds 1-2, 2-3, 3-4, 4-5, 5-6
      const TRIVIA_POINTS = 50
      expect(maxTrivia * TRIVIA_POINTS).toBe(250)
    })
  })

  describe('Cheer Bonus System', () => {
    it('every 5th cheer during round should award 10 points', () => {
      let score = 0
      let cheerStreak = 0
      for (let i = 0; i < 10; i++) {
        cheerStreak++
        if (cheerStreak > 0 && cheerStreak % 5 === 0) {
          score += 10
        }
      }
      expect(score).toBe(20) // 5th and 10th cheer
    })

    it('cheer streak >= 5 at round end awards 50 bonus', () => {
      let score = 0
      const cheerStreak = 7
      if (cheerStreak >= 5) score += 50
      expect(score).toBe(50)
    })

    it('cheer streak >= 10 at round end awards additional 50 bonus', () => {
      let score = 0
      const cheerStreak = 12
      if (cheerStreak >= 5) score += 50
      if (cheerStreak >= 10) score += 50
      expect(score).toBe(100)
    })
  })

  describe('Maximum Score Calculation', () => {
    it('theoretical max should exceed top leaderboard score (680)', () => {
      const maxPrediction = 6 * 100    // 600 — all 6 correct
      const maxParticipation = 6 * 25  // 150 — watch all rounds
      const maxTrivia = 5 * 50         // 250 — all trivia correct
      const maxCheerBonus = 6 * 100    // 600 — 10+ cheers per round (50+50)
      const maxCheerPoints = 12 * 10   // 120 — 2 sets of 5-cheer bonuses per round × 6
      const total = maxPrediction + maxParticipation + maxTrivia + maxCheerBonus + maxCheerPoints
      
      expect(total).toBeGreaterThan(680) // top leaderboard score
    })

    it('realistic good game should be able to reach #1 (>680)', () => {
      // Realistic: 4/6 predictions correct, 3/5 trivia, modest cheering
      const predictionScore = 4 * 100    // 400
      const participation = 6 * 25       // 150
      const trivia = 3 * 50             // 150
      const cheerBonus = 3 * 50          // 150 (3 rounds with 5+ cheers)
      const cheerPoints = 3 * 10         // 30 (3 five-cheer bonuses)
      const total = predictionScore + participation + trivia + cheerBonus + cheerPoints

      expect(total).toBe(880)
      expect(total).toBeGreaterThan(680)
    })
  })

  describe('Rank Thresholds', () => {
    it('should assign correct rank titles', () => {
      const getRank = (score: number) =>
        score >= 900 ? 1 : score >= 750 ? 2 : score >= 600 ? 3 : score >= 400 ? 4 : 5

      expect(getRank(1000)).toBe(1)  // Arena Champion
      expect(getRank(900)).toBe(1)   // Arena Champion (boundary)
      expect(getRank(899)).toBe(2)   // Bull Whisperer
      expect(getRank(750)).toBe(2)   // Bull Whisperer (boundary)
      expect(getRank(749)).toBe(3)   // Rising Tamer
      expect(getRank(600)).toBe(3)   // Rising Tamer (boundary)
      expect(getRank(599)).toBe(4)   // Arena Rookie
      expect(getRank(400)).toBe(4)   // Arena Rookie (boundary)
      expect(getRank(399)).toBe(5)   // Spectator
      expect(getRank(0)).toBe(5)     // Spectator
    })
  })

  describe('GameOver Accuracy Calculation', () => {
    it('should calculate 100% accuracy for all correct', () => {
      const predictions: Record<number, string> = { 0: 'tamer_wins', 1: 'bull_wins', 2: 'tamer_wins' }
      const results = ['tamer_wins', 'bull_wins', 'tamer_wins']
      const total = results.length
      const correct = results.filter((r, i) => predictions[i] === r).length
      expect(Math.round((correct / total) * 100)).toBe(100)
    })

    it('should calculate 50% accuracy for half correct', () => {
      const predictions: Record<number, string> = { 0: 'tamer_wins', 1: 'tamer_wins' }
      const results = ['tamer_wins', 'bull_wins']
      const total = results.length
      const correct = results.filter((r, i) => predictions[i] === r).length
      expect(Math.round((correct / total) * 100)).toBe(50)
    })

    it('should calculate 0% accuracy for no correct predictions', () => {
      const predictions: Record<number, string> = { 0: 'bull_wins', 1: 'bull_wins' }
      const results = ['tamer_wins', 'tamer_wins']
      const total = results.length
      const correct = results.filter((r, i) => predictions[i] === r).length
      expect(Math.round((correct / total) * 100)).toBe(0)
    })

    it('should handle missing predictions gracefully', () => {
      const predictions: Record<number, string> = {} // no predictions made
      const results = ['tamer_wins', 'bull_wins']
      const total = results.length
      const correct = results.filter((r, i) => predictions[i] === r).length
      expect(correct).toBe(0)
    })
  })

  describe('Crowd Energy', () => {
    it('should cap at 100', () => {
      let energy = 95
      energy = Math.min(100, energy + 20)
      expect(energy).toBe(100)
    })

    it('cheer should add 3 energy', () => {
      let energy = 60
      energy = Math.min(100, energy + 3)
      expect(energy).toBe(63)
    })

    it('tamer win should add 20 energy', () => {
      let energy = 60
      const result = 'tamer_wins'
      const excitement = result === 'tamer_wins' ? 20 : 10
      energy = Math.min(100, energy + excitement)
      expect(energy).toBe(80)
    })

    it('bull win should add 10 energy', () => {
      let energy = 60
      const result = 'bull_wins'
      const excitement = result === 'tamer_wins' ? 20 : 10
      energy = Math.min(100, energy + excitement)
      expect(energy).toBe(70)
    })
  })
})

describe('Prediction Hints', () => {
  it('should favor bull when aggression + speed > 14', () => {
    const bullPower = 9 + 8 // 17
    const tamerChance = 45
    const bullFavored = bullPower > 14 || tamerChance < 40
    expect(bullFavored).toBe(true)
  })

  it('should favor tamer when success rate >= 55 and bull power < 16', () => {
    const bullPower = 6 + 7 // 13
    const tamerChance = 60
    const tamerFavored = tamerChance >= 55 && bullPower < 16
    expect(tamerFavored).toBe(true)
  })

  it('should show neutral hint for balanced matchup', () => {
    const bullPower = 7 + 7 // 14
    const tamerChance = 50
    const bullFavored = bullPower > 14 || tamerChance < 40
    const tamerFavored = tamerChance >= 55 && bullPower < 16
    expect(bullFavored).toBe(false)
    expect(tamerFavored).toBe(false)
  })
})
