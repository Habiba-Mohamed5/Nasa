import React, { useState } from 'react';
import {
  Bot, Send, Sparkles, Activity, Zap, CheckCircle2,
  ShieldAlert, Radio, WifiOff, FileText, ArrowRight, RefreshCw, Cpu
} from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudio';

export default function AiIdentityPage({
  telemetry,
  isCommBlackout,
  onApplyCountermeasure,
  countermeasureApplied,
  onResetCountermeasure,
  onToggleBlackout
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `مرحباً بك، سيادة القائد. أنا نظام AURA (Autonomous Ultra-Deep-Space Resiliency Agent)، طبيب الفضاء الجوي المستقل على متن مركبة أوريون. أعمل عبر النواة العصبية المحلية دون الحاجة لاتصال الأرض، وأراقب قياساتك الحيوية لحظة بلحظة وفق معايير NASA-STD-3001. كيف يمكنني مساندة جاهزيتك للمهمة اليوم؟`,
      citations: ['NASA-STD-3001 Vol 1', 'HRP-BHP-2026', 'ExMC Local Core'],
      prescription: null
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const quickPrompts = [
    {
      title: "لماذا ينخفض معدل تقلب نبضات القلب (HRV)؟",
      query: `لماذا ينخفض معدل تقلب نبضات القلب (HRV) في اليوم ${telemetry.missionDay} من المهمة؟`
    },
    {
      title: "تقييم انتقال السوائل الرأسي ومتلازمة SANS",
      query: "حلل خطر انتفاخ العصب البصري (SANS) ومؤشر انتقال السوائل للرأس حالياً."
    },
    {
      title: "توليد تعديل تدريب ARED وتوازن الكالسيوم",
      query: "استخرج وصفة تمرين الأثقال الفضائية ARED وجرعة المحاليل لمنع تآكل العظام."
    },
    {
      title: "تقييم بروتوكول انقطاع الاتصال اللاسلكي",
      query: "ما هي التدخلات المستقلة المجدولة في حال حدوث عاصفة شمسية وانقطاع تام مع هيوستن؟"
    }
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    spaceAudio.playChirp();

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiResponse = '';
      let citations = [];
      let prescription = null;

      const q = query.toLowerCase();
      if (q.includes('hrv') || q.includes('قلب') || q.includes('نبض') || q.includes('heart') || q.includes('variability')) {
        aiResponse = `تحليل القياسات الحيوية (اليوم ${telemetry.missionDay}): معدل تقلب نبضك (HRV) حالياً هو ${telemetry.currentHRV} ms (بانحراف قدره ${telemetry.hrvDriftPct}% عن خط الأساس). في انعدام الجاذبية، يصعد نحو لترين من سوائل الجسم نحو الصدر والرأس؛ مما يُلغي التدرج الهيدروستاتيكي الطبيعي ويثبط نغمة العصب الحائر الباراسيمبثاوي. نظراً لتأخير الاتصال بالأرض (${telemetry.commDelayMinutes} دقيقة)، نوصي بتفعيل التدخل الفوري: تمرين دراجة CEVIS لمدة 20 دقيقة، مع شرب 750 مل محلول أملاح متوازن الضغط الأسموزي.`;
        citations = ['NASA-STD-3001 Vol 1', 'HRP-47052', 'LSDA-ISS-CV'];
        prescription = {
          title: "بروتوكول دعم الدورة وتوازن البلازما",
          items: ["20 دقيقة CEVIS عند 75% VO2 max", "شرب 750 مل محلول كهارل متوازن", "30 دقيقة ضغط سلبي سفلي LBNP (-30 mmHg)"]
        };
      } else if (q.includes('عظام') || q.includes('bone') || q.includes('ared') || q.includes('calcium') || q.includes('كالسيوم')) {
        aiResponse = `التقييم العظمي والاستقلابي: نسبة بقاء كثافة العظام (BMD) حالياً هي ${telemetry.bmdRetention}% (إجمالي الفقد: -${telemetry.bmdLoss}%). وفق بروتوكول LSDA-BMD-ISS-04، تم رفع أحمال تدريب القرفصاء والرفعة الميتة على جهاز المقاومة الهيدروليكي ARED بنسبة 12.5%، مع زيادة الحصة المائية اليومية بمقدار 600 مل لتخفيف تركيز الكالسيوم في البول وتجنب الحصوات الكلوية.`;
        citations = ['LSDA-BMD-ISS-04', 'NASA HRP Bone Evidence', 'NASA-STD-3001'];
        prescription = {
          title: "بروتوكول ARED لحماية العظام الإسفنجية",
          items: ["زيادة أحمال ARED Squat بنسبة +12.5%", "جرعة 800 IU فيتامين D3 + 100mcg K2", "+600 مل ترطيب إضافي لحماية الكلى"]
        };
      } else if (q.includes('sans') || q.includes('عين') || q.includes('بصر') || q.includes('vision') || q.includes('optic') || q.includes('سوائل')) {
        aiResponse = `مصفوفة فحص SANS والضغط القحفي: يبلغ قطر غمد العصب البصري (ONSD) حالياً 5.6 مم مع مؤشر احتقان رأسي +${telemetry.fluidShiftIndex}%. نوصي ببدء جلسة تفريغ الضغط الرأسي عبر جهاز الضغط السالب للأطراف السفلية (LBNP) لمدة 30 دقيقة لسحب لتر من الدم نحو الساقين واستعادة الضغط الطبيعي لشبكية العين.`;
        citations = ['HRP-SANS-4819', 'NASA-STD-3001 Rev B'];
        prescription = {
          title: "بروتوكول LBNP لتخفيف ضغط الرأس والعين",
          items: ["جلسة LBNP لمدة 30 دقيقة عند -30 mmHg", "فحص قاع العين بالسونار المحمول", "ارتداء عدسات تصحيح انكسار مؤقتة"]
        };
      } else {
        aiResponse = `تشخيص نظام AURA الطبي (اليوم ${telemetry.missionDay}): مؤشر حيوية الطاقم العام هو ${telemetry.overallHealthIndex}/100، والحالة النشطة هي (${telemetry.riskLevel}). وضع الاتصال بالأرض: ${isCommBlackout ? 'انقطاع كامل (تفعيل الاستقلالية السريرية التامة)' : 'تأخير لاسلكي متوقع'}. جميع التدخلات موجهة بالذكاء الاصطناعي السريري وفق مكتبة معايير ناسا الفضائية.`;
        citations = ['NASA-STD-3001', 'NASA IMM Model'];
      }

      setMessages([...newMessages, { sender: 'ai', text: aiResponse, citations, prescription }]);
      setIsGenerating(false);
      spaceAudio.playBeep(1600, 0.1);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-8 py-4">
      {/* 1. Header Banner */}
      <section className="p-8 sm:p-10 rounded-[32px] cinematic-card-bg border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E4783B] animate-ping" />
            <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-widest">
              AUTONOMOUS AI FLIGHT SURGEON • ExMC CDSS
            </span>
          </div>
          <h1 className="font-titan text-3xl sm:text-4xl lg:text-5xl text-[#EBEBEB] uppercase leading-tight tracking-wide">
            AURA NEURAL CLINICAL CORE
          </h1>
          <p className="text-xs sm:text-sm text-[#ACACAC] leading-relaxed">
            Continuous biometric telemetry evaluation against NASA-STD-3001 standards. Running 100% offline on local spacecraft avionics during Deep Space Communication Blackout.
          </p>
        </div>

        {/* Live Status Pill Card */}
        <div className="p-4 rounded-2xl bg-[#0D0B0A] border border-white/10 space-y-2 text-xs font-mono-tech shrink-0 w-full md:w-64">
          <div className="flex items-center justify-between">
            <span className="text-[#808080]">NEURAL ENGINE</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#808080]">COMM-LAG</span>
            <span className="text-[#E4783B] font-bold">{telemetry.commDelayMinutes} MIN</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#808080]">BLACKOUT MODE</span>
            <span className={isCommBlackout ? 'text-amber-400 font-bold' : 'text-[#ACACAC]'}>
              {isCommBlackout ? 'AUTONOMOUS' : 'STANDBY'}
            </span>
          </div>
          <button
            onClick={onToggleBlackout}
            className="w-full mt-2 py-1.5 rounded-lg bg-[#182A44] hover:bg-[#1f3657] text-[#7AD7EA] border border-[#7AD7EA]/30 font-bold text-[10px] transition-all"
          >
            {isCommBlackout ? 'Deactivate Blackout' : 'Simulate Blackout'}
          </button>
        </div>
      </section>

      {/* 2. Biometric Waveform & Triage Bar */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] text-right">
          <span className="text-[10px] text-[#98A7BD] font-mono-tech block">HEART RATE & HRV</span>
          <div className="text-xl font-titan text-[#F4F7FC] mt-0.5">{telemetry.currentHR} BPM</div>
          <span className="text-[10px] text-[#7AD7EA] font-mono-tech">RMSSD: {telemetry.currentHRV} ms</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] text-right">
          <span className="text-[10px] text-[#98A7BD] font-mono-tech block">CEPHALAD FLUID SHIFT</span>
          <div className="text-xl font-titan text-[#7AD7EA] mt-0.5">+{telemetry.fluidShiftIndex}%</div>
          <span className="text-[10px] text-[#98A7BD] font-mono-tech">Headward Redistribution</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] text-right">
          <span className="text-[10px] text-[#98A7BD] font-mono-tech block">TRABECULAR BMD</span>
          <div className="text-xl font-titan text-[#F4F7FC] mt-0.5">{telemetry.bmdRetention}%</div>
          <span className="text-[10px] text-rose-400 font-mono-tech">-{telemetry.bmdLoss}% loss</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] text-right">
          <span className="text-[10px] text-[#98A7BD] font-mono-tech block">OPTIC SHEATH (SANS)</span>
          <div className="text-xl font-titan text-[#F4F7FC] mt-0.5">5.6 mm</div>
          <span className="text-[10px] text-amber-400 font-mono-tech">Intracranial ICP: 22 mmHg</span>
        </div>
      </section>

      {/* 3. Main Clinical Chat Console */}
      <section className="rounded-[32px] bg-[#132238]/90 backdrop-blur-md border border-[rgba(180,210,235,0.14)] shadow-2xl flex flex-col h-[680px] overflow-hidden">
        {/* Console Header */}
        <div className="p-4 sm:p-5 border-b border-[rgba(180,210,235,0.12)] bg-[#0D1728] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7AD7EA]/15 border border-[#7AD7EA]/40 flex items-center justify-center text-[#7AD7EA]">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-titan text-base text-[#F4F7FC] tracking-wide uppercase">
                  AURA SURGEON INTERACTIVE DIALOGUE
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#7AD7EA]/20 text-[#7AD7EA] font-mono-tech font-bold">
                  NASA-STD-3001
                </span>
              </div>
              <span className="text-[10px] text-[#98A7BD] font-mono-tech">
                Deterministic Medical Copilot • Bilingual Arabic / English
              </span>
            </div>
          </div>

          {/* Neural Waveform Audio Sync */}
          <div className="hidden sm:flex items-center gap-1.5 h-4">
            {[6, 12, 20, 10, 16, 24, 14, 8, 18, 12].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-[#7AD7EA] rounded-full animate-pulse"
                style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Quick Clinical Prompts Bar */}
        <div className="p-3 bg-[#0D1728]/80 border-b border-[rgba(180,210,235,0.1)] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono-tech text-[#98A7BD] uppercase shrink-0 pl-1">
            QUICK CLINICAL INQUIRIES:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="text-right px-3 py-1.5 rounded-full bg-[#182A44] hover:bg-[#7AD7EA]/20 text-[11px] text-[#C7D2E3] hover:text-[#F4F7FC] border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/40 transition-all shrink-0 font-cairo"
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs font-sans">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-right ${
                  msg.sender === 'user'
                    ? 'bg-[#182A44] text-[#F4F7FC] border border-[#7AD7EA]/40 rounded-bl-none shadow-md font-cairo'
                    : 'bg-[#0D1728] border border-[rgba(180,210,235,0.14)] text-[#F4F7FC] rounded-br-none shadow-xl'
                }`}
              >
                <p className="leading-relaxed text-xs font-cairo text-[#F4F7FC]">{msg.text}</p>

                {/* Prescription Deck Card if generated by AI */}
                {msg.prescription && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-[#132238] border border-[#7AD7EA]/40 text-right space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#7AD7EA] font-titan tracking-wider uppercase">
                        {msg.prescription.title}
                      </span>
                      <Zap size={14} className="text-[#7AD7EA]" />
                    </div>
                    <ul className="space-y-1 text-[11px] text-[#C7D2E3] font-cairo">
                      {msg.prescription.items.map((it, i) => (
                        <li key={i} className="flex items-center gap-1.5 justify-end">
                          <span>{it}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7AD7EA]" />
                        </li>
                      ))}
                    </ul>

                    {/* One-click Execute Protocol Button */}
                    {!countermeasureApplied ? (
                      <button
                        onClick={onApplyCountermeasure}
                        className="w-full mt-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#E4783B] to-[#d46a30] hover:opacity-95 text-[#07111F] font-black text-xs font-cairo transition-all shadow-[0_0_15px_rgba(228,120,59,0.35)] flex items-center justify-center gap-2"
                      >
                        <Zap size={14} />
                        <span>تطبيق هذه الوصفة السريرية فوراً</span>
                      </button>
                    ) : (
                      <div className="mt-2 py-2 px-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center gap-2 text-xs font-bold text-emerald-300 font-cairo">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>تم تطبيق البروتوكول واستقرار المؤشرات الحيوية!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Citations Footer */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[rgba(180,210,235,0.1)] flex flex-wrap gap-1 justify-end">
                    {msg.citations.map((cite, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded bg-[#132238] text-[#7AD7EA] border border-[#7AD7EA]/30 text-[9px] font-mono-tech"
                      >
                        {cite}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-[#E4783B] text-xs font-mono-tech justify-end">
              <span>AURA is analyzing astronaut vitals against NASA-STD-3001...</span>
              <span className="w-2 h-2 rounded-full bg-[#E4783B] animate-ping" />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[rgba(180,210,235,0.12)] bg-[#0D1728]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="submit"
              disabled={!inputQuery.trim() || isGenerating}
              className="p-3 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#d46a30] text-[#07111F] font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(228,120,59,0.3)] shrink-0"
            >
              <Send size={16} className="rotate-180" />
            </button>
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="اسأل AURA عن المؤشرات الحيوية، العظام، أو بروتوكول SANS..."
              className="flex-1 bg-[#132238] border border-[rgba(180,210,235,0.14)] focus:border-[#7AD7EA] rounded-xl px-4 py-3 text-xs text-[#F4F7FC] placeholder-[#98A7BD] outline-none transition-all text-right font-cairo"
            />
          </form>
        </div>
      </section>
    </div>
  );
}
