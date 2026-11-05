import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, FileText, Database, CheckCircle2 } from 'lucide-react';

export default function NasaCitationModal({ reference, isOpen, onClose }) {
  if (!isOpen || !reference) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-left select-none overflow-hidden"
        >
          {/* Subtle Cybernetic Grid overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  {reference.documentCode}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {reference.id}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{reference.title}</h2>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-4 my-4 text-xs">
            {/* Archive & Source */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">SOURCE ARCHIVE</span>
                <span className="text-slate-200 font-semibold">{reference.sourceArchive}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">EVIDENCE RATING</span>
                <span className="text-emerald-400 font-semibold">{reference.nasaRecommendationLevel}</span>
              </div>
            </div>

            {/* Scientific Evidence Summary */}
            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
                <FileText size={12} />
                NASA Human Research Program Evidence Summary
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">{reference.evidenceSummary}</p>
            </div>

            {/* Microgravity Drift & Thresholds */}
            <div className="space-y-2 p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80 font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">MICROGRAVITY DRIFT RATE</span>
                <p className="text-slate-300 text-[11px]">{reference.microgravityDriftRate}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-amber-400 text-[10px] block">FLIGHT SURGEON THRESHOLD RULE</span>
                <p className="text-amber-200/90 text-[11px]">{reference.thresholdRule}</p>
              </div>
            </div>

            {/* Autonomous NASA Protocol */}
            <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
                <ShieldCheck size={13} className="text-cyan-400" />
                Autonomous Mission Countermeasure Protocol
              </span>
              <p className="text-slate-200 leading-relaxed text-[11px] font-mono">{reference.autonomousProtocol}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono">
              Validated against NASA Spaceflight Human-System Standard (NASA-STD-3001)
            </span>
            <a
              href={reference.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all shadow-sm"
            >
              <span>Verify at NASA HRP</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
