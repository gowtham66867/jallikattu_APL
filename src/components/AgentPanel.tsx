'use client'

import { useState } from 'react'
import { AgentResponse } from '@/lib/agents/types'
import AgentFeedback from '@/components/AgentFeedback'

interface AgentPanelProps {
  agents: {
    commentary: AgentResponse | null
    prediction: (AgentResponse & { odds?: { tamerWins: number; bullWins: number; reasoning: string[] } }) | null
    sentiment: AgentResponse | null
    personalization: AgentResponse | null
  }
  orchestratorDecision: string
  isLoading: boolean
  onAgentFeedback?: (agentId: string, rating: 'helpful' | 'not_helpful') => void
}

const agentMeta = {
  commentary: { name: 'Thiruvalluvar AI', icon: '🎙️', color: 'text-saffron', bgColor: 'bg-saffron/10', borderColor: 'border-saffron/30' },
  prediction: { name: 'Nandi Analytics', icon: '📊', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  sentiment: { name: 'Koothu AI', icon: '📣', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' },
  personalization: { name: 'Sangam AI', icon: '🎯', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
}

export default function AgentPanel({ agents, orchestratorDecision, isLoading, onAgentFeedback }: AgentPanelProps) {
  const [showThoughts, setShowThoughts] = useState(false)
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)

  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      {/* Header with Orchestrator Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-gradient-to-r from-saffron to-pongal bg-clip-text text-transparent">
            🤖 AI AGENTS
          </span>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-green-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
          </span>
        </div>
        <button
          onClick={() => setShowThoughts(!showThoughts)}
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          {showThoughts ? '🧠 Hide Reasoning' : '🧠 Show Reasoning'}
        </button>
      </div>

      {/* Orchestrator Decision */}
      <div className="text-xs text-white/30 bg-white/5 rounded-lg px-2 py-1 font-mono">
        ⚙️ {orchestratorDecision || 'Initializing orchestrator...'}
      </div>

      {/* Agent Outputs */}
      <div className="space-y-2">
        {(Object.entries(agents) as [keyof typeof agentMeta, AgentResponse | null][]).map(([key, agent]) => {
          if (!agent || !agent.output) return null
          const meta = agentMeta[key]

          return (
            <div
              key={key}
              onClick={() => setExpandedAgent(expandedAgent === key ? null : key)}
              className={`${meta.bgColor} border ${meta.borderColor} rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]`}
            >
              {/* Agent Header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{meta.icon}</span>
                  <span className={`text-xs font-bold ${meta.color}`}>{meta.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    agent.emotionalTone === 'excited' ? 'bg-yellow-500/20 text-yellow-400' :
                    agent.emotionalTone === 'dramatic' ? 'bg-red-500/20 text-red-400' :
                    agent.emotionalTone === 'celebratory' ? 'bg-green-500/20 text-green-400' :
                    agent.emotionalTone === 'tense' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/10 text-white/50'
                  }`}>
                    {agent.emotionalTone}
                  </span>
                </div>
                <span className="text-xs text-white/30">
                  {(agent.confidence * 100).toFixed(0)}% conf
                </span>
              </div>

              {/* Agent Output */}
              <p className="text-sm text-white/80">{agent.output}</p>

              {/* Prediction Odds (special for prediction agent) */}
              {key === 'prediction' && (agents.prediction as any)?.odds && (
                <div className="mt-2 flex gap-2">
                  <div className="flex-1 bg-red-500/20 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-red-400">{(agents.prediction as any).odds.bullWins}%</div>
                    <div className="text-xs text-white/40">Bull Wins</div>
                  </div>
                  <div className="flex-1 bg-green-500/20 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-green-400">{(agents.prediction as any).odds.tamerWins}%</div>
                    <div className="text-xs text-white/40">Tamer Wins</div>
                  </div>
                </div>
              )}

              {/* Chain of Thought (expandable) */}
              {(showThoughts || expandedAgent === key) && (
                <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                  <div className="text-xs text-white/40">
                    <span className="font-bold">💭 Thought:</span> {agent.thought}
                  </div>
                  <div className="text-xs text-white/40">
                    <span className="font-bold">⚡ Action:</span> {agent.action}
                  </div>
                  {/* Tool Calls */}
                  {agent.toolCalls && agent.toolCalls.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      <span className="text-xs font-bold text-yellow-400/60">🔧 Tools Used:</span>
                      {agent.toolCalls.map((tc, i) => (
                        <div key={i} className="text-xs text-white/30 pl-3 bg-yellow-500/5 rounded p-1">
                          <span className="text-yellow-400/50">{tc.tool}</span> → {JSON.stringify(tc.result).slice(0, 120)}...
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Prediction Reasoning Steps */}
                  {key === 'prediction' && (agents.prediction as any)?.odds?.reasoning && (
                    <div className="mt-1 space-y-0.5">
                      <span className="text-xs font-bold text-white/40">📐 Reasoning Chain:</span>
                      {(agents.prediction as any).odds.reasoning.map((step: string, i: number) => (
                        <div key={i} className="text-xs text-white/30 pl-3">
                          {i + 1}. {step}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Agent Feedback */}
                  {onAgentFeedback && (
                    <div className="mt-2 pt-1 border-t border-white/5">
                      <AgentFeedback agentId={key} agentName={meta.name} onFeedback={onAgentFeedback} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Agent Interaction Map */}
      <div className="pt-2 border-t border-white/10">
        <div className="text-xs text-white/30 mb-1">Agent Communication Flow:</div>
        <div className="flex items-center justify-center gap-1 text-xs">
          <span className="bg-saffron/20 text-saffron px-2 py-0.5 rounded">Commentary</span>
          <span className="text-white/20">←→</span>
          <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Prediction</span>
          <span className="text-white/20">←→</span>
          <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Sentiment</span>
          <span className="text-white/20">←→</span>
          <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Personal</span>
        </div>
      </div>
    </div>
  )
}
