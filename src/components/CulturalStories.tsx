'use client'

import { useState } from 'react'

const stories = [
  {
    id: 1,
    title: 'Origins of Jallikattu',
    era: '3rd Century BCE',
    content: 'Jallikattu finds its earliest mention in Sangam literature. Cave paintings in Madurai dating back over 2,000 years depict men holding bulls. The word "Jallikattu" comes from "salli" (coins) and "kattu" (tied) — coins were tied to the bull\'s horns as prizes.',
    icon: '📜',
    tag: 'History',
  },
  {
    id: 2,
    title: 'The Vaadi Vaasal',
    era: 'Traditional',
    content: 'The "Vaadi Vaasal" is the narrow gate through which bulls enter the arena. It\'s a moment of peak tension — the crowd goes silent, then erupts as the bull charges through. Only the bravest tamers position themselves directly at the gate.',
    icon: '🚪',
    tag: 'Arena',
  },
  {
    id: 3,
    title: 'Kangayam Bulls',
    era: 'Native Breeds',
    content: 'The Kangayam breed from Erode district is the most prized Jallikattu bull. Known for their muscular build, sharp horns, and fierce temperament, a champion Kangayam bull can be worth lakhs. Owners pamper them with special diets of jaggery, eggs, and butter.',
    icon: '🐂',
    tag: 'Bulls',
  },
  {
    id: 4,
    title: 'Pongal Connection',
    era: 'Festival',
    content: 'Jallikattu is held on Mattu Pongal (the third day of the Pongal harvest festival). It\'s a celebration of the bond between farmers and their cattle. The event thanks the bulls for their year-long service in agriculture.',
    icon: '🌾',
    tag: 'Culture',
  },
  {
    id: 5,
    title: 'The 2017 Movement',
    era: 'Modern',
    content: 'In January 2017, millions gathered at Marina Beach, Chennai in one of India\'s largest peaceful protests to save Jallikattu from a ban. The "Jallikattu Uprising" became a symbol of Tamil cultural identity and led to legislative amendments preserving the sport.',
    icon: '✊',
    tag: 'Modern',
  },
  {
    id: 6,
    title: 'Rules & Safety',
    era: 'Regulation',
    content: 'Modern Jallikattu has strict rules: bulls are inspected for drugs, participants must be sober and over 21. The tamer must hold the bull\'s hump and run with it for 15-20 meters. No ropes, sticks, or sharp objects allowed. Medical teams stand by at every event.',
    icon: '📋',
    tag: 'Rules',
  },
]

export default function CulturalStories() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold text-gradient">Discover Jallikattu Heritage</h2>
        <p className="text-xs text-white/50 mt-1">Learn about the 2000+ year old tradition while you watch</p>
      </div>

      {/* Story Cards */}
      {stories.map((story) => (
        <div
          key={story.id}
          onClick={() => setExpanded(expanded === story.id ? null : story.id)}
          className="glass rounded-2xl p-4 cursor-pointer transition-all hover:border-saffron/30 active:scale-[0.98]"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{story.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{story.title}</h3>
                <span className="text-xs bg-saffron/20 text-saffron px-2 py-0.5 rounded-full">{story.tag}</span>
              </div>
              <p className="text-xs text-white/40 mt-0.5">{story.era}</p>
              {expanded === story.id && (
                <p className="text-sm text-white/70 mt-3 leading-relaxed">{story.content}</p>
              )}
            </div>
            <span className={`text-white/30 transition-transform ${expanded === story.id ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>
      ))}

      {/* Fun Fact */}
      <div className="glass rounded-2xl p-4 border border-pongal/20 bg-pongal/5">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="text-sm font-bold text-pongal">Did You Know?</h3>
            <p className="text-xs text-white/60 mt-1">
              A single Jallikattu event can feature over 700 bulls and 500+ tamers. 
              The biggest events at Alanganallur attract crowds of over 30,000 spectators!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
