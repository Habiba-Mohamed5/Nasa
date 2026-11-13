import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudio';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 select-none">
      <div className="p-10 sm:p-14 rounded-[36px] cinematic-card-bg border border-white/[0.08] shadow-2xl text-center max-w-lg space-y-5">
        <span className="font-titan text-7xl sm:text-8xl text-[#E4783B] tracking-wider block drop-shadow-[0_0_30px_rgba(228,120,59,0.35)]">
          404
        </span>
        <h1 className="font-titan text-2xl text-[#EBEBEB] uppercase tracking-wide">
          TRAJECTORY OUT OF BOUNDS
        </h1>
        <p className="text-xs sm:text-sm text-[#ACACAC] leading-relaxed">
          The requested coordinate lies beyond the Artemis VII flight envelope. Re-orient navigation back to Mission Control.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            onClick={() => spaceAudio.playChirp()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#0D0B0A] font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(228,120,59,0.3)]"
          >
            <span>RETURN TO ORBITAL BASE</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
