import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GameOver from '@/components/GameOver'
import { Round } from '@/lib/gameData'
import { SessionStats } from '@/lib/agents/persistentMemory'

const mockRounds: Round[] = [
  {
    id: 1,
    bull: { id: 'b1', name: 'Veerabhadra', breed: 'Kangayam', weight: 450, age: 5, aggression: 9, speed: 8, pastWins: 12, owner: 'Murugan', village: 'Alanganallur' },
    tamer: { id: 't1', name: 'Karthik', age: 24, village: 'Madurai', experience: 6, successRate: 45, totalAttempts: 40, wins: 18 },
    status: 'completed',
    result: 'tamer_wins',
    holdDuration: 12.5,
    distance: 18.3,
  },
  {
    id: 2,
    bull: { id: 'b2', name: 'Karuppu Raja', breed: 'Pulikulam', weight: 380, age: 4, aggression: 7, speed: 9, pastWins: 8, owner: 'Selvam', village: 'Palamedu' },
    tamer: { id: 't2', name: 'Senthil', age: 28, village: 'Sivagangai', experience: 10, successRate: 55, totalAttempts: 60, wins: 33 },
    status: 'completed',
    result: 'bull_wins',
    holdDuration: 3.2,
    distance: 5.1,
  },
  {
    id: 3,
    bull: { id: 'b3', name: 'Nandi', breed: 'Umbalachery', weight: 420, age: 6, aggression: 10, speed: 7, pastWins: 15, owner: 'Kannan', village: 'Avaniapuram' },
    tamer: { id: 't3', name: 'Manikandan', age: 22, village: 'Dindigul', experience: 4, successRate: 35, totalAttempts: 20, wins: 7 },
    status: 'completed',
    result: 'tamer_wins',
    holdDuration: 9.8,
    distance: 16.2,
  },
]

const mockSessionStats: SessionStats = {
  totalSessions: 3,
  totalRoundsWatched: 12,
  totalPredictions: 10,
  totalCorrectPredictions: 6,
  totalCheers: 25,
  totalTriviaCorrect: 4,
  totalTriviaAnswered: 7,
  lastSessionDate: new Date().toISOString(),
  highScore: 500,
  streakBest: 3,
  streakCurrent: 1,
  favoriteAgent: 'commentary',
}

