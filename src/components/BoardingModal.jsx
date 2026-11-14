import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, User, ShieldCheck, ArrowRight, X, Sparkles, Compass } from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudio';

/**
 * BoardingModal — Interactive Spaceship 404 Onboarding Experience
 *
 * Implements:
 * - Commander Name personalization (optional, non-forced)
 * - Safe text rendering & localStorage persistence
 * - Cinematic, skippable boarding sequence into the 404 Cockpit
 * - Sound design integration (chimes, cabin hum, thruster burn)
 */
export default function BoardingModal({ isOpen, onClose, currentName, onNameUpdated }) {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState(currentName || '');
  const [step, setStep] = useState('input'); // 'input' | 'boarding' | 'ready'
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    setNameInput(currentName || '');
  }, [currentName]);

  // Clean, sanitized name
  const cleanName = nameInput.trim().replace(/[<>]/g, '').slice(0, 32);

  const handleStartBoarding = (useEnteredName = true) => {
    spaceAudio.playChirp();
    const finalName = useEnteredName && cleanName ? cleanName : 'Explorer';

    // Persist locally
    localStorage.setItem('spaceship_404_commander_name', finalName);
    if (onNameUpdated) onNameUpdated(finalName);

    setStep('boarding');

    // Start interior cabin hum & thruster burn
    spaceAudio.startCabinAmbience();
    spaceAudio.playThrusterBurn(2.0);

    // Short, skippable 3-second sequence
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        spaceAudio.playDockingChime();
        setStep('ready');
        setTimeout(() => {
          onClose();
          navigate('/planets');
        }, 800);
      }
    }, 900);
  };

  const handleSkipAnimation = () => {
    spaceAudio.playDockingChime();
    onClose();
    navigate('/planets');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0D1728]/95 border border-[rgba(180,210,235,0.25)] shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_40px_rgba(122,215,234,0.15)] text-[#F4F7FC] space-y-6 select-none font-sans"
        >
          {/* Close Button */}
          {step === 'input' && (
            <button
              onClick={() => {
                spaceAudio.playBeep(800, 0.05);
                onClose();
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#132238] hover:bg-[#182A44] text-[#98A7BD] hover:text-[#F4F7FC] transition-colors"
              title="Close modal"
            >
              <X size={16} />
            </button>
          )}

          {/* Step 1: Input Welcome Form */}
          {step === 'input' && (
            <div className="space-y-6">
              {/* Header Badge */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7AD7EA]/15 border border-[#7AD7EA]/30 text-xs font-mono-tech text-[#7AD7EA] font-bold">
                  <Rocket size={13} />
                  <span>MISSION DEPARTURE // FLIGHT PROTOCOL</span>
                </div>
                <h2 className="font-titan text-2xl sm:text-3xl uppercase tracking-wide text-[#F4F7FC]">
                  WELCOME ABOARD 404
                </h2>
                <p className="text-xs sm:text-sm text-[#C7D2E3] italic border-l-2 border-[#7AD7EA]/50 pl-3 leading-relaxed">
                  "Every great mission begins with an explorer."
                </p>
              </div>

              {/* Name Prompt */}
              <div className="space-y-2.5">
                <label className="block text-xs font-mono-tech uppercase tracking-wider text-[#98A7BD]">
                  What should we call you, Commander?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7AD7EA]">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleStartBoarding(true);
                      }
                    }}
                    placeholder="Enter your name, e.g. Armstrong..."
                    maxLength={32}
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#132238]/90 border border-[rgba(180,210,235,0.20)] focus:border-[#7AD7EA] focus:outline-none focus:ring-2 focus:ring-[#7AD7EA]/20 text-sm text-[#F4F7FC] placeholder-[#98A7BD]/50 transition-all font-sans"
                  />
                </div>
                <span className="text-[10px] text-[#98A7BD] block">
                  * Optional. Your display name is stored locally on this device.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => handleStartBoarding(true)}
                  className="w-full py-3.5 px-6 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] font-bold text-xs sm:text-sm font-mono-tech tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(228,120,59,0.4)] hover:scale-[1.02] flex items-center justify-center gap-2 min-h-[46px]"
                >
                  <span>BEGIN MY JOURNEY</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => handleStartBoarding(false)}
                  className="w-full py-2.5 px-4 rounded-full bg-transparent hover:bg-white/5 text-[#98A7BD] hover:text-[#C7D2E3] text-xs font-mono-tech transition-colors text-center"
                >
                  Explore Without a Name →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Cinematic Boarding Sequence */}
          {step === 'boarding' && (
            <div className="py-8 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#7AD7EA]/20 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-[#182A44] border border-[#7AD7EA] flex items-center justify-center text-[#7AD7EA] shadow-[0_0_25px_rgba(122,215,234,0.4)]">
                  <Rocket size={26} className="animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-titan text-xl sm:text-2xl uppercase tracking-wide text-[#F4F7FC]">
                  BOARDING SPACESHIP 404...
                </h3>
                <p className="text-xs sm:text-sm text-[#7AD7EA] font-mono-tech">
                  {cleanName ? `Welcome aboard, Commander ${cleanName}.` : 'Welcome aboard, Explorer.'}
                </p>
                <p className="text-[11px] text-[#98A7BD] font-mono-tech">
                  Pressurizing cabin • Engaging navigation bridge in {countdown}s
                </p>
              </div>

              <button
                onClick={handleSkipAnimation}
                className="px-4 py-1.5 rounded-full bg-[#132238] hover:bg-[#182A44] border border-white/10 text-xs font-mono-tech text-[#C7D2E3] transition-colors"
              >
                Skip to Cockpit View ⏩
              </button>
            </div>
          )}

          {/* Step 3: Departure Ready */}
          {step === 'ready' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#7AD7EA]/20 border border-[#7AD7EA] flex items-center justify-center text-[#7AD7EA] shadow-[0_0_30px_rgba(122,215,234,0.5)]">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-titan text-xl text-[#F4F7FC] uppercase">
                  SYSTEMS NOMINAL. READY FOR DEPARTURE.
                </h3>
                <p className="text-xs text-[#7AD7EA] font-mono-tech">
                  Entering Cockpit Viewport...
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
