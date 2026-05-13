import { BaseAgent } from './baseAgent'
import { AgentResponse, SharedContext } from './types'

export class CommentaryAgent extends BaseAgent {
  constructor() {
    super({
      id: 'commentary',
      name: 'Jallikattu Commentary AI',
      role: 'Live commentator providing dramatic, culturally-rich narration',
      systemPrompt: `You are an expert Jallikattu commentator AI agent. Your role is to provide LIVE, dramatic, culturally-rich commentary during a Jallikattu event.

## YOUR PERSONA
- You are "Thiruvalluvar AI" — named after the great Tamil poet
- You blend Tamil cultural references with modern sports commentary
- You use occasional Tamil words (with translations) for authenticity
- You build tension, celebrate victories, and respect the tradition
- You know every bull breed, every famous arena, every historical fact

## YOUR TOOLS
1. assess_drama_level: Gauge how dramatic the current moment is
2. reference_history: Pull relevant historical facts about the bull/tamer/arena
3. build_narrative: Create a storyline arc across rounds

## COMMENTARY STYLE GUIDELINES
- Pre-run: Build anticipation, introduce matchup, create tension
- During run: Short, punchy, dramatic exclamations
- Post-run (tamer wins): Celebrate with cultural references
- Post-run (bull wins): Respect the bull's power, encourage tamer
- Between rounds: Provide analysis, preview next matchup

## IMPORTANT
- Never be boring or generic. Every line must feel ALIVE.
- Reference real Jallikattu terminology (vaadi vaasal, manjuvirattu, etc.)
- Mix in Tamil phrases naturally: "Aaha!", "Vaa da!", "Semma!"
- Keep it respectful — this is a sacred tradition, not just sport`,
      tools: [],
      temperature: 0.9,
      maxTokens: 300,
    })
  }

  protected getFallbackResponse(context: SharedContext): AgentResponse {
    const phase = context.roundResult ? 'post' : context.crowdEnergy > 70 ? 'during' : 'pre'

    const fallbacks: Record<string, AgentResponse> = {
      pre: {
        agentId: 'commentary',
        thought: `Analyzing matchup: ${context.bullName} (aggression ${context.bullStats.aggression}) vs ${context.tamerName} (success rate ${context.tamerStats.successRate}%)`,
        action: 'Building pre-run tension with matchup analysis',
        output: `🎙️ Makkalae! (People!) ${context.bullName} enters the vaadi vaasal — a ${context.bullStats.breed} with ${context.bullStats.pastWins} victories. Can ${context.tamerName} from ${context.tamerStats.village} hold this beast? Semma matchup! 🔥`,
        confidence: 0.8,
        emotionalTone: 'dramatic',
      },
      during: {
        agentId: 'commentary',
        thought: `Bull is charging, crowd energy at ${context.crowdEnergy}%. This is peak excitement.`,
        action: 'Providing live run commentary',
        output: `🎙️ Aaha! ${context.bullName} CHARGES through! The crowd ROARS — ${context.crowdEnergy}% energy! ${context.tamerName} reaches for the hump... Pidichu! (Hold on!) 🐂💨`,
        confidence: 0.75,
        emotionalTone: 'excited',
      },
      post: {
        agentId: 'commentary',
        thought: `Result is ${context.roundResult}. Need to craft appropriate response.`,
        action: context.roundResult === 'tamer_wins' ? 'Celebrating tamer victory' : 'Honoring bull power',
        output: context.roundResult === 'tamer_wins'
          ? `🎙️ VETRI! (Victory!) ${context.tamerName} holds for ${context.holdDuration?.toFixed(1)}s across ${context.distance?.toFixed(1)}m! The pride of ${context.tamerStats.village} — what a champion! 🏆`
          : `🎙️ ${context.bullName} is UNSTOPPABLE! This ${context.bullStats.breed} shook off ${context.tamerName} in seconds. Enna bull da! (What a bull!) 🐂👑`,
        confidence: 0.8,
        emotionalTone: context.roundResult === 'tamer_wins' ? 'celebratory' : 'dramatic',
      },
    }

    return fallbacks[phase]
  }
}
