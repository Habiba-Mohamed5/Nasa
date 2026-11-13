import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Bot, Volume2, VolumeX, Maximize2, Menu, X, Activity, ShieldAlert, Sparkles } from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudio';

export default function Navbar({ isMuted, toggleSound, toggleFullScreen, onOpenAiDrawer, onOpenRisksModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'FEATURES', path: '/features' },
    { name: 'AI IDENTITY', path: '/ai-identity' },
    { name: 'HOW IT WORKS', path: '/how-it-works' },
    { name: 'WORKSPACE', path: '/workspace' },
    { name: 'PLANETS', path: '/planets' },
    { name: 'CONTACT', path: '/contact' }
  ];

  return (
    <header className="relative z-40 px-6 sm:px-10 lg:px-12 pt-6 sm:pt-7 flex items-center justify-between shrink-0 select-none">
      {/* 1. Logo: ASTR🪐NAUT (Exact Dribbble Style with orbital ring on O) */}
      <Link
        to="/"
        onClick={() => spaceAudio.playChirp()}
        className="flex items-center gap-1.5 cursor-pointer group shrink-0"
      >
        <span className="font-titan text-lg sm:text-xl tracking-wider text-[#EBEBEB]">ASTR</span>
        <div className="relative w-4 h-4 flex items-center justify-center mx-0.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EBEBEB] group-hover:bg-[#E4783B] transition-colors" />
          <div className="absolute w-4.5 h-1.5 border border-[#EBEBEB] group-hover:border-[#E4783B] rounded-full rotate-[-26deg] transition-colors" />
        </div>
        <span className="font-titan text-lg sm:text-xl tracking-wider text-[#EBEBEB]">NAUT</span>
      </Link>

      {/* 2. Desktop Navigation Links (Refined Editorial Uppercase Sans) */}
      <nav className="hidden xl:flex items-center gap-6 lg:gap-8 text-[11px] font-semibold tracking-[0.2em] uppercase">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => spaceAudio.playChirp()}
            className={({ isActive }) =>
              `transition-all py-1 relative ${
                isActive
                  ? 'text-[#EBEBEB] font-bold after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[#E4783B]'
                  : 'text-[#ACACAC] hover:text-[#EBEBEB]'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* 3. Right Quick Tools Cluster */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Launch AURA AI Surgeon */}
        <button
          onClick={() => {
            spaceAudio.playChirp();
            if (onOpenAiDrawer) onOpenAiDrawer();
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E4783B]/15 hover:bg-[#E4783B]/25 text-[#E4783B] border border-[#E4783B]/40 font-mono-tech text-[10px] font-bold transition-all shadow-[0_0_15px_rgba(228,120,59,0.2)] hover:scale-105"
        >
          <Bot size={13} />
          <span>AURA AI</span>
        </button>

        {/* Audio Mute Switch */}
        <button
          onClick={toggleSound}
          className={`p-1.5 sm:p-2 rounded-full border text-xs transition-all ${
            !isMuted
              ? 'bg-[#E4783B]/15 text-[#E4783B] border-[#E4783B]/30'
              : 'bg-[#171311] text-[#808080] border-white/10'
          }`}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {!isMuted ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullScreen}
          className="p-1.5 sm:p-2 rounded-full bg-[#171311] text-[#ACACAC] hover:text-[#EBEBEB] border border-white/10 transition-all hidden md:block"
          title="Toggle Fullscreen"
        >
          <Maximize2 size={15} />
        </button>

        {/* Mobile Hamburger Menu Toggle (Visible on < xl screens) */}
        <button
          onClick={() => {
            spaceAudio.playChirp();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="xl:hidden p-2 rounded-xl bg-[#171311] text-[#EBEBEB] border border-white/10"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* 4. Mobile Flyout Menu (Matching Cinematic Aesthetic) */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-4 top-20 z-50 p-5 rounded-3xl bg-[#13100E]/95 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 font-sans-clean">
          <div className="text-[10px] text-[#808080] font-mono-tech uppercase pb-2 border-b border-white/5">
            ASTROVITALS NAVIGATION MENU
          </div>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  spaceAudio.playChirp();
                  setMobileMenuOpen(false);
                }}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#E4783B]/20 text-[#EBEBEB] border border-[#E4783B]/40'
                      : 'text-[#ACACAC] hover:text-[#EBEBEB] hover:bg-white/5'
                  }`
                }
              >
                <span>{item.name}</span>
                {location.pathname === item.path && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E4783B]" />
                )}
              </NavLink>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center gap-2">
            <button
              onClick={() => {
                spaceAudio.playChirp();
                setMobileMenuOpen(false);
                if (onOpenAiDrawer) onOpenAiDrawer();
              }}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#A64D2D] text-[#0D0B0A] font-bold text-xs flex items-center justify-center gap-2"
            >
              <Bot size={14} />
              <span>LAUNCH AURA AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
