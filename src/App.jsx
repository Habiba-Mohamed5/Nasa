import React, { useState, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import {
  NASA_REFERENCES,
  CREW_MEMBERS,
  calculateSpacePhysiology
} from './data/nasaKnowledgeBase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import AiIdentityPage from './pages/AiIdentityPage';
import HowItWorksPage from './pages/HowItWorksPage';
import WorkspacePage from './pages/WorkspacePage';
import PlanetsPage from './pages/PlanetsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

import AiFlightSurgeonDrawer from './AiFlightSurgeonDrawer';
import NasaRiskScenariosModal, { NASA_SCENARIOS } from './NasaRiskScenariosModal';
import BoardingModal from './components/BoardingModal';
import { MISSION_PHASES } from './UserJourneyStepper';
import { spaceAudio } from './utils/spaceAudio';
import GlobalCosmicBackground from './components/GlobalCosmicBackground';
import SpaceScrollTelemetryRail from './components/SpaceScrollTelemetryRail';

export default function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [selectedCrew, setSelectedCrew] = useState(CREW_MEMBERS[0]);
  const [currentPhase, setCurrentPhase] = useState(MISSION_PHASES[1]); // Phase 2: Deep space by default
  const [missionDay, setMissionDay] = useState(180); // Deep Space Cruise
  const [countermeasureApplied, setCountermeasureApplied] = useState(false);
  const [isCommBlackout, setIsCommBlackout] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);
  const [isBoardingOpen, setIsBoardingOpen] = useState(false);
  const [commanderName, setCommanderName] = useState(() => {
    return localStorage.getItem('spaceship_404_commander_name') || 'Commander';
  });

  // Auto-close boarding modal on route change
  React.useEffect(() => {
    setIsBoardingOpen(false);
  }, [location.pathname]);

  // Dynamic Telemetry Calculation
  const telemetry = useMemo(() => {
    const base = calculateSpacePhysiology({
      missionDay,
      fatigue: currentPhase.id === 3 ? 9 : 5,
      stress: currentPhase.id === 3 ? 8 : 4,
      sleepQuality: currentPhase.id === 3 ? 4 : 7,
      countermeasureApplied,
      crew: selectedCrew
    });

    if (activeScenario && !countermeasureApplied) {
      return {
        ...base,
        currentHR: activeScenario.telemetryImpact.currentHR,
        currentHRV: activeScenario.telemetryImpact.currentHRV,
        bmdRetention: activeScenario.telemetryImpact.bmdRetention,
        fluidShiftIndex: activeScenario.telemetryImpact.fluidShiftIndex,
        riskLevel: 'CRITICAL',
        riskColor: '#FF2A55'
      };
    }
    return base;
  }, [missionDay, countermeasureApplied, selectedCrew, activeScenario, currentPhase]);

  const handleApplyCountermeasure = () => {
    spaceAudio.playChirp();
    spaceAudio.playBeep(1800, 0.15);
    setCountermeasureApplied(true);
  };

  const handleResetCountermeasure = () => {
    spaceAudio.playBeep(900, 0.1);
    setCountermeasureApplied(false);
    setActiveScenario(null);
  };

  const handleToggleBlackout = () => {
    const nextState = !isCommBlackout;
    setIsCommBlackout(nextState);
    if (nextState) {
      spaceAudio.playEmergencyAlarm();
    } else {
      spaceAudio.playBeep(1200, 0.1);
    }
  };

  const toggleSound = () => {
    const muted = spaceAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) spaceAudio.playBeep(1500, 0.1);
  };

  const toggleFullScreen = () => {
    spaceAudio.playBeep(1200, 0.05);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      dir="ltr"
      className="min-h-screen bg-[#07111F] text-[#F4F7FC] flex flex-col justify-between select-none overflow-x-hidden font-sans-clean relative"
    >
      {/* 0. Site-Wide Seamless Cosmic & Star Atmosphere */}
      <GlobalCosmicBackground />

      {/* Spaceflight Altitude Scroll Progress Rail (Active on Home) */}
      {isHomePage && <SpaceScrollTelemetryRail />}

      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION FOR SUBPAGES (On Home, Navbar is inside the hero card)
      ───────────────────────────────────────────────────────────── */}
      {!isHomePage && (
        <div className="w-full max-w-[1440px] mx-auto relative z-30">
          <Navbar
            isMuted={isMuted}
            toggleSound={toggleSound}
            toggleFullScreen={toggleFullScreen}
            commanderName={commanderName}
            onOpenBoarding={() => setIsBoardingOpen(true)}
            onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
            onOpenRisksModal={() => setIsScenariosOpen(true)}
          />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN ROUTED APPLICATION CONTENT
      ───────────────────────────────────────────────────────────── */}
      <main className="w-full max-w-[1440px] mx-auto flex-1 py-2 sm:py-4 px-2 sm:px-6 relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                telemetry={telemetry}
                missionDay={missionDay}
                setMissionDay={setMissionDay}
                currentPhase={currentPhase}
                setCurrentPhase={setCurrentPhase}
                countermeasureApplied={countermeasureApplied}
                handleApplyCountermeasure={handleApplyCountermeasure}
                isCommBlackout={isCommBlackout}
                handleToggleBlackout={handleToggleBlackout}
                scanMode={scanMode}
                setScanMode={setScanMode}
                isMuted={isMuted}
                toggleSound={toggleSound}
                toggleFullScreen={toggleFullScreen}
                commanderName={commanderName}
                onOpenBoarding={() => setIsBoardingOpen(true)}
                onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
                onOpenRisksModal={() => setIsScenariosOpen(true)}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route
            path="/ai-identity"
            element={
              <AiIdentityPage
                telemetry={telemetry}
                isCommBlackout={isCommBlackout}
                onApplyCountermeasure={handleApplyCountermeasure}
                countermeasureApplied={countermeasureApplied}
                onResetCountermeasure={handleResetCountermeasure}
                onToggleBlackout={handleToggleBlackout}
              />
            }
          />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route
            path="/workspace"
            element={
              <WorkspacePage
                telemetry={telemetry}
                missionDay={missionDay}
                setMissionDay={setMissionDay}
                currentPhase={currentPhase}
                setCurrentPhase={setCurrentPhase}
                countermeasureApplied={countermeasureApplied}
                handleApplyCountermeasure={handleApplyCountermeasure}
                handleResetCountermeasure={handleResetCountermeasure}
                isCommBlackout={isCommBlackout}
                handleToggleBlackout={handleToggleBlackout}
                scanMode={scanMode}
                setScanMode={setScanMode}
                selectedCrew={selectedCrew}
                setSelectedCrew={setSelectedCrew}
                onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
                onOpenRisksModal={() => setIsScenariosOpen(true)}
              />
            }
          />
          <Route
            path="/planets"
            element={
              <PlanetsPage
                setMissionDay={setMissionDay}
                setCurrentPhase={setCurrentPhase}
              />
            }
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. PROFESSIONAL FOOTER (Shared across entire platform)
      ───────────────────────────────────────────────────────────── */}
      <Footer />

      {/* ─────────────────────────────────────────────────────────────
          4. GLOBAL DRAWERS & MODALS
      ───────────────────────────────────────────────────────────── */}
      {/* AURA AI Flight Surgeon Drawer */}
      <AiFlightSurgeonDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        telemetry={telemetry}
        isCommBlackout={isCommBlackout}
        onApplyCountermeasure={handleApplyCountermeasure}
        countermeasureApplied={countermeasureApplied}
      />

      {/* NASA Risk Scenarios Modal */}
      <NasaRiskScenariosModal
        isOpen={isScenariosOpen}
        onClose={() => setIsScenariosOpen(false)}
        onSelectScenario={(sc) => {
          setActiveScenario(sc);
          setCountermeasureApplied(false);
        }}
      />

      {/* Spaceship 404 Boarding Modal */}
      <BoardingModal
        isOpen={isBoardingOpen}
        onClose={() => setIsBoardingOpen(false)}
        currentName={commanderName}
        onNameUpdated={(name) => setCommanderName(name)}
      />
    </div>
  );
}
