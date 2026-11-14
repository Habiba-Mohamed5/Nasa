import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ShieldCheck, Heart, Radio, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-30 mt-auto border-t border-[rgba(180,210,235,0.14)] bg-[#07111F]/90 backdrop-blur-md px-6 sm:px-10 lg:px-14 py-8 select-none text-xs text-[#98A7BD] font-sans-clean">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: Brand & Overview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center">
              <span className="font-titan text-2xl tracking-tight text-[#F4F7FC] leading-none">4</span>
              <div className="relative w-4 h-4 flex items-center justify-center mx-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F4F7FC] shadow-[0_0_10px_rgba(122,215,234,0.8)]" />
                <div className="absolute w-5 h-2 border-[1.5px] border-[#7AD7EA] rounded-full rotate-[-26deg]" />
              </div>
              <span className="font-titan text-2xl tracking-tight text-[#F4F7FC] leading-none">4</span>
            </div>
            <span className="h-5 w-[1px] bg-gradient-to-b from-transparent via-[#7AD7EA]/40 to-transparent mx-0.5" />
            <span className="font-oxanium font-bold text-xs tracking-[0.32em] text-[#7AD7EA] uppercase leading-none">
              IDEAS
            </span>
          </div>
          <p className="text-[11px] text-[#C7D2E3] leading-relaxed">
            Autonomous Deep Space Medical Platform & Clinical Decision Support System (CDSS) for long-duration crewed missions to Mars.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2 py-0.5 rounded-full bg-[#7AD7EA]/15 text-[#7AD7EA] text-[9px] font-mono-tech border border-[#7AD7EA]/30">
              NASA SPACE APPS 2026
            </span>
            <span className="text-[9px] text-[#98A7BD] font-mono-tech">
              NASA-STD-3001
            </span>
          </div>
        </div>

        {/* Col 2: Platform Navigation */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#F4F7FC] uppercase tracking-wider font-sans">
            PLATFORM
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <Link to="/" className="text-[#C7D2E3] hover:text-[#7AD7EA] transition-colors">Home Landing</Link>
            </li>
            <li>
              <Link to="/about" className="text-[#C7D2E3] hover:text-[#7AD7EA] transition-colors">About AstroVitals</Link>
            </li>
            <li>
              <Link to="/features" className="text-[#C7D2E3] hover:text-[#7AD7EA] transition-colors">Clinical Features</Link>
            </li>
            <li>
              <Link to="/ai-identity" className="text-[#C7D2E3] hover:text-[#7AD7EA] transition-colors">AURA AI Flight Surgeon</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Operations & Science */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#F4F7FC] uppercase tracking-wider font-sans">
            DEEP SPACE OPS
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <Link to="/how-it-works" className="text-[#C7D2E3] hover:text-[#7AD7EA] transition-colors">How It Works</Link>
            </li>
            <li>
              <Link to="/workspace" className="text-[#C7D2E3] hover:text-[#7AD7EA] transition-colors">Mission Control Workspace</Link>
            </li>
            <li>
              <Link to="/planets" className="text-[#C7D2E3] hover:text-[#7AD7EA] transition-colors">Celestial Targets (Moon, Sun, Mars)</Link>
            </li>
            <li>
              <Link to="/contact" className="text-[#C7D2E3] hover:text-[#7AD7EA] transition-colors">DSN Uplink & Contact</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: NASA References & Evidence */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#F4F7FC] uppercase tracking-wider font-sans">
            DATA ARCHIVES
          </h4>
          <p className="text-[10px] text-[#98A7BD] leading-relaxed">
            Validated against NASA Life Sciences Data Archive (LSDA), Open Science Data Repository (OSDR), and Human Research Program (HRP) Evidence Reports.
          </p>
          <div className="pt-1 flex items-center gap-2 text-[10px] text-[#7AD7EA] font-mono-tech">
            <Radio size={12} className="animate-pulse" />
            <span>DEEP SPACE TELEMETRY ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[rgba(180,210,235,0.08)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono-tech">
        <span className="text-[#98A7BD]">© 2026 ASTROVITALS • ARTEMIS VII MARS TRANSIT MISSION</span>
        <div className="flex items-center gap-4 text-[#98A7BD]">
          <span>ORION / STARSHIP FLIGHT SURGEON CORE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        </div>
      </div>
    </footer>
  );
}
