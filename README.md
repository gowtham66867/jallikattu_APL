<div align="center">

# 🐂 Jallikattu Live — AI Agentic Second-Screen Experience

### *Where Ancient Tradition Meets Cutting-Edge AI*

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://jallikattu-live-1027882324647.us-central1.run.app)
[![Google AI](https://img.shields.io/badge/Powered_by-Gemini_2.0_Flash-EA4335?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js_14-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Cloud Run](https://img.shields.io/badge/Deployed-Google_Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud)](https://cloud.google.com/run)

> **Build with AI — Google Cloud Agentic Premier League | 1st Innings Challenge**

*4 AI Agents. 1 Orchestrator. Real-time collaboration. Zero passive viewing.*

</div>

---

## 🏆 What Makes This a Winner

This isn't a chatbot with a sports theme. This is a **production-deployed, multi-agent AI system** where four specialized agents collaborate through an orchestrator to transform a 2000-year-old Tamil sport into an interactive, intelligent, deeply personal experience — all powered by **Google Gemini 2.0 Flash** on **Google Cloud Run**.

| What Judges Look For | What We Built |
|---------------------|---------------|
| Multi-agent architecture | 4 domain-specific agents + orchestrator with phase-based activation |
| Google AI integration | Gemini 2.0 Flash with **real function calling** (tools execute, results feed back) |
| Agent reasoning | Visible chain-of-thought: `Thought → Tool Call → Action → Output` |
| Agent memory | Short-term (20 msgs) + persistent localStorage + cross-session user profile |
| Agent collaboration | Shared context bus, inter-agent awareness, orchestrator meta-decisions |
| Human-in-the-loop | Every cheer, prediction, trivia answer, story read feeds back into all agents |
| Production readiness | **Live on Cloud Run** with env-based secrets and graceful fallbacks |

---

## 🤖 The Agent Architecture

```
                          ┌─────────────────────────┐
                          │      👤 USER ACTIONS      │
                          │  Predict · Cheer · Learn  │
                          └────────────┬──────────────┘
                                       │ events + feedback
                                       ▼
                    ┌──────────────────────────────────────┐
                    │         ⚙️  ORCHESTRATOR ENGINE        │
                    │                                      │
                    │  ┌─────────┐  ┌──────────────────┐  │
                    │  │  Phase   │  │  Agent Activation │  │
                    │  │ Detector │→ │  & Priority Map   │  │
                    │  └─────────┘  └──────────────────┘  │
                    │                                      │
                    │  ┌──────────┐  ┌─────────────────┐  │
                    │  │  Shared  │  │  Meta-Decision   │  │
                    │  │ Context  │← │  Synthesizer     │  │
                    │  └──────────┘  └─────────────────┘  │
                    └──┬───────┬───────┬───────┬──────────┘
                       │       │       │       │
            ┌──────────┘       │       │       └──────────┐
            ▼                  ▼       ▼                  ▼
   ┌─────────────┐   ┌──────────────┐ ┌──────────┐  ┌────────────┐
   │  🎙️ COMMNT.  │   │  📊 PREDICT.  │ │ 📣 SENT.  │  │ 🎯 PERSON. │
   │             │   │              │ │          │  │            │
   │ Thiruvallu- │   │    Nandi     │ │  Koothu  │  │   Sangam   │
   │  var AI     │   │  Analytics   │ │    AI    │  │     AI     │
   │             │   │              │ │          │  │            │
   │ T=0.9       │   │ T=0.4        │ │ T=0.7    │  │ T=0.5      │
   │ Cultural    │   │ Statistical  │ │ Crowd    │  │ Behavioral │
   │ narration   │   │ reasoning    │ │ dynamics │  │ adaptation │
   └──────┬──────┘   └──────┬───────┘ └────┬─────┘  └─────┬──────┘
          │                  │              │              │
          │    ┌─────────────┼──────────────┼──────────────┘
          │    │             │              │
          ▼    ▼             ▼              ▼
   ┌──────────────────────────────────────────────────────┐
   │            🧠 GEMINI 2.0 FLASH (Google AI)            │
   │                                                      │
   │   ┌────────────────┐    ┌─────────────────────────┐  │
   │   │ Function Calling│    │  Chain-of-Thought       │  │
   │   │                │    │  Reasoning               │  │
   │   │ assess_drama() │    │                         │  │
   │   │ calc_breed()   │    │  thought → tool_call →  │  │
   │   │ ref_history()  │    │  tool_result → action → │  │
   │   │ build_narrative│    │  output                 │  │
   │   │ analyze_fatigue│    │                         │  │
   │   └────────────────┘    └─────────────────────────┘  │
   └──────────────────────────────────────────────────────┘
```

### The Four Agents — Named After Tamil Heritage

| Agent | Identity | What It Does | Gemini Config |
|-------|----------|-------------|---------------|
| 🎙️ **Commentary** | *Thiruvalluvar AI* — Named after the great Tamil poet | Generates dramatic, bilingual (Tamil/English) live narration. References Sangam literature, breed history, arena traditions. | `temp=0.9`, creative |
| 📊 **Prediction** | *Nandi Analytics* — Named after the sacred bull | Calculates multi-factor odds using breed stats, aggression, fatigue, historical win rates. Shows full reasoning chain. | `temp=0.4`, analytical |
| 📣 **Sentiment** | *Koothu AI* — Named after Tamil street theatre | Monitors cheer frequency, crowd energy curves, engagement dips. Triggers dynamic events (Thunder Clap, Bull Chant, Naiyandi Melam). | `temp=0.7`, reactive |
| 🎯 **Personalization** | *Sangam AI* — Named after the golden age of Tamil literature | Tracks every user action across sessions. Adapts trivia difficulty, commentary depth, and suggests personal challenges. | `temp=0.5`, adaptive |

### How Agents Collaborate (Not Just Coexist)

```
Phase: pre_run
  → Prediction Agent: "Bull aggression 9/10 + Kangayam breed = 72% bull advantage"
  → Commentary Agent reads prediction → "Will anyone dare face this Kangayam thunder?!"
  → Personalization Agent: "User predicted bull_wins last 3 times → suggest tamer bet for 2x"

Phase: during_run  
  → Sentiment Agent: "Cheer rate 4.2/sec, energy at 87% → TRIGGER: Thunder Clap!"
  → Commentary Agent reads sentiment → "THE CROWD ERUPTS! Vaadi Vaasal shakes!"

Phase: post_run
  → All agents update shared context with result
  → Commentary: Celebrates or commiserates based on user's prediction
  → Personalization: Updates accuracy stats, adjusts next round's content
```

---

## 🔧 Gemini Function Calling (Real Tool Execution)

Agents don't just prompt Gemini — they use **function calling** where Gemini decides which tools to invoke, tools execute server-side, and results feed back into the response:

```typescript
// Gemini calls assess_drama_level() autonomously
// Tool executes with live game context
// Result feeds back into the agent's response

Tools available to agents:
├── assess_drama_level()      → Calculates tension from bull stats + crowd energy
├── reference_history()       → Fetches breed-specific historical facts  
├── build_narrative()         → Determines story arc position (opening/climax/finale)
├── calculate_breed_advantage() → Statistical breed modifier with explanation
└── analyze_fatigue()         → Round-based tamer fatigue impact
```

This is **not prompt engineering** — this is structured tool use where Gemini autonomously decides what information it needs.

---

## 🎯 The Problem We Solve

> *"Design a system that enhances how users experience live sporting events beyond passive viewing."*

**Jallikattu** is the perfect canvas:
- **2000+ years old** — mentioned in Sangam literature (3rd century BCE)
- **Each bull run lasts seconds** — perfect for micro-interactions between runs
- **Deeply cultural** — tied to Pongal, Tamil identity, and agricultural heritage  
- **Unpredictable** — animal behavior defies simple prediction (unlike cricket/football)
- **Millions watch online** — growing digital audience during Pongal season

We transform passive livestream watchers into **active participants** where AI agents make every second interactive, educational, and personal.

---

## ✨ Feature Map

### AI Agent Features
| Feature | Agent | How It Works |
|---------|-------|-------------|
| Live AI Commentary | 🎙️ Commentary | Gemini generates unique narration every round with Tamil phrases |
| Prediction Analytics | 📊 Prediction | Multi-factor analysis with visible 3-step reasoning chain |
| Crowd Events | 📣 Sentiment | Detects engagement peaks, triggers Thunder Clap / Bull Chant |
| Adaptive Content | 🎯 Personalization | Adjusts trivia difficulty, suggests challenges per user |
| Architecture Viz | All | Real-time diagram showing active agents and communication flow |
| Transparent AI | All | Users see: Thought → Tool Call → Action → Output |
| Agent Feedback | All | 👍/👎 per agent output, persisted for evaluation |

### Interactive Features
| Feature | Description |
|---------|-------------|
| Live Arena | Bull vs Tamer cards with breed, aggression, speed, success rate |
| Predictions | Lock in your call before each run, earn 100pts for correct |
| Crowd Energy | Cheer buttons feed into Sentiment Agent in real-time |
| Cultural Stories | Expandable heritage cards (reads tracked by Personalization) |
| Trivia Quizzes | Between-round quizzes, difficulty adapts to your knowledge |
| Leaderboard | Lifetime stats: sessions, accuracy, streak, high score |

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **AI Model** | Gemini 2.0 Flash | Latest, fastest, supports function calling |
| **AI SDK** | `@google/generative-ai` | Official Google AI SDK |
| **Agent Framework** | Custom TypeScript | Purpose-built orchestrator with phase logic |
| **Frontend** | Next.js 14 (App Router) | Server components + API routes in one |
| **Styling** | Tailwind CSS + custom theme | Saffron/temple/kolam cultural palette |
| **Persistence** | localStorage | Cross-session user profiles and agent memory |
| **Deployment** | Google Cloud Run | Serverless, auto-scaling, pay-per-use |
| **Container** | Docker (multi-stage) | Optimized 150MB production image |

---

## 🚀 Quick Start

### Run Locally

```bash
git clone https://github.com/gowtham66867/jallikattu_APL.git
cd jallikattu_APL

npm install

# Add your Gemini API key (optional — works without it too)
cp .env.local.example .env.local
# Edit: GEMINI_API_KEY=your_key_here

npm run dev
```

Open **http://localhost:3000**

### Get a Gemini API Key (Free)

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Paste into `.env.local`

> **Two modes**: With key = dynamic Gemini responses. Without key = intelligent rule-based fallbacks. Both fully functional.

---

## ☁️ Cloud Run Deployment

**Live at**: [https://jallikattu-live-1027882324647.us-central1.run.app](https://jallikattu-live-1027882324647.us-central1.run.app)

```bash
# Deploy to Cloud Run (one command)
gcloud run deploy jallikattu-live \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_key" \
  --port 8080 \
  --memory 512Mi
```

### Production Architecture on Google Cloud

```
┌────────────────────────────────────────────────────────┐
│                   Google Cloud Run                      │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Next.js 14 Server                    │  │
│  │                                                  │  │
│  │  /api/agents/orchestrate ←── Agent API Route     │  │
│  │       │                                          │  │
│  │       ├── Orchestrator                           │  │
│  │       │    ├── Commentary Agent ──┐              │  │
│  │       │    ├── Prediction Agent ──┤              │  │
│  │       │    ├── Sentiment Agent  ──┼── Gemini API │  │
│  │       │    └── Personal. Agent  ──┘              │  │
│  │       │                                          │  │
│  │  / ←── React SSR + Client Hydration              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Port 8080 │ 512MB │ us-central1 │ Auto-scaling        │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Gemini 2.0 Flash API  │
              │  (Function Calling)    │
              └───────────────────────┘
```

---

## 🏗️ Project Structure

```
jallikattu-live/
├── src/
│   ├── app/
│   │   ├── api/agents/orchestrate/
│   │   │   └── route.ts              # POST endpoint — orchestrates all 4 agents
│   │   ├── page.tsx                   # Main app — state, agent calls, UI integration  
│   │   ├── layout.tsx                 # Root layout with cultural theme
│   │   └── globals.css                # Tailwind + custom animations + glow effects
│   │
│   ├── components/
│   │   ├── AgentPanel.tsx             # Agent outputs, reasoning, tool calls, feedback
│   │   ├── AgentArchitecture.tsx      # Live architecture diagram with phase highlighting
│   │   ├── AgentFeedback.tsx          # 👍/👎 evaluation per agent output
│   │   ├── LiveArena.tsx              # Bull vs Tamer matchup cards
│   │   ├── PredictionPanel.tsx        # User prediction interface
│   │   ├── CrowdEnergy.tsx            # Interactive cheering (feeds sentiment agent)
│   │   ├── TriviaModal.tsx            # Cultural quiz between rounds
│   │   ├── CulturalStories.tsx        # Expandable heritage content
│   │   ├── Leaderboard.tsx            # Rankings + lifetime persistent stats
│   │   └── Header.tsx                 # Score + live indicator
│   │
│   └── lib/
│       ├── agents/
│       │   ├── types.ts               # Full type system (AgentMessage, Memory, Profile...)
│       │   ├── baseAgent.ts           # Abstract base — Gemini integration + function calling
│       │   ├── tools.ts               # 5 executable tools + Gemini function declarations
│       │   ├── commentaryAgent.ts     # 🎙️ Thiruvalluvar AI
│       │   ├── predictionAgent.ts     # 📊 Nandi Analytics  
│       │   ├── sentimentAgent.ts      # 📣 Koothu AI
│       │   ├── personalizationAgent.ts# 🎯 Sangam AI
│       │   ├── orchestrator.ts        # Phase-based multi-agent coordinator
│       │   ├── persistentMemory.ts    # localStorage persistence layer
│       │   └── index.ts               # Barrel exports
│       └── gameData.ts                # Bulls, tamers, trivia, round generation
│
├── Dockerfile                         # Multi-stage Docker build for Cloud Run
├── .dockerignore
├── .env.local.example                 # Template for GEMINI_API_KEY
├── .gitignore
├── next.config.js                     # Standalone output for Docker
├── tailwind.config.ts                 # Cultural color palette
├── package.json
└── README.md                          # You are here
```

---

## 📊 Agent Evaluation Scorecard

| Criteria | Implementation | Evidence |
|----------|---------------|----------|
| **Multi-agent system** | 4 specialized agents + orchestrator | `commentaryAgent.ts`, `predictionAgent.ts`, `sentimentAgent.ts`, `personalizationAgent.ts`, `orchestrator.ts` |
| **Google Gemini integration** | Gemini 2.0 Flash via official SDK | `baseAgent.ts` line 32: `model: 'gemini-2.0-flash'` |
| **Function calling (tools)** | 5 tools with real execution + result feedback | `tools.ts`: `assess_drama_level`, `calculate_breed_advantage`, `reference_history`, `build_narrative`, `analyze_fatigue` |
| **Chain-of-thought reasoning** | Visible in UI: Thought → Tool → Action → Output | `AgentPanel.tsx` renders `agent.thought`, `agent.action`, `agent.toolCalls` |
| **Agent memory** | Short-term (20 msgs) + persistent localStorage | `baseAgent.ts` memory management + `persistentMemory.ts` |
| **Inter-agent communication** | Shared context bus through orchestrator | `orchestrator.ts`: `SharedContext` passed to all agents |
| **Human-in-the-loop** | Every user action feeds into agent context | `page.tsx`: predictions, cheers, trivia all call `/api/agents/orchestrate` |
| **Agent feedback/evaluation** | 👍/👎 per agent, persisted | `AgentFeedback.tsx` + `persistentMemory.ts` |
| **Phase-based orchestration** | Different agents activate per game phase | `orchestrator.ts`: `pre_run`, `during_run`, `post_run`, `between_rounds` |
| **Adaptive behavior** | Personalization agent changes per user | `personalizationAgent.ts`: tracks accuracy, engagement, knowledge level |
| **Graceful degradation** | Full fallback system without API key | Every agent has `getFallbackResponse()` |
| **Deployed on GCP** | Cloud Run, us-central1 | `https://jallikattu-live-1027882324647.us-central1.run.app` |
| **Transparency** | Architecture visualizer + reasoning panel | `AgentArchitecture.tsx` + `AgentPanel.tsx` with expandable thoughts |
| **Domain expertise** | Deep Jallikattu cultural knowledge | Breed stats, Tamil phrases, Sangam references, festival context |
| **Persistence** | Cross-session stats, high scores, streaks | `persistentMemory.ts`: `SessionStats`, `UserProfile`, `AgentFeedback` |

---

## 🎪 The User Journey

```
ROUND 1                          ROUND 3                         ROUND 6
────────                         ────────                        ────────
"Welcome to Alanganallur!"       "User loves bull predictions"   "GRAND FINALE!"
                                                                 
📊 Prediction odds appear        🎯 Personalization kicks in     🎙️ Commentary at max drama
User makes first prediction      Harder trivia suggested          📣 Crowd at 95% energy
🎙️ Cultural commentary           Commentary gets deeper           📊 "Season's most dangerous
📣 Crowd energy builds            Underdog challenge offered           Kangayam vs elite tamer"
                                                                 🎯 "You predicted 5 of 6!"
        │                               │                               │
        ▼                               ▼                               ▼
   Agent memory                  Agent adaptation              Agent collaboration
   starts building               becomes visible               at its peak
```

---

## 🌍 Why Jallikattu?

Jallikattu isn't just a sport. It's a **2000-year-old cultural institution** that:

- Is mentioned in **Sangam literature** (3rd century BCE) — among the oldest in the world
- Celebrates the sacred bond between **Tamil farmers and their bulls**
- Happens during **Pongal** — Tamil Nadu's harvest festival
- Draws **millions of online viewers** every January
- Sparked one of India's largest **peaceful protests** in 2017 (Marina Beach, Chennai)

> *We chose Jallikattu because it combines unpredictable action (perfect for AI prediction), deep culture (perfect for AI narration), and passionate crowds (perfect for AI sentiment analysis).*

---

<div align="center">

### Built with ❤️ for Tamil Heritage and AI Innovation

**Google Cloud Build with AI Hackathon — Agentic Premier League**

*Four agents. One orchestrator. Two thousand years of tradition. Infinite possibilities.*

🐂 🎙️ 📊 📣 🎯 ⚙️ 🧠

</div>
