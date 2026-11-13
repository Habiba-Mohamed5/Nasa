import React, { useState } from 'react';
import { Radio, Send, CheckCircle2, ShieldCheck, Database, ExternalLink, AlertTriangle } from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudio';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    callsign: '',
    role: 'Flight Surgeon / Clinical Researcher',
    topic: 'Telemetry Inquiry',
    message: ''
  });
  const [status, setStatus] = useState({ state: 'idle', message: '', txHash: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.callsign.trim() || !formData.message.trim()) {
      setStatus({ state: 'error', message: 'Please provide both your callsign/name and transmission message.' });
      return;
    }

    spaceAudio.playChirp();
    setStatus({ state: 'sending', message: 'Encoding 50KB DSN Telemetry Packet...' });

    setTimeout(() => {
      const fakeTxHash = 'DSN-2026-TX-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      setStatus({
        state: 'success',
        message: 'Transmission successfully packaged and dispatched into Deep Space Network queue!',
        txHash: fakeTxHash
      });
      spaceAudio.playBeep(1800, 0.15);
      setFormData({ callsign: '', role: 'Flight Surgeon / Clinical Researcher', topic: 'Telemetry Inquiry', message: '' });
    }, 900);
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 sm:px-8 py-4">
      {/* 1. Header Banner */}
      <section className="p-8 sm:p-10 rounded-[32px] cinematic-card-bg border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-widest block">
            DEEP SPACE NETWORK • MISSION UPLINK
          </span>
          <h1 className="font-titan text-3xl sm:text-4xl text-[#EBEBEB] uppercase leading-tight tracking-wide">
            GROUND CONTROL & MISSION CONTACT
          </h1>
          <p className="text-xs sm:text-sm text-[#ACACAC] leading-relaxed max-w-2xl">
            Dispatch queries, evaluate the NASA Space Apps submission, or transmit clinical advisory packets to the AstroVitals project team and autonomous avionics core.
          </p>
        </div>
      </section>

      {/* 2. Contact Form & Network Status */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Transmission Form */}
        <div className="md:col-span-7 p-6 sm:p-8 rounded-[28px] bg-[#171311] border border-white/[0.08] shadow-xl">
          <h2 className="font-titan text-lg text-[#EBEBEB] uppercase mb-4 tracking-wide">
            DISPATCH MISSION TELEMETRY PACKET
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-[10px] font-mono-tech text-[#808080] uppercase block mb-1">
                CALLSIGN / NAME *
              </label>
              <input
                type="text"
                value={formData.callsign}
                onChange={(e) => setFormData({ ...formData, callsign: e.target.value })}
                placeholder="e.g. Dr. Sarah Chen / Space Apps Evaluator"
                className="w-full bg-[#0D0B0A] border border-white/10 focus:border-[#E4783B] rounded-xl px-4 py-2.5 text-xs text-[#EBEBEB] placeholder-[#808080] outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono-tech text-[#808080] uppercase block mb-1">
                  ROLE / AFFILIATION
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-white/10 focus:border-[#E4783B] rounded-xl px-3 py-2.5 text-xs text-[#EBEBEB] outline-none"
                >
                  <option value="Flight Surgeon / Clinical Researcher">Flight Surgeon / Clinical</option>
                  <option value="NASA Space Apps Judge / Evaluator">Space Apps Evaluator</option>
                  <option value="Aerospace Software Engineer">Aerospace Software Engineer</option>
                  <option value="Biomedical Student / Public">Student / Enthusiast</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono-tech text-[#808080] uppercase block mb-1">
                  TRANSMISSION TOPIC
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full bg-[#0D0B0A] border border-white/10 focus:border-[#E4783B] rounded-xl px-3 py-2.5 text-xs text-[#EBEBEB] outline-none"
                >
                  <option value="Telemetry Inquiry">Telemetry Inquiry</option>
                  <option value="AURA AI Medical Logic">AURA AI Medical Logic</option>
                  <option value="Space Apps 2026 Feedback">Space Apps 2026 Feedback</option>
                  <option value="Dataset Integration (LSDA/OSDR)">Dataset Integration (LSDA)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono-tech text-[#808080] uppercase block mb-1">
                TRANSMISSION MESSAGE *
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter technical observations, evaluation notes, or clinical inquiries..."
                className="w-full bg-[#0D0B0A] border border-white/10 focus:border-[#E4783B] rounded-xl px-4 py-2.5 text-xs text-[#EBEBEB] placeholder-[#808080] outline-none transition-all resize-none"
              />
            </div>

            {status.state === 'error' && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            {status.state === 'success' && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 size={15} />
                  <span>{status.message}</span>
                </div>
                <div className="text-[10px] font-mono-tech text-emerald-400">
                  TRANSACTION HASH: <span className="underline">{status.txHash}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={status.state === 'sending'}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#A64D2D] hover:opacity-95 text-[#0D0B0A] font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(228,120,59,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={14} />
              <span>{status.state === 'sending' ? 'PACKAGING TRANSMISSION...' : 'TRANSMIT VIA DEEP SPACE NETWORK'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Mission Control Telemetry Specs */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-[28px] bg-[#171311] border border-white/[0.08] space-y-3.5">
            <div className="flex items-center gap-2 text-[#E4783B]">
              <Radio size={16} className="animate-pulse" />
              <h3 className="font-titan text-sm text-[#EBEBEB] uppercase">DSN FREQUENCY SPECS</h3>
            </div>

            <div className="space-y-2 text-xs font-mono-tech text-[#808080]">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>FREQUENCY BAND</span>
                <span className="text-[#EBEBEB]">Ka-Band (32 GHz)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>DSN GROUND SITES</span>
                <span className="text-[#EBEBEB]">Goldstone • Madrid • Canberra</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>PAYLOAD ENCRYPTION</span>
                <span className="text-[#EBEBEB]">AES-256-GCM (NASA-STD)</span>
              </div>
              <div className="flex justify-between">
                <span>SIMULATED LATENCY</span>
                <span className="text-[#E4783B]">0.1 to 22.4 Minutes</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[28px] bg-[#171311] border border-white/[0.08] space-y-3">
            <h3 className="font-titan text-sm text-[#EBEBEB] uppercase">PROJECT REPOSITORY & DATA</h3>
            <p className="text-[11px] text-[#ACACAC] leading-relaxed">
              Developed for the NASA Space Apps Challenge 2026. Codebase incorporates NASA Open Science Data Repository (OSDR) pipelines and Human Research Program evidentiary baselines.
            </p>
            <div className="pt-1 flex flex-col gap-2 text-xs text-[#E4783B] font-mono-tech">
              <a
                href="https://osdr.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between hover:underline p-2 rounded-lg bg-[#0D0B0A] border border-white/5"
              >
                <span>NASA Open Science Data (OSDR)</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="https://humanresearchroadmap.nasa.gov/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between hover:underline p-2 rounded-lg bg-[#0D0B0A] border border-white/5"
              >
                <span>NASA Human Research Roadmap</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
