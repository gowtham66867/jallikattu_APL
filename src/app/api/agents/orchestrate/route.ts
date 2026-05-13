import { NextRequest, NextResponse } from 'next/server'
import { AgentOrchestrator } from '@/lib/agents/orchestrator'
import { SharedContext } from '@/lib/agents/types'

// In production, this would be a singleton managed by Cloud Run
const orchestrator = new AgentOrchestrator()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phase, context, action } = body as {
      phase: 'pre_run' | 'during_run' | 'post_run' | 'between_rounds'
      context: Partial<SharedContext>
      action?: { type: string; data?: unknown }
    }

    // Update shared context
    if (context) {
      orchestrator.updateContext(context)
    }

    // Process user actions
    if (action) {
      switch (action.type) {
        case 'cheer':
          orchestrator.recordCheer()
          break
        case 'prediction':
          orchestrator.recordPrediction(action.data as string)
          break
        case 'trivia':
          orchestrator.recordTrivia(action.data as boolean)
          break
        case 'story_read':
          orchestrator.recordStoryRead()
          break
        case 'round_complete':
          orchestrator.recordRoundComplete()
          break
      }
    }

    // Check if Gemini API key is available
    const hasApiKey = !!process.env.GEMINI_API_KEY

    let results
    if (hasApiKey) {
      // Full AI-powered orchestration
      results = await orchestrator.orchestrate(phase)
    } else {
      // Intelligent fallback (still uses agent logic, just not Gemini)
      results = orchestrator.orchestrateSync(phase)
    }

    return NextResponse.json({
      success: true,
      hasAI: hasApiKey,
      phase,
      agents: results,
      adaptations: orchestrator.getAdaptations(),
      orchestratorState: {
        decision: results.orchestratorDecision,
        activePhase: phase,
      },
    })
  } catch (error) {
    console.error('Orchestrator error:', error)
    return NextResponse.json(
      { success: false, error: 'Agent orchestration failed' },
      { status: 500 }
    )
  }
}
