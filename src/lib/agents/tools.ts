import { SchemaType, FunctionDeclaration } from '@google/generative-ai'
import { SharedContext } from './types'

// Actual tool implementations that agents can call via Gemini function calling

export const agentTools = {
  // Commentary Agent Tools
  assess_drama_level: (context: SharedContext): { level: string; score: number; reason: string } => {
    const { bullStats, tamerStats, crowdEnergy } = context
    const tension = (bullStats.aggression + bullStats.speed) / 2
    const skill = tamerStats.successRate / 10
    const crowd = crowdEnergy / 10
    const score = (tension + crowd - skill + 5) / 3 // Normalized 0-10

    let level = 'moderate'
    if (score > 7) level = 'extreme'
    else if (score > 5) level = 'high'
    else if (score < 3) level = 'low'

    const reasons: Record<string, string> = {
      extreme: `${context.bullName} is a beast with ${bullStats.aggression}/10 aggression and the crowd is at ${crowdEnergy}%!`,
      high: `Strong matchup — ${context.bullName}'s speed vs ${context.tamerName}'s experience creates real tension`,
      moderate: `Balanced face-off, could go either way`,
      low: `${context.tamerName} is heavily favored with ${tamerStats.successRate}% success rate`,
    }

    return { level, score: Math.round(score * 10) / 10, reason: reasons[level] }
  },

  reference_history: (context: SharedContext): { fact: string; relevance: string } => {
    const historyFacts: Record<string, { fact: string; relevance: string }> = {
      Kangayam: {
        fact: 'Kangayam bulls from Erode district are the most prized Jallikattu breeds, known for their muscular build and fierce temperament.',
        relevance: `${context.bullName} is a Kangayam — expect maximum aggression and power.`,
      },
      Pulikulam: {
        fact: 'Pulikulam cattle from Sivaganga are known for speed and agility rather than brute strength.',
        relevance: `${context.bullName} is a Pulikulam — speed will be the key factor, not raw power.`,
      },
      Malaimadu: {
        fact: 'Malaimadu (hill cattle) from the Western Ghats are known for their endurance and unpredictability.',
        relevance: `${context.bullName} is a Malaimadu — expect unpredictable behavior.`,
      },
      Umbalachery: {
        fact: 'Umbalachery bulls from Nagapattinam are smaller but incredibly fast and nimble.',
        relevance: `${context.bullName} is an Umbalachery — small but lightning-quick.`,
      },
    }

    return historyFacts[context.bullStats.breed] || {
      fact: 'Jallikattu has been practiced for over 2000 years, mentioned in Sangam literature.',
      relevance: `Every matchup at ${context.eventName} carries the weight of millennia of tradition.`,
    }
  },

  build_narrative: (context: SharedContext): { arc: string; nextBeat: string } => {
    const { completedRounds, totalRounds, userScore } = context
    const progress = completedRounds / totalRounds

    if (progress < 0.3) {
      return {
        arc: 'Opening Act — The arena is warming up',
        nextBeat: 'Early rounds set the stage. Stars are yet to emerge.',
      }
    } else if (progress < 0.6) {
      return {
        arc: 'Rising Action — The competition intensifies',
        nextBeat: 'Mid-event drama. Upsets and surprises are common here.',
      }
    } else if (progress < 0.9) {
      return {
        arc: 'Climax — Championship rounds approach',
        nextBeat: `Only ${totalRounds - completedRounds} rounds left! Every prediction counts.`,
      }
    } else {
      return {
        arc: 'Grand Finale — The last stand',
        nextBeat: `Final round! Score: ${userScore}. This is what Jallikattu is all about!`,
      }
    }
  },

  // Prediction Agent Tools
  calculate_breed_advantage: (context: SharedContext): { modifier: number; explanation: string } => {
    const breedStats: Record<string, { power: number; speed: number; unpredictability: number }> = {
      Kangayam: { power: 9, speed: 7, unpredictability: 6 },
      Pulikulam: { power: 6, speed: 9, unpredictability: 7 },
      Malaimadu: { power: 7, speed: 6, unpredictability: 9 },
      Umbalachery: { power: 5, speed: 8, unpredictability: 5 },
    }

    const breed = breedStats[context.bullStats.breed] || { power: 6, speed: 6, unpredictability: 6 }
    const modifier = (breed.power + breed.speed + breed.unpredictability) / 3 - 5 // -5 to +4 range

    return {
      modifier: Math.round(modifier * 10) / 10,
      explanation: `${context.bullStats.breed}: Power ${breed.power}/10, Speed ${breed.speed}/10, Unpredictability ${breed.unpredictability}/10 → Net advantage: ${modifier > 0 ? '+' : ''}${modifier.toFixed(1)} for bull`,
    }
  },

  analyze_fatigue: (context: SharedContext): { tamerFatigue: string; impact: string } => {
    const round = context.completedRounds + 1
    if (round <= 2) return { tamerFatigue: 'Fresh', impact: 'No fatigue impact on performance' }
    if (round <= 4) return { tamerFatigue: 'Moderate', impact: 'Slight reaction time decrease (-5% effective success rate)' }
    return { tamerFatigue: 'High', impact: `Round ${round} — significant fatigue. -15% effective success rate for tamers` }
  },

  // Sentiment Agent Tools
  calculate_cheer_momentum: (cheerRate: number, crowdEnergy: number): { momentum: string; suggestion: string } => {
    const score = cheerRate * 30 + crowdEnergy / 2

    if (score > 80) return { momentum: 'Peak', suggestion: 'Trigger Thunder Clap — crowd is ready to explode!' }
    if (score > 50) return { momentum: 'Building', suggestion: 'Encourage more cheers — almost at peak!' }
    if (score > 25) return { momentum: 'Steady', suggestion: 'Start a chant to build energy' }
    return { momentum: 'Low', suggestion: 'Play Naiyandi Melam drums to wake the crowd' }
  },

  detect_upset_potential: (context: SharedContext): { isUpset: boolean; reason: string } => {
    const bullStrong = context.bullStats.aggression >= 8
    const tamerStrong = context.tamerStats.successRate >= 70

    if (bullStrong && tamerStrong) {
      return { isUpset: true, reason: 'Clash of titans — strong bull meets elite tamer. Anything can happen!' }
    }
    if (!bullStrong && !tamerStrong) {
      return { isUpset: true, reason: 'Neither dominates — this is a coin flip moment!' }
    }
    return { isUpset: false, reason: 'Clear favorite in this matchup.' }
  },
}

// Gemini function declarations for function calling
export const geminiFunctionDeclarations: FunctionDeclaration[] = [
  {
    name: 'assess_drama_level',
    description: 'Assess the current drama/tension level of the Jallikattu matchup',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
    },
  },
  {
    name: 'reference_history',
    description: 'Get historical facts about the current bull breed or arena',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
    },
  },
  {
    name: 'build_narrative',
    description: 'Get the current narrative arc and next story beat',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
    },
  },
  {
    name: 'calculate_breed_advantage',
    description: 'Calculate the statistical advantage based on bull breed',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
    },
  },
  {
    name: 'analyze_fatigue',
    description: 'Analyze tamer fatigue based on round number',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
    },
  },
]
