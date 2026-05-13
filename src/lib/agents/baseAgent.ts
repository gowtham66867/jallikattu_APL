import { GoogleGenerativeAI } from '@google/generative-ai'
import { AgentConfig, AgentMemory, AgentResponse, SharedContext, AgentMessage } from './types'
import { agentTools, geminiFunctionDeclarations } from './tools'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export abstract class BaseAgent {
  protected config: AgentConfig
  protected memory: AgentMemory
  protected conversationHistory: AgentMessage[] = []

  constructor(config: AgentConfig) {
    this.config = config
    this.memory = {
      shortTerm: [],
      longTerm: {},
      userProfile: {
        predictionsCorrect: 0,
        predictionsTotal: 0,
        preferredLanguage: 'mixed',
        engagementLevel: 'medium',
        culturalKnowledge: 'beginner',
        cheerCount: 0,
        roundsWatched: 0,
        favoriteOutcome: 'neutral',
      },
    }
  }

  async think(context: SharedContext, userInput?: string): Promise<AgentResponse> {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      },
      tools: [{
        functionDeclarations: geminiFunctionDeclarations,
      }],
    })

    const prompt = this.buildPrompt(context, userInput)
    const toolCallResults: { tool: string; params: Record<string, unknown>; result: unknown }[] = []

    try {
      const result = await model.generateContent(prompt)
      const response = result.response

      // Handle function calls from Gemini
      const functionCalls = response.functionCalls()
      if (functionCalls && functionCalls.length > 0) {
        for (const fc of functionCalls) {
          const toolName = fc.name as keyof typeof agentTools
          if (agentTools[toolName]) {
            try {
              const toolResult = (agentTools[toolName] as Function)(context)
              toolCallResults.push({ tool: fc.name, params: fc.args as Record<string, unknown>, result: toolResult })
            } catch (toolErr) {
              console.error(`Tool ${fc.name} execution error:`, toolErr)
            }
          }
        }

        // If tools were called, make a second call with tool results
        if (toolCallResults.length > 0) {
          const toolContext = toolCallResults.map(t => `Tool "${t.tool}" returned: ${JSON.stringify(t.result)}`).join('\n')
          const followUpPrompt = `${prompt}\n\n## TOOL RESULTS\n${toolContext}\n\nNow use these tool results to enhance your response. Respond in the EXACT JSON format specified above.`
          const followUp = await model.generateContent(followUpPrompt)
          const followUpText = followUp.response.text()
          const parsed = this.parseResponse(followUpText)
          parsed.toolCalls = toolCallResults

          this.storeInMemory(parsed)
          return parsed
        }
      }

      // Standard response (no function calls)
      const text = response.text()
      const parsed = this.parseResponse(text)
      parsed.toolCalls = toolCallResults.length > 0 ? toolCallResults : undefined

      this.storeInMemory(parsed)
      return parsed
    } catch (error) {
      console.error(`Agent ${this.config.id} error:`, error)
      return this.getFallbackResponse(context)
    }
  }

  private storeInMemory(parsed: AgentResponse) {
    this.memory.shortTerm.push({
      role: 'agent',
      content: parsed.output,
      agentId: this.config.id,
      timestamp: Date.now(),
    })

    // Keep short-term memory bounded
    if (this.memory.shortTerm.length > 20) {
      this.memory.shortTerm = this.memory.shortTerm.slice(-15)
    }
  }

  protected buildPrompt(context: SharedContext, userInput?: string): string {
    const memoryContext = this.memory.shortTerm.slice(-5).map(m => m.content).join('\n')

    return `${this.config.systemPrompt}

## CURRENT CONTEXT
- Event: ${context.eventName}
- Round: ${context.completedRounds + 1} of ${context.totalRounds}
- Bull: ${context.bullName} (${context.bullStats.breed}, Aggression: ${context.bullStats.aggression}/10, Speed: ${context.bullStats.speed}/10, Past Wins: ${context.bullStats.pastWins})
- Tamer: ${context.tamerName} (Experience: ${context.tamerStats.experience}yrs, Success Rate: ${context.tamerStats.successRate}%, Village: ${context.tamerStats.village})
- Crowd Energy: ${context.crowdEnergy}%
- User's Prediction: ${context.userPrediction || 'Not yet made'}
- Round Result: ${context.roundResult || 'Pending'}
${context.holdDuration ? `- Hold Duration: ${context.holdDuration.toFixed(1)}s` : ''}
${context.distance ? `- Distance Covered: ${context.distance.toFixed(1)}m` : ''}
- User Score: ${context.userScore}

## USER PROFILE
- Engagement Level: ${this.memory.userProfile.engagementLevel}
- Cultural Knowledge: ${this.memory.userProfile.culturalKnowledge}
- Predictions: ${this.memory.userProfile.predictionsCorrect}/${this.memory.userProfile.predictionsTotal} correct
- Preferred Language: ${this.memory.userProfile.preferredLanguage}

## RECENT MEMORY
${memoryContext || 'No prior context'}

${userInput ? `## USER INPUT\n${userInput}` : ''}

## INSTRUCTIONS
Respond in this EXACT JSON format:
{
  "thought": "Your internal chain-of-thought reasoning (2-3 sentences explaining your analysis)",
  "action": "What you decided to do and why (1 sentence)",
  "output": "Your final output for the user (engaging, contextual, max 2 sentences)",
  "confidence": 0.85,
  "emotionalTone": "excited"
}

The emotionalTone must be one of: excited, tense, celebratory, dramatic, informative`
  }

  protected parseResponse(text: string): AgentResponse {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          agentId: this.config.id,
          thought: parsed.thought || '',
          action: parsed.action || '',
          output: parsed.output || '',
          confidence: parsed.confidence || 0.7,
          emotionalTone: parsed.emotionalTone || 'informative',
        }
      }
    } catch (e) {
      // If JSON parsing fails, use raw text
    }

    return {
      agentId: this.config.id,
      thought: 'Processing context...',
      action: 'Generating response',
      output: text.slice(0, 200),
      confidence: 0.5,
      emotionalTone: 'informative',
    }
  }

  protected abstract getFallbackResponse(context: SharedContext): AgentResponse

  updateUserProfile(updates: Partial<AgentMemory['userProfile']>) {
    this.memory.userProfile = { ...this.memory.userProfile, ...updates }
  }

  getMemory(): AgentMemory {
    return this.memory
  }
}
