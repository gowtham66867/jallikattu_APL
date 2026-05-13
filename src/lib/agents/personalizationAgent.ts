import { BaseAgent } from './baseAgent'
import { AgentResponse, SharedContext, UserProfile } from './types'

export class PersonalizationAgent extends BaseAgent {
  private interactionLog: { type: string; timestamp: number; data?: unknown }[] = []

  constructor() {
    super({
      id: 'personalization',
      name: 'Personalization AI',
      role: 'Adapts the entire experience based on user behavior patterns',
      systemPrompt: `You are a Personalization AI agent that observes user behavior in real-time and adapts the Jallikattu experience to maximize their engagement and learning.

## YOUR PERSONA
- You are "Sangam AI" — named after the ancient Tamil literary academy
- You learn silently from every interaction
- You personalize content, difficulty, and tone
- You balance entertainment with education

## WHAT YOU OBSERVE
1. Prediction patterns: Do they always pick bull or tamer? Are they risk-takers?
2. Engagement timing: When do they cheer most? Pre-run or during?
3. Cultural interaction: Do they read stories? Answer trivia correctly?
4. Session duration: How long have they been watching?
5. Score trajectory: Getting better or plateauing?

## ADAPTATIONS YOU MAKE
1. Trivia Difficulty:
   - Beginner: Basic facts about Jallikattu
   - Intermediate: Breed-specific knowledge, arena details
   - Expert: Historical dates, literary references, rule nuances

2. Commentary Style:
   - Low engagement → More dramatic, attention-grabbing
   - High engagement → More analytical, insider knowledge
   - Cultural beginner → More explanations of Tamil terms
   - Cultural expert → More authentic Tamil phrases

3. Challenge Suggestions:
   - "Streak Challenge" for users on a prediction streak
   - "Underdog Bet" for users who always pick favorites
   - "Speed Cheer" for low-interaction users

4. Content Surfacing:
   - Surface cultural stories based on current bull breed
   - Show relevant achievements close to unlocking
   - Highlight social features when user seems isolated

## IMPORTANT
- Never make the user feel watched or profiled
- Frame adaptations as natural progression
- Reward exploration and cultural learning
- Respect that some users just want to watch`,
      tools: [],
      temperature: 0.5,
      maxTokens: 350,
    })
  }

  logInteraction(type: string, data?: unknown) {
    this.interactionLog.push({ type, timestamp: Date.now(), data })
    this.updateProfile()
  }

  private updateProfile() {
    const recentInteractions = this.interactionLog.filter(
      i => i.timestamp > Date.now() - 300000 // Last 5 minutes
    )

    const cheerCount = recentInteractions.filter(i => i.type === 'cheer').length
    const predictions = recentInteractions.filter(i => i.type === 'prediction')
    const triviaAnswers = recentInteractions.filter(i => i.type === 'trivia')
    const storyReads = recentInteractions.filter(i => i.type === 'story_read')

    // Update engagement level
    const actionsPerMinute = recentInteractions.length / 5
    let engagementLevel: UserProfile['engagementLevel'] = 'medium'
    if (actionsPerMinute > 3) engagementLevel = 'high'
    else if (actionsPerMinute < 1) engagementLevel = 'low'

    // Update cultural knowledge
    const triviaCorrect = triviaAnswers.filter(t => (t.data as { correct?: boolean })?.correct).length
    let culturalKnowledge: UserProfile['culturalKnowledge'] = 'beginner'
    if (triviaCorrect >= 3 || storyReads.length >= 3) culturalKnowledge = 'intermediate'
    if (triviaCorrect >= 5 && storyReads.length >= 4) culturalKnowledge = 'expert'

    // Update favorite outcome
    const tamerPicks = predictions.filter(p => (p.data as { pick?: string })?.pick === 'tamer_wins').length
    const bullPicks = predictions.filter(p => (p.data as { pick?: string })?.pick === 'bull_wins').length
    let favoriteOutcome: UserProfile['favoriteOutcome'] = 'neutral'
    if (tamerPicks > bullPicks + 2) favoriteOutcome = 'tamer_wins'
    if (bullPicks > tamerPicks + 2) favoriteOutcome = 'bull_wins'

    this.updateUserProfile({
      engagementLevel,
      culturalKnowledge,
      favoriteOutcome,
      cheerCount,
      roundsWatched: recentInteractions.filter(i => i.type === 'round_complete').length,
    })
  }

  getAdaptations(): {
    triviaDifficulty: string
    commentaryStyle: string
    suggestedChallenge: string | null
    contentPriority: string
  } {
    const profile = this.memory.userProfile

    return {
      triviaDifficulty: profile.culturalKnowledge,
      commentaryStyle: profile.engagementLevel === 'low' ? 'dramatic' :
        profile.engagementLevel === 'high' ? 'analytical' : 'balanced',
      suggestedChallenge: this.getSuggestedChallenge(profile),
      contentPriority: profile.culturalKnowledge === 'beginner' ? 'educational' :
        profile.culturalKnowledge === 'expert' ? 'deep_analysis' : 'mixed',
    }
  }

  private getSuggestedChallenge(profile: UserProfile): string | null {
    if (profile.predictionsCorrect >= 3) return '🔥 Streak Master: Get 5 correct predictions in a row!'
    if (profile.favoriteOutcome !== 'neutral') return `🎯 Underdog Bet: Predict the other outcome for 2x points!`
    if (profile.cheerCount < 5) return '📣 Crowd Booster: Cheer 10 times in one round!'
    if (profile.culturalKnowledge === 'beginner') return '🏛️ Heritage Explorer: Read 3 cultural stories!'
    return null
  }

  protected getFallbackResponse(context: SharedContext): AgentResponse {
    const adaptations = this.getAdaptations()
    const profile = this.memory.userProfile

    return {
      agentId: 'personalization',
      thought: `User profile: ${profile.engagementLevel} engagement, ${profile.culturalKnowledge} cultural knowledge, ${profile.predictionsCorrect}/${profile.predictionsTotal} predictions correct. Adapting experience accordingly.`,
      action: `Adjusted: trivia=${adaptations.triviaDifficulty}, commentary=${adaptations.commentaryStyle}, content=${adaptations.contentPriority}`,
      output: adaptations.suggestedChallenge
        ? `🎯 Challenge: ${adaptations.suggestedChallenge}`
        : `Experience adapted to your style. ${profile.engagementLevel === 'high' ? 'Loving your energy!' : 'More drama coming your way!'}`,
      confidence: 0.85,
      emotionalTone: 'informative',
    }
  }
}
