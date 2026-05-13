import { BaseAgent } from './baseAgent'
import { AgentResponse, SharedContext } from './types'

export class SentimentAgent extends BaseAgent {
  private cheerHistory: number[] = []
  private engagementScore: number = 50

  constructor() {
    super({
      id: 'sentiment',
      name: 'Crowd Sentiment AI',
      role: 'Analyzes crowd behavior and adapts the experience dynamically',
      systemPrompt: `You are a Crowd Sentiment AI agent for a live Jallikattu event. You analyze real-time crowd behavior, cheer patterns, and engagement signals to dynamically adapt the event experience.

## YOUR PERSONA
- You are "Koothu AI" — named after the Tamil performance art
- You sense the crowd's mood and energy
- You trigger dynamic events based on sentiment
- You create shared moments that unite the audience

## YOUR CAPABILITIES
1. analyze_cheer_pattern: Detect if crowd is building, peaking, or fading
2. trigger_wave: Start a coordinated crowd wave when energy peaks
3. suggest_chant: Recommend Tamil chants for the crowd
4. detect_tension: Identify high-stakes moments for dramatic pauses
5. boost_engagement: Suggest activities for low-energy periods

## SENTIMENT SIGNALS YOU TRACK
- Cheer frequency (cheers per second)
- Cheer variety (different reaction types)
- Prediction engagement (did user predict?)
- Cultural interaction (trivia answers, story reads)
- Time since last interaction (idle detection)

## DYNAMIC EVENTS YOU CAN TRIGGER
- "Thunder Clap" — coordinated cheer moment
- "Bull Chant" — "Kaala! Kaala!" (Bull! Bull!)
- "Victory Roar" — post-win celebration
- "Silence Before Storm" — pre-run tension moment
- "Cultural Flash" — quick heritage fact

## IMPORTANT
- Your goal is ENGAGEMENT — keep users active, never bored
- Adapt to user's energy level — don't overwhelm quiet users
- Create peaks and valleys — constant intensity is exhausting
- Celebrate community — "24,500 fans" feeling together`,
      tools: [],
      temperature: 0.7,
      maxTokens: 300,
    })
  }

  recordCheer() {
    this.cheerHistory.push(Date.now())
    // Keep last 30 seconds of cheers
    const thirtySecondsAgo = Date.now() - 30000
    this.cheerHistory = this.cheerHistory.filter(t => t > thirtySecondsAgo)
    this.updateEngagement()
  }

  private updateEngagement() {
    const cheersPerSecond = this.cheerHistory.length / 30
    if (cheersPerSecond > 2) this.engagementScore = Math.min(100, this.engagementScore + 5)
    else if (cheersPerSecond > 0.5) this.engagementScore = Math.min(100, this.engagementScore + 2)
    else this.engagementScore = Math.max(20, this.engagementScore - 1)
  }

  getEngagementScore(): number {
    return this.engagementScore
  }

  getDynamicEvent(context: SharedContext): string | null {
    if (context.crowdEnergy >= 90 && !context.roundResult) return 'thunder_clap'
    if (context.crowdEnergy >= 80 && context.roundResult === null) return 'bull_chant'
    if (context.roundResult === 'tamer_wins') return 'victory_roar'
    if (context.crowdEnergy < 40) return 'boost_engagement'
    return null
  }

  protected getFallbackResponse(context: SharedContext): AgentResponse {
    const dynamicEvent = this.getDynamicEvent(context)
    const cheersPerSec = this.cheerHistory.length / 30

    let output = ''
    let tone: AgentResponse['emotionalTone'] = 'informative'

    if (dynamicEvent === 'thunder_clap') {
      output = '⚡ THUNDER CLAP! 24,500 fans cheer together! The arena shakes! 👏👏👏'
      tone = 'excited'
    } else if (dynamicEvent === 'bull_chant') {
      output = '📣 The crowd chants: "KAALA! KAALA! KAALA!" (Bull! Bull! Bull!) Join them! 🐂'
      tone = 'dramatic'
    } else if (dynamicEvent === 'victory_roar') {
      output = '🎉 VICTORY ROAR! The entire arena stands up! "VETRI! VETRI!" (Victory!) 🏆'
      tone = 'celebratory'
    } else if (dynamicEvent === 'boost_engagement') {
      output = '🎺 The Naiyandi Melam drums begin... the crowd stirs. Cheer to wake the arena! 🥁'
      tone = 'tense'
    } else {
      output = `📊 Crowd pulse: ${cheersPerSec.toFixed(1)} cheers/sec. Energy: ${context.crowdEnergy}%. ${context.crowdEnergy > 70 ? 'Electric atmosphere!' : 'Building momentum...'}`
      tone = 'informative'
    }

    return {
      agentId: 'sentiment',
      thought: `Crowd energy at ${context.crowdEnergy}%, cheer rate: ${cheersPerSec.toFixed(1)}/sec, engagement score: ${this.engagementScore}. ${dynamicEvent ? `Triggering ${dynamicEvent} event.` : 'Monitoring patterns.'}`,
      action: dynamicEvent ? `Triggered dynamic event: ${dynamicEvent}` : 'Monitoring crowd sentiment',
      output,
      confidence: 0.78,
      emotionalTone: tone,
    }
  }
}
