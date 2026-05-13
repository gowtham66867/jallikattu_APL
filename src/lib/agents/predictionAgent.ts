import { BaseAgent } from './baseAgent'
import { AgentResponse, SharedContext } from './types'

export class PredictionAgent extends BaseAgent {
  constructor() {
    super({
      id: 'prediction',
      name: 'Prediction Analytics AI',
      role: 'Analyzes stats and generates prediction odds with transparent reasoning',
      systemPrompt: `You are a Jallikattu prediction analytics AI agent. You analyze bull and tamer statistics to generate fair odds and predictions with TRANSPARENT chain-of-thought reasoning.

## YOUR PERSONA
- You are "Nandi Analytics" — named after the sacred bull
- You blend data analysis with domain knowledge of Jallikattu
- You show your reasoning process openly so users learn
- You are calibrated — you admit uncertainty honestly

## YOUR ANALYTICAL FRAMEWORK
1. Bull Factors (weight 60%):
   - Aggression (1-10): Higher = harder to hold
   - Speed (1-10): Higher = less reaction time for tamer
   - Past Wins: Track record of escaping tamers
   - Breed characteristics (Kangayam = strongest, Pulikulam = fastest)
   
2. Tamer Factors (weight 40%):
   - Success Rate: Historical win percentage
   - Experience: Years of participation
   - Against breed type: Some tamers specialize

3. Context Factors (modifier):
   - Crowd energy: High energy can boost or distract
   - Round number: Fatigue builds for tamers in later rounds
   - Weather/time: Evening = slightly calmer bulls

## OUTPUT FORMAT
Always provide:
- Clear percentage odds (must add to 100%)
- 3-step reasoning chain
- A confidence level for your prediction
- A "wildcard factor" that could upset the prediction

## IMPORTANT
- Never give 50/50 — always commit to a lean
- Show your math/reasoning transparently
- Reference specific stats in your analysis
- Be honest about uncertainty`,
      tools: [],
      temperature: 0.4,
      maxTokens: 400,
    })
  }

  generateOdds(context: SharedContext): { tamerWins: number; bullWins: number; reasoning: string[] } {
    const { bullStats, tamerStats } = context

    // Bull strength score (0-100)
    const bullScore = (bullStats.aggression * 6 + bullStats.speed * 4) / 10 * 10

    // Tamer strength score (0-100)
    const tamerScore = tamerStats.successRate * 0.7 + Math.min(tamerStats.experience * 3, 30)

    // Breed modifier
    const breedModifier = bullStats.breed === 'Kangayam' ? 8 : bullStats.breed === 'Pulikulam' ? 5 : 3

    // Calculate odds
    const rawBullChance = (bullScore + breedModifier) / (bullScore + breedModifier + tamerScore) * 100
    const bullWins = Math.round(Math.max(25, Math.min(85, rawBullChance)))
    const tamerWins = 100 - bullWins

    const reasoning = [
      `Bull Power: ${context.bullName} has aggression ${bullStats.aggression}/10 and speed ${bullStats.speed}/10 → Bull Score: ${bullScore.toFixed(0)}`,
      `Tamer Skill: ${context.tamerName} has ${tamerStats.successRate}% success rate with ${tamerStats.experience}yr experience → Tamer Score: ${tamerScore.toFixed(0)}`,
      `Breed Factor: ${bullStats.breed} adds +${breedModifier} to bull advantage. Final odds: Bull ${bullWins}% vs Tamer ${tamerWins}%`,
    ]

    return { tamerWins, bullWins, reasoning }
  }

  protected getFallbackResponse(context: SharedContext): AgentResponse {
    const odds = this.generateOdds(context)

    return {
      agentId: 'prediction',
      thought: `Analyzing ${context.bullName} (${context.bullStats.breed}, AGR:${context.bullStats.aggression}, SPD:${context.bullStats.speed}) vs ${context.tamerName} (${context.tamerStats.successRate}% success, ${context.tamerStats.experience}yr exp). Bull breed ${context.bullStats.breed} is a significant factor.`,
      action: `Generated odds: Bull ${odds.bullWins}% / Tamer ${odds.tamerWins}% based on multi-factor analysis`,
      output: `📊 **Nandi Analytics**: ${context.bullName} ${odds.bullWins}% vs ${context.tamerName} ${odds.tamerWins}%. ${odds.bullWins > 60 ? 'Bull favored — high aggression + breed advantage.' : odds.tamerWins > 60 ? 'Tamer favored — strong track record.' : 'Close matchup — could go either way!'}`,
      confidence: 0.82,
      emotionalTone: 'informative',
    }
  }
}
