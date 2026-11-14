import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, Eye, Bone, Heart, Zap, FileText,
  CheckCircle2, X, AlertTriangle, Radio
} from 'lucide-react';
import { spaceAudio } from './utils/spaceAudio';
import { assetPath } from './utils/assetPath';

export const NASA_SCENARIOS = [
  {
    id: 'SANS',
    title: 'خطر متلازمة SANS وضغط العين',
    subtitle: 'Spaceflight Neuro-ocular Syndrome',
    icon: Eye,
    color: '#E4783B',
    image: assetPath('sans_scan.jpg'),
    imageLabel: 'SONAR ONSD SCAN (5.9 mm)',
    sensorSource: 'Portable Ocular Ultrasound (Butterfly iQ) + Astroskin Blood Pressure',
    detectedSymptom: 'تضخم قطر غلاف العصب البصري (ONSD = 5.9 mm) مع انتقال السوائل الرأسي وصداع خفيف.',
    nasaRiskLevel: 'Tier 1 Critical Vision Risk',
    nasaStandardCode: 'NASA-STD-3001 Vol 1 / HRP-SANS-4819',
    telemetryImpact: { currentHR: 76, currentHRV: 38, bmdRetention: 95.2, fluidShiftIndex: 82 },
    countermeasureProtocol: 'تطبيق بروتوكول الضغط السلبي السفلي (LBNP) لمدة 30 دقيقة عند -30 mmHg لتصريف السوائل من الرأس نحو الأطراف السفلية، وارتداء نظارات التصحيح البصري القابلة للتعديل.'
  },
  {
    id: 'RENAL_STONE',
    title: 'خطر ترسب حصوات الكلى',
    subtitle: 'Hypercalciuria & Nephrolithiasis',
    icon: Bone,
    color: '#FFB800',
    image: assetPath('bone_loss_scan.jpg'),
    imageLabel: 'DEXA SPINAL MICRO-LATTICE & CALCIUM TURNOVER',
    sensorSource: 'Urine Electrolyte Test (i-STAT Analyzer) + Fluid Log Matrix',
    detectedSymptom: 'ارتفاع حاد في إفراز الكالسيوم البولي (Hypercalciuria) بسبب تآكل العظام مع انخفاض كمية السوائل المتناولة (-450ml).',
    nasaRiskLevel: 'Tier 2 Renal Obstruction Warning',
    nasaStandardCode: 'LSDA-BMD-ISS-04 / NASA Flight Rules',
    telemetryImpact: { currentHR: 84, currentHRV: 32, bmdRetention: 92.4, fluidShiftIndex: 55 },
    countermeasureProtocol: 'إعطاء فوري لـ 1000 مل من محلول الشوارد متساوي التوتر (Isotonic Oral Rehydration) مع سترات البوتاسيوم لمنع تبلور الكالسيوم، وزيادة حمل تمارين جهاز ARED بنسبة 10% لتوجيه الكالسيوم للعظام.'
  },
  {
    id: 'CARDIAC_DRIFT',
    title: 'انكماش البلازما واضطراب نبض القلب',
    subtitle: 'Cardiovascular Remodeling & Plasma Deficit',
    icon: Heart,
    color: '#FF2A55',
    image: assetPath('hemodynamics_scan.jpg'),
    imageLabel: 'COLOR DOPPLER ECHOCARDIOGRAPHY & CVP TRACE',
    sensorSource: 'Smart Undershirt (Astroskin Continuous 3-Lead ECG & HRV)',
    detectedSymptom: 'انخفاض مؤشر HRV بنسبة 35% تحت خط الأساس الفردي مع تسارع نبض الراحة (94 BPM) وفقدان 16% من حجم البلازما الفعال.',
    nasaRiskLevel: 'Tier 1 Orthostatic Intolerance Threat',
    nasaStandardCode: 'NASA-STD-3001 Rev B / HRP-47052',
    telemetryImpact: { currentHR: 94, currentHRV: 24, bmdRetention: 94.0, fluidShiftIndex: 70 },
    countermeasureProtocol: 'بدء جلسة دراجة CEVIS الرياضية لمدة 25 دقيقة عند 75% من VO2 max، متبوعة ببروتوكول التحميل الملحي (Salt/Water Loading: 8g NaCl + 1L water) قبل أي مناورة حركية.'
  }
];

