import { CommentaryAgent } from './commentaryAgent'
import { PredictionAgent } from './predictionAgent'
import { SentimentAgent } from './sentimentAgent'
import { PersonalizationAgent } from './personalizationAgent'
import { AgentResponse, OrchestratorState, SharedContext } from './types'

export class AgentOrchestrator {
  private commentary: CommentaryAgent
  private prediction: PredictionAgent
  private sentiment: SentimentAgent
  private personalization: PersonalizationAgent
  private state: OrchestratorState

  constructor() {
    this.commentary = new CommentaryAgent()
    this.prediction = new PredictionAgent()
    this.sentiment = new SentimentAgent()
    this.personalization = new PersonalizationAgent()
    this.state = {
      currentRound: 0,
      roundPhase: 'pre_run',
      agents: {
        commentary: null,
        prediction: null,
        sentiment: null,
        personalization: null,
      },
      sharedContext: this.getDefaultContext(),
    }
  }

  private getDefaultContext(): SharedContext {
    return {
      bullName: '',
      bullStats: { aggression: 0, speed: 0, breed: '', pastWins: 0 },
      tamerName: '',
      tamerStats: { experience: 0, successRate: 0, village: '' },
      crowdEnergy: 50,
      userPrediction: null,
      roundResult: null,
      holdDuration: null,
      distance: null,
      eventName: 'Alanganallur Jallikattu 2026',
      totalRounds: 6,
      completedRounds: 0,
      userScore: 0,
    }
  }

  updateContext(updates: Partial<SharedContext>) {
    this.state.sharedContext = { ...this.state.sharedContext, ...updates }
  }

  setPhase(phase: OrchestratorState['roundPhase']) {
    this.state.roundPhase = phase
  }

  async orchestrate(phase: 'pre_run' | 'during_run' | 'post_run' | 'between_rounds'): Promise<{
    commentary: AgentResponse
    prediction: AgentResponse
    sentiment: AgentResponse
    personalization: AgentResponse
    orchestratorDecision: string
  }> {
    this.state.roundPhase = phase
    const context = this.state.sharedContext

    // Determine which agents to activate based on phase
    const agentPlan = this.planAgentActivation(phase)

    // Execute agents (in production, these would be parallel async calls)
    const results = {
      commentary: agentPlan.commentary ? await this.commentary.think(context) : this.getIdleResponse('commentary'),
      prediction: agentPlan.prediction ? await this.prediction.think(context) : this.getIdleResponse('prediction'),
      sentiment: agentPlan.sentiment ? await this.sentiment.think(context) : this.getIdleResponse('sentiment'),
      personalization: agentPlan.personalization ? await this.personalization.think(context) : this.getIdleResponse('personalization'),
      orchestratorDecision: '',
    }

    // Orchestrator meta-decision: which agent output to prioritize
    results.orchestratorDecision = this.makeMetaDecision(phase, { commentary: results.commentary, prediction: results.prediction, sentiment: results.sentiment, personalization: results.personalization })

    // Store results in state
    this.state.agents = {
      commentary: results.commentary,
      prediction: results.prediction,
      sentiment: results.sentiment,
      personalization: results.personalization,
    }

    return results
  }

  // Synchronous version for client-side fallback
  orchestrateSync(phase: 'pre_run' | 'during_run' | 'post_run' | 'between_rounds'): {
    commentary: AgentResponse
    prediction: AgentResponse & { odds?: { tamerWins: number; bullWins: number; reasoning: string[] } }
    sentiment: AgentResponse
    personalization: AgentResponse
    orchestratorDecision: string
  } {
    this.state.roundPhase = phase
    const context = this.state.sharedContext

    // Use fallback responses (no API call needed)
    const commentary = this.commentary['getFallbackResponse'](context)
    const predictionResponse = this.prediction['getFallbackResponse'](context)
    const sentiment = this.sentiment['getFallbackResponse'](context)
    const personalization = this.personalization['getFallbackResponse'](context)

    const odds = this.prediction.generateOdds(context)

    const results = {
      commentary,
      prediction: { ...predictionResponse, odds },
      sentiment,
      personalization,
      orchestratorDecision: this.makeMetaDecision(phase, { commentary, prediction: predictionResponse, sentiment, personalization }),
    }

    this.state.agents = {
      commentary: results.commentary,
      prediction: results.prediction,
      sentiment: results.sentiment,
      personalization: results.personalization,
    }

    return results
  }

  private planAgentActivation(phase: string): Record<string, boolean> {
    switch (phase) {
      case 'pre_run':
        return { commentary: true, prediction: true, sentiment: true, personalization: true }
      case 'during_run':
        return { commentary: true, prediction: false, sentiment: true, personalization: false }
      case 'post_run':
        return { commentary: true, prediction: false, sentiment: true, personalization: true }
      case 'between_rounds':
        return { commentary: true, prediction: false, sentiment: false, personalization: true }
      default:
        return { commentary: true, prediction: true, sentiment: true, personalization: true }
    }
  }

  private makeMetaDecision(phase: string, results: Record<string, AgentResponse>): string {
    const priorities: Record<string, string[]> = {
      pre_run: ['prediction', 'commentary', 'personalization'],
      during_run: ['commentary', 'sentiment'],
      post_run: ['commentary', 'sentiment', 'personalization'],
      between_rounds: ['personalization', 'commentary'],
    }

    const priority = priorities[phase] || ['commentary']
    const primaryAgent = priority[0]
    const confidence = results[primaryAgent]?.confidence || 0

    return `Phase: ${phase} | Primary: ${primaryAgent} (confidence: ${(confidence * 100).toFixed(0)}%) | Active: ${priority.join(' → ')}`
  }

  private getIdleResponse(agentId: string): AgentResponse {
    return {
      agentId,
      thought: 'Idle — not active in this phase',
      action: 'Waiting for relevant phase',
      output: '',
      confidence: 0,
      emotionalTone: 'informative',
    }
  }

  // Inter-agent communication
  recordCheer() {
    this.sentiment.recordCheer()
    this.personalization.logInteraction('cheer')
  }

  recordPrediction(pick: string) {
    this.personalization.logInteraction('prediction', { pick })
  }

  recordTrivia(correct: boolean) {
    this.personalization.logInteraction('trivia', { correct })
  }

  recordStoryRead() {
    this.personalization.logInteraction('story_read')
  }

  recordRoundComplete() {
    this.personalization.logInteraction('round_complete')
  }

  getAdaptations() {
    return this.personalization.getAdaptations()
  }

  getState(): OrchestratorState {
    return this.state
  }
}