describe('GameOver Component', () => {
  describe('Rendering', () => {
    it('should render Event Complete title', () => {
      render(
        <GameOver
          rounds={mockRounds}
          userScore={400}
          predictions={{ 0: 'tamer_wins', 1: 'tamer_wins', 2: 'tamer_wins' }}
          onReplay={jest.fn()}
        />
      )
      expect(screen.getByText('Event Complete!')).toBeInTheDocument()
    })

    it('should display the final score', () => {
      render(
        <GameOver rounds={mockRounds} userScore={750} predictions={{}} onReplay={jest.fn()} />
      )
      expect(screen.getByText('750')).toBeInTheDocument()
    })

    it('should show Play Again button', () => {
      render(
        <GameOver rounds={mockRounds} userScore={400} predictions={{}} onReplay={jest.fn()} />
      )
      expect(screen.getByRole('button')).toHaveTextContent('Play Again')
    })
  })

  describe('Accuracy Calculation', () => {
    it('should show correct prediction count', () => {
      // 2 correct: round 0 (tamer_wins match) and round 2 (tamer_wins match)
      render(
        <GameOver
          rounds={mockRounds}
          userScore={500}
          predictions={{ 0: 'tamer_wins', 1: 'tamer_wins', 2: 'tamer_wins' }}
          onReplay={jest.fn()}
        />
      )
      expect(screen.getByText('2/3')).toBeInTheDocument()
      expect(screen.getByText('67%')).toBeInTheDocument()
    })

    it('should show 0/3 and 0% when no predictions match', () => {
      render(
        <GameOver
          rounds={mockRounds}
          userScore={150}
          predictions={{ 0: 'bull_wins', 1: 'tamer_wins', 2: 'bull_wins' }}
          onReplay={jest.fn()}
        />
      )
      expect(screen.getByText('0/3')).toBeInTheDocument()
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  })

  describe('Rank Display', () => {
    it('should show Arena Champion for score >= 900', () => {
      render(
        <GameOver rounds={mockRounds} userScore={950} predictions={{}} onReplay={jest.fn()} />
      )
      expect(screen.getByText('Arena Champion')).toBeInTheDocument()
    })

    it('should show Bull Whisperer for score 750-899', () => {
      render(
        <GameOver rounds={mockRounds} userScore={800} predictions={{}} onReplay={jest.fn()} />
      )
      expect(screen.getByText('Bull Whisperer')).toBeInTheDocument()
    })

    it('should show Rising Tamer for score 600-749', () => {
      render(
        <GameOver rounds={mockRounds} userScore={650} predictions={{}} onReplay={jest.fn()} />
      )
      expect(screen.getByText('Rising Tamer')).toBeInTheDocument()
    })

    it('should show Arena Rookie for score 400-599', () => {
      render(
        <GameOver rounds={mockRounds} userScore={450} predictions={{}} onReplay={jest.fn()} />
      )
      expect(screen.getByText('Arena Rookie')).toBeInTheDocument()
    })

    it('should show Spectator for score < 400', () => {
      render(
        <GameOver rounds={mockRounds} userScore={100} predictions={{}} onReplay={jest.fn()} />
      )
      expect(screen.getByText('Spectator')).toBeInTheDocument()
    })
  })

  describe('Replay', () => {
    it('should call onReplay when button is clicked', () => {
      const onReplay = jest.fn()
      render(
        <GameOver rounds={mockRounds} userScore={400} predictions={{}} onReplay={onReplay} />
      )
      fireEvent.click(screen.getByRole('button'))
      expect(onReplay).toHaveBeenCalledTimes(1)
    })
  })

  describe('Session Stats', () => {
    it('should show lifetime stats when sessions > 1', () => {
      render(
        <GameOver
          rounds={mockRounds}
          userScore={400}
          predictions={{}}
          sessionStats={mockSessionStats}
          onReplay={jest.fn()}
        />
      )
      expect(screen.getByText(/Best: 500/)).toBeInTheDocument()
      expect(screen.getByText(/Sessions: 3/)).toBeInTheDocument()
    })

    it('should NOT show lifetime stats for first session', () => {
      render(
        <GameOver
          rounds={mockRounds}
          userScore={400}
          predictions={{}}
          sessionStats={{ ...mockSessionStats, totalSessions: 1 }}
          onReplay={jest.fn()}
        />
      )
      expect(screen.queryByText(/Sessions:/)).not.toBeInTheDocument()
    })
  })

  describe('Round Results Display', () => {
    it('should display all completed round results', () => {
      render(
        <GameOver rounds={mockRounds} userScore={400} predictions={{}} onReplay={jest.fn()} />
      )
      expect(screen.getByText(/Veerabhadra vs Karthik/)).toBeInTheDocument()
      expect(screen.getByText(/Karuppu Raja vs Senthil/)).toBeInTheDocument()
      expect(screen.getByText(/Nandi vs Manikandan/)).toBeInTheDocument()
    })

    it('should show Tamer/Bull labels for results', () => {
      render(
        <GameOver rounds={mockRounds} userScore={400} predictions={{}} onReplay={jest.fn()} />
      )
      const tamerWins = screen.getAllByText('Tamer')
      const bullWins = screen.getAllByText('Bull')
      expect(tamerWins.length).toBe(2) // rounds 1 and 3
      expect(bullWins.length).toBe(1)  // round 2
    })
  })

  describe('AI Agent Summary', () => {
    it('should show agent invocation count', () => {
      render(
        <GameOver rounds={mockRounds} userScore={400} predictions={{}} onReplay={jest.fn()} />
      )
      expect(screen.getByText(/AI Agents analyzed 3 rounds/)).toBeInTheDocument()
      expect(screen.getByText(/12 agent invocations/)).toBeInTheDocument()
    })
  })
})
