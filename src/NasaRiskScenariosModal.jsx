import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, Eye, Bone, Heart, Zap, FileText,
  CheckCircle2, X, AlertTriangle, Radio, Download
} from 'lucide-react';
import { spaceAudio } from './utils/spaceAudio';

export const NASA_SCENARIOS = [
  {
    id: 'SANS',
    title: 'خطر متلازمة SANS وضغط العين',
    subtitle: 'Spaceflight Associated Neuro-ocular Syndrome',
    icon: Eye,
    color: '#00F0FF',
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
    subtitle: 'Microgravity Hypercalciuria & Nephrolithiasis',
    icon: Bone,
    color: '#FFB800',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(0,240,255,0.25)] text-right overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 justify-end">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40">
                NASA HRP CLINICAL VALIDATION
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              محاكي أخطار ناسا الطارئة ومصادر المستشعرات
            </h2>
          </div>
        </div>

        {/* 3 Scenario Cards Selector */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {NASA_SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            const isSelected = selectedCase.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  spaceAudio.playChirp();
                  setSelectedCase(sc);
                  setPacketGenerated(false);
                }}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${sc.color}22`, color: sc.color }}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
                    style={{ backgroundColor: `${sc.color}22`, color: sc.color }}
                  >
                    {sc.id}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{sc.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono block truncate">
                    {sc.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Case Detailed Breakdown */}
        <div className="space-y-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs">
          {/* Sensor Input Feed */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Radio size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">
                المستشعر الفعلي على جسد الرائد (INPUT HARDWARE):
              </span>
              <strong className="text-cyan-300 font-mono text-[11px]">
                {selectedCase.sensorSource}
              </strong>
            </div>
          </div>

          {/* Diagnostic Finding */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-amber-400 font-mono block mb-1">
              التشخيص الفضائي المستقل (DIAGNOSTIC FINDING):
            </span>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              {selectedCase.detectedSymptom}
            </p>
          </div>

          {/* NASA Protocol Action */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 size={12} />
                البروتوكول العلاجي المعتمد من ناسا (COUNTERMEASURE):
              </span>
              <span className="text-[9px] font-mono text-slate-400">{selectedCase.nasaStandardCode}</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px] font-mono">
              {selectedCase.countermeasureProtocol}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                spaceAudio.playChirp();
                setPacketGenerated(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <FileText size={14} className="text-cyan-400" />
              <span>توليد حزمة بيانات هيوستن (50KB DSN Packet)</span>
            </button>
            {packetGenerated && (
              <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 size={13} />
                تم تجهيز الحزمة المشفرة للإرسال!
              </span>
            )}
          </div>

          <button
            onClick={() => {
              spaceAudio.playBeep(1800);
              onSelectScenario(selectedCase);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            تطبيق هذا السيناريو على الرائد فوراً ←
          </button>
        </div>
      </motion.div>
    </div>
  );
}
