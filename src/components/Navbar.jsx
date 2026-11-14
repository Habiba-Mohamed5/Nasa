import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Bot, Volume2, VolumeX, Maximize2, Menu, X,
  Activity, ShieldAlert, Sparkles, ChevronRight
} from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudio';

export default function Navbar({
  isMuted,
  toggleSound,
  toggleFullScreen,
  onOpenAiDrawer,
  onOpenRisksModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'HOME', path: '/', label: 'الرئيسية' },
    { name: 'ABOUT', path: '/about', label: 'عن المنصة' },
    { name: 'FEATURES', path: '/features', label: 'الميزات السريرية' },
    { name: 'AI IDENTITY', path: '/ai-identity', label: 'طبيب AURA المستقل' },
    { name: 'HOW IT WORKS', path: '/how-it-works', label: 'آلية العمل' },
    { name: 'WORKSPACE', path: '/workspace', label: 'قمرة التحكم' },
    { name: 'PLANETS', path: '/planets', label: 'الأجرام والمسارات' },
    { name: 'CONTACT', path: '/contact', label: 'الاتصال بالأرض' }
  ];

  // Lock body scroll when mobile menu is open to prevent awkward background scrolling
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  // Support closing mobile menu via Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="relative z-40 px-3.5 sm:px-6 lg:px-12 pt-3.5 sm:pt-6 flex items-center justify-between shrink-0 select-none">
      {/* 1. Logo: ASTR🪐NAUT (Exact Dribbble Style with orbital ring on O) */}
      <Link
        to="/"
        onClick={() => {
          spaceAudio.playChirp();
          setMobileMenuOpen(false);
        }}
        className="flex items-center gap-1.5 cursor-pointer group shrink-0 min-h-[44px] items-center"
        aria-label="AstroVitals Home"
      >
        <span className="font-titan text-base sm:text-lg lg:text-xl tracking-wider text-[#F4F7FC]">ASTR</span>
        <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center mx-0.5">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#F4F7FC] group-hover:bg-[#7AD7EA] transition-colors" />
          <div className="absolute w-4 sm:w-4.5 h-1.5 border border-[#F4F7FC] group-hover:border-[#7AD7EA] rounded-full rotate-[-26deg] transition-colors" />
        </div>
        <span className="font-titan text-base sm:text-lg lg:text-xl tracking-wider text-[#F4F7FC]">NAUT</span>
      </Link>

      {/* 2. Desktop Navigation Links (Visible on >= xl screens) */}
      <nav className="hidden xl:flex items-center gap-6 lg:gap-7 text-[11px] font-semibold tracking-[0.18em] uppercase">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => spaceAudio.playChirp()}
            className={({ isActive }) =>
              `transition-all py-1.5 relative ${
                isActive
                  ? 'text-[#F4F7FC] font-bold after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-[#7AD7EA] after:shadow-[0_0_8px_#7AD7EA]'
                  : 'text-[#C7D2E3] hover:text-[#F4F7FC]'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* 3. Right Quick Tools Cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Quick Launch AURA AI Surgeon */}
        <button
          onClick={() => {
            spaceAudio.playChirp();
            if (onOpenAiDrawer) onOpenAiDrawer();
          }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7AD7EA]/15 hover:bg-[#7AD7EA]/25 text-[#7AD7EA] border border-[#7AD7EA]/40 font-mono-tech text-[10px] font-bold transition-all shadow-[0_0_15px_rgba(122,215,234,0.2)] hover:scale-105 min-h-[36px]"
          aria-label="Launch AURA AI Surgeon Drawer"
        >
          <Bot size={13} />
          <span>AURA AI</span>
        </button>

        {/* Audio Mute Switch (Touch-friendly minimum 40px) */}
        <button
          onClick={toggleSound}
          className={`w-10 h-10 rounded-full border text-xs transition-all flex items-center justify-center ${
            !isMuted
              ? 'bg-[#7AD7EA]/15 text-[#7AD7EA] border-[#7AD7EA]/40 shadow-[0_0_12px_rgba(122,215,234,0.2)]'
              : 'bg-[#132238] text-[#98A7BD] border-[rgba(180,210,235,0.14)]'
          }`}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {!isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Fullscreen Toggle (Desktop only) */}
        <button
          onClick={toggleFullScreen}
          className="w-10 h-10 rounded-full bg-[#132238] text-[#C7D2E3] hover:text-[#F4F7FC] border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/30 transition-all hidden lg:flex items-center justify-center"
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen"
        >
          <Maximize2 size={15} />
        </button>

        {/* Mobile Hamburger Menu Toggle (Visible on < xl screens, min-h/w 44px for perfect touch accessibility) */}
        <button
          onClick={() => {
            spaceAudio.playChirp();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="xl:hidden w-11 h-11 rounded-xl bg-[#132238] text-[#F4F7FC] border border-[rgba(180,210,235,0.18)] flex items-center justify-center active:scale-95 transition-all shadow-lg hover:border-[#7AD7EA]/40"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} className="text-[#7AD7EA]" /> : <Menu size={20} />}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. FULL-SCREEN MOBILE OVERLAY NAVIGATION (Accessible & Touch-First)
      ───────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="xl:hidden fixed inset-0 z-50 bg-[#07111F]/98 backdrop-blur-2xl flex flex-col justify-between p-5 sm:p-7 overflow-y-auto animate-in fade-in duration-200"
        >
          {/* Top Bar inside Overlay */}
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(180,210,235,0.14)]">
            <div className="flex items-center gap-1.5">
              <span className="font-titan text-lg tracking-wider text-[#F4F7FC]">ASTR</span>
              <div className="relative w-3.5 h-3.5 flex items-center justify-center mx-0.5">
                <div className="w-2 h-2 rounded-full bg-[#F4F7FC]" />
                <div className="absolute w-4 h-1 border border-[#F4F7FC] rounded-full rotate-[-26deg]" />
              </div>
              <span className="font-titan text-lg tracking-wider text-[#F4F7FC]">NAUT</span>
            </div>

            <button
              onClick={() => {
                spaceAudio.playChirp();
                setMobileMenuOpen(false);
              }}
              className="w-11 h-11 rounded-full bg-[#132238] border border-[rgba(180,210,235,0.18)] text-[#F4F7FC] flex items-center justify-center hover:bg-[#182A44] transition-all"
              aria-label="Close menu"
            >
              <X size={20} className="text-[#7AD7EA]" />
            </button>
          </div>

          {/* Navigation Links Grid/List with Large Touch Targets (Min 48px) */}
          <nav className="flex-1 py-4 flex flex-col justify-center space-y-1.5 sm:space-y-2">
            <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-widest px-2 mb-1">
              MISSION FLIGHT DECK NAVIGATION
            </span>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    spaceAudio.playChirp();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full min-h-[48px] px-4 py-2.5 rounded-2xl flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-[#7AD7EA]/20 text-[#F4F7FC] border border-[#7AD7EA]/50 shadow-[0_0_20px_rgba(122,215,234,0.25)] font-bold'
                      : 'text-[#C7D2E3] hover:text-[#F4F7FC] hover:bg-white/5 active:bg-white/10 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#7AD7EA]' : 'bg-transparent'}`} />
                    <span className="text-sm sm:text-base font-sans tracking-wide uppercase">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#98A7BD] font-cairo">{item.label}</span>
                    <ChevronRight size={14} className={isActive ? 'text-[#7AD7EA]' : 'text-[#98A7BD]'} />
                  </div>
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Action Footer in Mobile Overlay */}
          <div className="pt-4 border-t border-[rgba(180,210,235,0.14)] flex flex-col gap-2.5">
            <button
              onClick={() => {
                spaceAudio.playChirp();
                setMobileMenuOpen(false);
                if (onOpenAiDrawer) onOpenAiDrawer();
              }}
              className="w-full min-h-[48px] py-3 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#d46a30] text-[#07111F] font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(228,120,59,0.35)] active:scale-95 transition-all"
            >
              <Bot size={16} />
              <span>LAUNCH AURA FLIGHT SURGEON</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#98A7BD] px-2 font-mono-tech">
              <span>NASA-STD-3001 VOL 1</span>
              <span>MISSION CONTROL 2026</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
