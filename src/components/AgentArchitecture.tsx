'use client'

import { useState } from 'react'

interface AgentArchitectureProps {
  activePhase: string
  hasAI: boolean
}

export default function AgentArchitecture({ activePhase, hasAI }: AgentArchitectureProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full glass rounded-2xl p-3 text-center text-xs text-white/40 hover:text-white/70 transition-all"
      >
        🏗️ View Multi-Agent Architecture →
      </button>
    )
  }

  return (
    <div className="glass rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gradient">🏗️ Agent Architecture</h3>
        <button onClick={() => setIsOpen(false)} className="text-xs text-white/40 hover:text-white">✕</button>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-black/30 rounded-xl p-4 font-mono text-xs space-y-2">
        <div className="text-center text-white/50 mb-3">Multi-Agent Orchestration System</div>
        
        {/* User Layer */}
        <div className="flex justify-center">
          <div className="bg-pongal/20 border border-pongal/40 rounded-lg px-4 py-1.5 text-pongal">
            👤 User Interactions
          </div>
        </div>
        <div className="text-center text-white/20">↓ events ↓</div>

        {/* Orchestrator */}
        <div className="flex justify-center">
          <div className={`bg-white/10 border-2 border-saffron/60 rounded-lg px-4 py-2 text-saffron ${activePhase ? 'glow-saffron' : ''}`}>
            ⚙️ Orchestrator (phase: {activePhase || 'idle'})
          </div>
        </div>
        <div className="text-center text-white/20">↓ coordinates ↓</div>

        {/* Agent Layer */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`border rounded-lg p-2 text-center ${activePhase === 'pre_run' || activePhase === 'during_run' || activePhase === 'post_run' ? 'border-saffron/50 bg-saffron/10 text-saffron' : 'border-white/10 text-white/30'}`}>
            🎙️ Commentary
            <div className="text-[10px] mt-0.5 opacity-60">Thiruvalluvar AI</div>
          </div>
          <div className={`border rounded-lg p-2 text-center ${activePhase === 'pre_run' ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-white/10 text-white/30'}`}>
            📊 Prediction
            <div className="text-[10px] mt-0.5 opacity-60">Nandi Analytics</div>
          </div>
          <div className={`border rounded-lg p-2 text-center ${activePhase === 'during_run' || activePhase === 'post_run' ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-white/10 text-white/30'}`}>
            📣 Sentiment
            <div className="text-[10px] mt-0.5 opacity-60">Koothu AI</div>
          </div>
          <div className={`border rounded-lg p-2 text-center ${activePhase === 'pre_run' || activePhase === 'post_run' || activePhase === 'between_rounds' ? 'border-purple-500/50 bg-purple-500/10 text-purple-400' : 'border-white/10 text-white/30'}`}>
            🎯 Personal
            <div className="text-[10px] mt-0.5 opacity-60">Sangam AI</div>
          </div>
        </div>
        <div className="text-center text-white/20">↓ calls ↓</div>

        {/* AI Layer */}
        <div className="flex justify-center">
          <div className={`border rounded-lg px-4 py-1.5 text-center ${hasAI ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'}`}>
            {hasAI ? '✅ Gemini 1.5 Flash (Live)' : '⚡ Intelligent Fallback (No API Key)'}
          </div>
        </div>
      </div>

      {/* Agent Capabilities Table */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-white/50">Agent Capabilities:</div>
        <div className="grid grid-cols-1 gap-1.5 text-xs">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
            <span>🎙️</span>
            <span className="text-white/60 flex-1">Commentary — Dramatic narration, Tamil cultural references, tension building</span>
            <span className="text-white/30">T=0.9</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
            <span>📊</span>
            <span className="text-white/60 flex-1">Prediction — Multi-factor analysis, breed knowledge, transparent reasoning</span>
            <span className="text-white/30">T=0.4</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
            <span>📣</span>
            <span className="text-white/60 flex-1">Sentiment — Crowd analysis, dynamic events, engagement optimization</span>
            <span className="text-white/30">T=0.7</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
            <span>🎯</span>
            <span className="text-white/60 flex-1">Personalization — Behavior tracking, adaptive difficulty, challenges</span>
            <span className="text-white/30">T=0.5</span>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="text-xs text-white/30 space-y-1 border-t border-white/10 pt-3">
        <div>✓ <span className="text-white/50">Multi-agent orchestration</span> — Agents activated by phase</div>
        <div>✓ <span className="text-white/50">Shared context</span> — All agents see same game state</div>
        <div>✓ <span className="text-white/50">Memory system</span> — Short-term + user profile memory</div>
        <div>✓ <span className="text-white/50">Chain-of-thought</span> — Transparent reasoning visible to user</div>
        <div>✓ <span className="text-white/50">Inter-agent communication</span> — Agents inform each other</div>
        <div>✓ <span className="text-white/50">Graceful degradation</span> — Works without API key</div>
        <div>✓ <span className="text-white/50">Human-in-the-loop</span> — User actions affect agent behavior</div>
      </div>
    </div>
  )
}