export default function NasaRiskScenariosModal({ isOpen, onClose, onSelectScenario }) {
  const [selectedCase, setSelectedCase] = useState(NASA_SCENARIOS[0]);
  const [packetGenerated, setPacketGenerated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-[#13100E] border border-white/[0.08] rounded-3xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.95)] text-right overflow-hidden max-h-[92vh] overflow-y-auto no-scrollbar"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#ACACAC] hover:text-[#EBEBEB] hover:bg-[#252121] transition-all border border-transparent hover:border-white/10"
          >
            <X size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 justify-end">
              <span className="px-2 py-0.5 rounded-full bg-[#E4783B]/20 text-[#E4783B] text-[10px] font-mono-tech font-bold border border-[#E4783B]/40">
                NASA HRP CLINICAL VALIDATION
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-[#EBEBEB] mt-1 font-cairo">
              محاكي أخطار ناسا الطارئة ومصادر المستشعرات
            </h2>
          </div>
        </div>

        {/* 3 Scenario Cards Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {NASA_SCENARIOS.map((sc) => {
            const isSelected = selectedCase.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  spaceAudio.playChirp();
                  setSelectedCase(sc);
                  setPacketGenerated(false);
                }}
                className={`relative p-2.5 rounded-2xl border text-right transition-all flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? 'bg-[#29201D] border-[#E4783B] shadow-[0_0_25px_rgba(228,120,59,0.25)] ring-1 ring-[#E4783B]'
                    : 'bg-[#171311] border-white/[0.06] hover:border-white/20 text-[#ACACAC]'
                }`}
              >
                {/* Image preview */}
                <div className="relative w-full h-16 rounded-xl overflow-hidden mb-2 border border-white/10 shadow-md">
                  <img
                    src={sc.image}
                    alt={sc.title}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      isSelected ? 'brightness-110 contrast-110' : 'brightness-75 contrast-90 opacity-70'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-transparent to-transparent" />
                  <span
                    className="absolute top-1 right-1 text-[9px] font-mono-tech px-2 py-0.5 rounded-full font-bold backdrop-blur-md"
                    style={{ backgroundColor: `${sc.color}33`, color: sc.color, border: `1px solid ${sc.color}66` }}
                  >
                    {sc.id}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#EBEBEB] mb-0.5 font-cairo">{sc.title}</h4>
                  <span className="text-[10px] text-[#A64D2D] font-mono-tech block truncate">
                    {sc.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Case Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#171311] border border-white/[0.08] rounded-2xl p-4 text-xs">
          {/* Diagnostic Ultrasound / Scan Window */}
          <div className="md:col-span-5 flex flex-col gap-2">
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#E4783B]/40 shadow-inner group">
              <img
                src={selectedCase.image}
                alt={selectedCase.title}
                className="w-full h-full object-cover filter contrast-125 brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-transparent to-transparent opacity-80" />
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between font-mono-tech text-[9px] bg-[#0D0B0A]/90 px-2 py-0.5 rounded border border-[#E4783B]/40">
                <span className="text-[#E4783B] font-bold">{selectedCase.imageLabel}</span>
                <span className="text-emerald-400">LIVE FEED</span>
              </div>
              <div className="absolute bottom-2 right-2 left-2 flex items-center justify-between font-mono-tech text-[9px] text-[#ACACAC]">
                <span>HR: {selectedCase.telemetryImpact.currentHR} BPM</span>
                <span>HRV: {selectedCase.telemetryImpact.currentHRV} ms</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[#252121]/60 border border-white/[0.06] flex items-center justify-between text-[10px] font-mono-tech">
              <span className="text-[#ACACAC] font-cairo">مستوى الخطورة:</span>
              <strong className="text-rose-400">{selectedCase.nasaRiskLevel}</strong>
            </div>
          </div>

          {/* Right Column: Sensor Input + Findings + Action */}
          <div className="md:col-span-7 space-y-2.5">
            {/* Sensor Input Feed */}
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#252121]/50 border border-white/[0.06]">
              <Radio size={15} className="text-[#E4783B] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-[#808080] font-mono-tech block">
                  المستشعر الفعلي على جسد الرائد (INPUT HARDWARE):
                </span>
                <strong className="text-[#E4783B] font-mono-tech text-[11px]">
                  {selectedCase.sensorSource}
                </strong>
              </div>
            </div>

            {/* Diagnostic Finding */}
            <div className="p-2.5 rounded-xl bg-[#252121]/50 border border-white/[0.06]">
              <span className="text-[10px] text-[#E4783B] font-mono-tech block mb-0.5">
                التشخيص الفضائي المستقل (DIAGNOSTIC FINDING):
              </span>
              <p className="text-[#EBEBEB] leading-relaxed text-[11px] font-cairo">
                {selectedCase.detectedSymptom}
              </p>
            </div>

            {/* NASA Protocol Action */}
            <div className="p-2.5 rounded-xl bg-[#29201D]/70 border border-[#E4783B]/40">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-emerald-400 font-mono-tech font-bold flex items-center gap-1 font-cairo">
                  <CheckCircle2 size={12} />
                  البروتوكول العلاجي المعتمد من ناسا:
                </span>
                <span className="text-[9px] font-mono-tech text-[#808080]">{selectedCase.nasaStandardCode}</span>
              </div>
              <p className="text-[#EBEBEB] leading-relaxed text-[11px] font-cairo">
                {selectedCase.countermeasureProtocol}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                spaceAudio.playChirp();
                setPacketGenerated(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#252121] hover:bg-[#29201D] text-[#EBEBEB] font-bold text-xs font-mono-tech transition-all flex items-center gap-1.5 border border-white/[0.06]"
            >
              <FileText size={14} className="text-[#E4783B]" />
              <span className="font-cairo">توليد حزمة بيانات هيوستن (50KB DSN)</span>
            </button>
            {packetGenerated && (
              <span className="text-[11px] text-emerald-400 font-mono-tech font-bold flex items-center gap-1 font-cairo">
                <CheckCircle2 size={13} />
                تم تجهيز الحزمة المشفرة!
              </span>
            )}
          </div>

          <button
            onClick={() => {
              spaceAudio.playBeep(1800);
              onSelectScenario(selectedCase);
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#A64D2D] hover:opacity-90 text-[#0D0B0A] font-black text-xs font-cairo tracking-wider transition-all shadow-[0_0_20px_rgba(228,120,59,0.35)]"
          >
            تطبيق هذا السيناريو على الرائد فوراً ←
          </button>
        </div>
      </motion.div>
    </div>
  );
}
