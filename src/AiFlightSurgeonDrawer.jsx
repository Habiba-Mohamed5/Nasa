import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, X, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import { NASA_REFERENCES } from './data/nasaKnowledgeBase';

export default function AiFlightSurgeonDrawer({ isOpen, onClose, telemetry, isCommBlackout }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Greetings, Commander. I am your onboard Autonomous AI Flight Surgeon, running offline on the spacecraft's local neural core. I continuously evaluate your telemetry against NASA-STD-3001 and the Human Research Program roadmap. How may I assist your mission readiness today?`,
      citations: ['NASA-STD-3001 Vol 1', 'HRP-BHP-2026']
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const quickPrompts = [
    {
      title: "Why is my resting HRV dropping?",
      query: "Why is my resting HRV dropping on Mission Day " + telemetry.missionDay + "?"
    },
    {
      title: "Evaluate Cardiovascular Drift",
      query: "Compare my cardiovascular drift against NASA HRP thresholds."
    },
    {
      title: "Generate ARED & Hydration Adjustment",
      query: "Generate today's ARED exercise & hydration adjustment based on my current bone retention."
    }
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiResponse = '';
      let citations = [];

      const q = query.toLowerCase();
      if (q.includes('hrv') || q.includes('variability') || q.includes('dropping')) {
        aiResponse = `Telemetry analysis at Mission Day ${telemetry.missionDay}: Your resting HRV is currently ${telemetry.currentHRV} ms (a ${telemetry.hrvDriftPct}% drift from your individual baseline of ${telemetry.baseline.restingHRV} ms). In microgravity, cephalad fluid shift (~2L toward head and torso) and absence of hydrostatic arterial loading dampens baroreceptor vagal tone. With a comm delay of ${telemetry.commDelayMinutes} minutes to Houston, autonomous intervention is recommended: increase CEVIS aerobic ergometer training by 20 minutes at 75% VO2 max and ingest 750ml isotonic electrolyte solution.`;
        citations = ['NASA-STD-3001 Vol 1', 'HRP-47052'];
      } else if (q.includes('cardio') || q.includes('threshold') || q.includes('heart')) {
        aiResponse = `Cardiovascular Evaluation: Heart Rate is ${telemetry.currentHR} BPM (pre-flight baseline: ${telemetry.baseline.restingHR} BPM), Blood Pressure is ${telemetry.currentSystolic}/${telemetry.currentDiastolic} mmHg. According to NASA-STD-3001 threshold rules, a drift exceeding 15% triggers an autonomous Tier 1 alert. We have queued a countermeasure protocol to counteract cardiac muscle unloading and plasma volume contraction.`;
        citations = ['NASA-STD-3001 Rev B', 'LSDA-ISS-CV'];
      } else if (q.includes('ared') || q.includes('bone') || q.includes('hydration') || q.includes('exercise')) {
        aiResponse = `Skeletal & Metabolic Prescription: Current BMD retention is ${telemetry.bmdRetention}% (cumulative loss: -${telemetry.bmdLoss}%). In accordance with LSDA-BMD-ISS-04 protocols, resistive loading on ARED deadlift and squat is increased by 12.5%. Prescribed daily fluid intake is adjusted upward by 600ml to dilute elevated urinary calcium and prevent renal nephrolithiasis.`;
        citations = ['LSDA-BMD-ISS-04', 'NASA HRP Bone Evidence'];
      } else {
        aiResponse = `Autonomous Flight Surgeon Diagnostic (Day ${telemetry.missionDay}): Overall Crew Vitality Index is ${telemetry.overallHealthIndex}/100 with active status ${telemetry.riskLevel}. Cephalad fluid index is at ${telemetry.fluidShiftIndex}%. Since Deep Space Comm-Lag is ${telemetry.commDelayMinutes} min (One-Way) and Blackout mode is ${isCommBlackout ? 'ACTIVE' : 'STANDBY'}, all interventions are executing through local deterministic heuristics derived from NASA HRP datasets.`;
        citations = ['NASA-STD-3001 Vol 1', 'NASA IMM Model'];
      }

      setMessages([...newMessages, { sender: 'ai', text: aiResponse, citations }]);
      setIsGenerating(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/95 border-l border-cyan-500/30 backdrop-blur-2xl shadow-2xl flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white tracking-wide">AstroVitals AI Surgeon</h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">
              {isCommBlackout ? 'OFFLINE SECURE LOCAL CORE' : 'EDGE INFERENCE ENGINE'}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/40">
        <div className="text-[10px] text-slate-400 font-mono mb-2 flex items-center gap-1">
          <Sparkles size={11} className="text-cyan-400" />
          CLINICAL QUICK INQUIRIES
        </div>
        <div className="flex flex-col gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="text-left px-2.5 py-1.5 rounded-lg bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700/60 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition-all flex items-center justify-between group"
            >
              <span className="truncate">{p.title}</span>
              <ArrowRight size={11} className="text-slate-500 group-hover:text-cyan-400 opacity-60 group-hover:opacity-100 transition-all ml-1 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
              }`}
            >
              <p className="leading-relaxed text-[11px]">{msg.text}</p>
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
                  {msg.citations.map((cite, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono"
                    >
                      {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-500 mt-1 font-mono px-1">
              {msg.sender === 'user' ? 'Commander Alex Vance' : 'Autonomous Flight Surgeon AI'}
            </span>
          </div>
        ))}
        {isGenerating && (
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs p-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Evaluating physiological telemetry against NASA-STD-3001...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask flight surgeon or query NASA standards..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isGenerating}
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
