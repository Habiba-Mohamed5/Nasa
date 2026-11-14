import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, X, ShieldAlert, Cpu, ArrowRight, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { spaceAudio } from './utils/spaceAudio';

export default function AiFlightSurgeonDrawer({
  isOpen,
  onClose,
  telemetry,
  isCommBlackout,
  onApplyCountermeasure,
  countermeasureApplied
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
    <>
      {/* Mobile-Friendly Backdrop Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md md:max-w-lg bg-[#13100E]/98 border-l border-white/[0.08] backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between select-none font-sans">
        {/* 1. Header with Neural Pulse Visualizer */}
        <div className="p-4 border-b border-white/[0.08] bg-[#171311] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-[#E4783B]/20 border border-[#E4783B]/40 flex items-center justify-center text-[#E4783B] shadow-[0_0_20px_rgba(228,120,59,0.3)]">
            <Bot size={22} />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#E4783B] border-2 border-[#13100E] animate-ping" />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#EBEBEB] tracking-wider font-titan">AURA AI SURGEON</h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#E4783B]/20 text-[#E4783B] border border-[#E4783B]/40 font-mono-tech">
                ExMC CDSS
              </span>
            </div>
            <div className="text-[10px] text-[#A64D2D] font-mono-tech flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E4783B] animate-pulse" />
              <span>{isCommBlackout ? 'AUTONOMOUS LOCAL NEURAL CORE' : 'EDGE CLINICAL TELEMETRY ACTIVE'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-[#ACACAC] hover:text-[#EBEBEB] p-2 rounded-xl hover:bg-[#252121] border border-transparent hover:border-white/10 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* 2. Real-Time Biometric Neural Waveform */}
      <div className="px-4 py-2.5 bg-[#171311]/50 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Activity size={14} className="text-[#E4783B] animate-pulse" />
          <span className="text-[10px] font-mono-tech text-[#ACACAC] uppercase">
            Biometric Sync: {telemetry.currentHR} BPM • {telemetry.currentHRV} ms
          </span>
        </div>

        {/* Animated Sound / Neural Wave Bars */}
        <div className="flex items-center gap-1 h-4">
          {[8, 14, 22, 12, 18, 10, 16, 24, 11, 7].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-[#E4783B] rounded-full animate-pulse"
              style={{
                height: `${h}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
      </div>

      {/* 3. Quick Medical Inquiry Chips */}
      <div className="p-3 border-b border-white/[0.06] bg-[#171311]/30">
        <div className="text-[10px] text-[#808080] font-mono-tech mb-2 flex items-center gap-1 text-right">
          <Sparkles size={11} className="text-[#E4783B]" />
          <span>استفسارات سريرية فورية (CLINICAL INQUIRIES)</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="text-right px-3 py-2 rounded-xl bg-[#1C1714] hover:bg-[#252121] border border-white/[0.06] hover:border-[#E4783B]/40 text-[11px] text-[#ACACAC] hover:text-[#EBEBEB] transition-all flex items-center justify-between group font-cairo"
            >
              <span className="truncate">{p.title}</span>
              <ArrowRight size={12} className="text-[#808080] group-hover:text-[#E4783B] opacity-60 group-hover:opacity-100 transition-all ml-1 shrink-0 rotate-180" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
          >
            <div
              className={`max-w-[92%] p-3.5 rounded-2xl text-right ${
                msg.sender === 'user'
                  ? 'bg-[#A64D2D] text-[#EBEBEB] rounded-bl-none shadow-md font-cairo'
                  : 'bg-[#171311] border border-white/[0.08] text-[#EBEBEB] rounded-br-none shadow-xl'
              }`}
            >
              <p className="leading-relaxed text-[11px] font-cairo">{msg.text}</p>

              {/* Prescription Deck Card if generated by AI */}
              {msg.prescription && (
                <div className="mt-3 p-3 rounded-xl bg-[#0D0B0A] border border-[#E4783B]/40 text-right">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#E4783B] font-titan tracking-wider">
                      {msg.prescription.title}
                    </span>
                    <Zap size={13} className="text-[#E4783B]" />
                  </div>
                  <ul className="space-y-1 mb-2.5 text-[10px] text-[#ACACAC] font-cairo">
                    {msg.prescription.items.map((it, i) => (
                      <li key={i} className="flex items-center gap-1.5 justify-end">
                        <span>{it}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E4783B]" />
                      </li>
                    ))}
                  </ul>

                  {/* One-click Execute Protocol Button */}
                  {!countermeasureApplied ? (
                    <button
                      onClick={onApplyCountermeasure}
                      className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#E4783B] to-[#A64D2D] hover:opacity-90 text-[#0D0B0A] font-black text-[11px] font-cairo transition-all shadow-[0_0_15px_rgba(228,120,59,0.35)] flex items-center justify-center gap-1.5"
                    >
                      <Zap size={13} />
                      <span>تطبيق هذه الوصفة السريرية فوراً</span>
                    </button>
                  ) : (
                    <div className="py-1.5 px-2 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-300">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>تم تطبيق البروتوكول واستقرار المؤشرات الحيوية!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Citations Footer */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex flex-wrap gap-1 justify-end">
                  {msg.citations.map((cite, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded bg-[#252121] text-[#E4783B] border border-[#E4783B]/30 text-[9px] font-mono-tech"
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
            <span>AURA is generating clinical evaluation...</span>
            <span className="w-2 h-2 rounded-full bg-[#E4783B] animate-ping" />
          </div>
        )}
      </div>

      {/* 5. Input Dock */}
      <div className="p-3 border-t border-white/[0.08] bg-[#171311]">
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
            className="p-3 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#A64D2D] text-[#0D0B0A] font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(228,120,59,0.3)] shrink-0"
          >
            <Send size={16} className="rotate-180" />
          </button>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="اسأل AURA عن المؤشرات الحيوية، العظام، أو SANS..."
            className="flex-1 bg-[#0D0B0A] border border-white/[0.08] focus:border-[#E4783B] rounded-xl px-4 py-2.5 text-xs text-[#EBEBEB] placeholder-[#808080] outline-none transition-all text-right font-cairo"
          />
        </form>
      </div>
    </div>
    </>
  );
}
