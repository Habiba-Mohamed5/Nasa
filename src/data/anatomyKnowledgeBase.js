/**
 * NASA Space Medicine & Physiological Reference Standards
 * Medically grounded educational data for 404 IDEAS Biomedical Explorer.
 * Distinguishes simulated demonstration data from clinical spaceflight reference baselines.
 */

export const ANATOMY_SYSTEMS = [
  { id: 'skeleton', name: 'الهيكل العظمي', nameEn: 'Skeletal System', color: '#E2E8F0', icon: 'Bone' },
  { id: 'muscles', name: 'الجهاز العضلي', nameEn: 'Muscular System', color: '#EF4444', icon: 'Dumbbell' },
  { id: 'cardiovascular', name: 'القلب والدوران', nameEn: 'Cardiovascular System', color: '#F43F5E', icon: 'Heart' },
  { id: 'respiratory', name: 'الجهاز التنفسي', nameEn: 'Respiratory System', color: '#38BDF8', icon: 'Wind' },
  { id: 'nervous', name: 'الجهاز العصبي', nameEn: 'Nervous System', color: '#A855F7', icon: 'Brain' },
  { id: 'visceral', name: 'الأعضاء الحشوية', nameEn: 'Visceral & Metabolic', color: '#10B981', icon: 'Activity' }
];

export const ORGANS_DATA = {
  heart: {
    id: 'heart',
    name: 'القلب والأوعية الدموية الكبرى',
    nameEn: 'Heart & Great Vessels',
    system: 'cardiovascular',
    systemEn: 'Cardiovascular System',
    cameraTarget: [0, 1.28, 0],
    cameraPos: [0, 1.30, 0.75],
    metrics: [
      { label: 'النبض (BPM)', key: 'bpm', unit: 'BPM', defaultVal: 72, normalRange: '60 - 100' },
      { label: 'حجم النفضة (Stroke Vol)', key: 'sv', unit: 'mL', defaultVal: 70, normalRange: '60 - 90' },
      { label: 'النتاج القلبي (Cardiac Output)', key: 'co', unit: 'L/min', defaultVal: 5.0, normalRange: '4.5 - 6.5' },
      { label: 'ضغط الشريان التاجي', key: 'bp', unit: 'mmHg', defaultVal: '118/76', normalRange: '120/80' }
    ],
    physiologicalSummary: 'عضلة حيوية تضخ الدم المؤكسج لكافة أنسجة الجسم عبر انقباض بطيني منتظم (Systole) يتبعه ارتخاء وتعبئة (Diastole).',
    microgravityImpact: [
      'انزياح السوائل باتجاه الرأس (Cephalad Fluid Shift) يقلل الحمل على عضلة القلب بنسبة ~15% خلال الأيام الأولى.',
      'انخفاض تدريجي في كتلة البطين الأيسر وتكيف الأوعية الدموية مع انعدام الجاذبية الأرضية.',
      'خطر عدم تحمل الوقوف (Orthostatic Intolerance) عند إعادة الدخول إلى جاذبية كوكب الأرض أو المريخ.'
    ],
    nasaCountermeasure: 'استخدام جهاز المقاومة المتقدم (ARED)، بدلة الضغط السلبي السفلي (LBNP)، وبروتوكول إعادة ترطيب الجسم قبل الهبوط بالأملاح والسوائل.',
    simulationNote: 'مخطط كهربائية القلب (ECG) ونبضات القلب المعروضة هي محاكاة تعليمية آنية متزامنة مع معدل النبض المختار وفق النماذج الفسيولوجية المعتمدة.'
  },
  lungs: {
    id: 'lungs',
    name: 'الرئتان والشجرة القصبية',
    nameEn: 'Lungs & Tracheobronchial Tree',
    system: 'respiratory',
    systemEn: 'Respiratory System',
    cameraTarget: [0, 1.28, 0],
    cameraPos: [0, 1.30, 0.95],
    metrics: [
      { label: 'معدل التنفس (RR)', key: 'rr', unit: 'breaths/min', defaultVal: 16, normalRange: '12 - 20' },
      { label: 'الحجم الجاري (Tidal Vol)', key: 'tv', unit: 'mL', defaultVal: 500, normalRange: '450 - 600' },
      { label: 'تشبع الأكسجين (SpO2)', key: 'spo2', unit: '%', defaultVal: 98, normalRange: '95 - 100' },
      { label: 'الضغط الجزئي لـ CO2', key: 'co2', unit: 'mmHg', defaultVal: 2.1, normalRange: '< 3.0 (Cabin)' }
    ],
    physiologicalSummary: 'تبادل الغازات بين الحويصلات الهوائية والدم عبر التمدد الرئوي الفاعل وهبوط الحجاب الحاجز بالشهيق، والارتداد المرن بالزفير.',
    microgravityImpact: [
      'اختفاء التدرج الهيدروستاتيكي الطبيعي للتهوية والتروية (V/Q ratio) ليصبح توزيع الغازات والدم أكثر تجانساً داخل الرئتين.',
      'تراكم ثاني أكسيد الكربون الموضعي حول رأس رائد الفضاء بسبب انعدام تيارات الحمل الحراري الطبيعية في انعدام الوزن.',
      'انخفاض السعة المتبقية الوظيفية (FRC) بنحو 10% نتيجة انزياح محتويات البطن باتجاه الحجاب الحاجز.'
    ],
    nasaCountermeasure: 'نظام تنقية هواء الكابينة (CDRA) لامتصاص ثاني أكسيد الكربون، وضمان دوران الهواء المستمر بمراوح تهوية نشطة أثناء النوم والعمل.',
    simulationNote: 'حركة تمدد الرئتين والشهيق/الزفير تعتمد محاكاة فيزيائية تعليمية تعكس هبوط الحجاب الحاجز والتمدد الجانبي الحقيقي للأنسجة الرئوية.'
  },
  brain: {
    id: 'brain',
    name: 'الدماغ والجهاز العصبي المركزي',
    nameEn: 'Brain & Central Nervous System',
    system: 'nervous',
    systemEn: 'Nervous System',
    cameraTarget: [0, 1.63, 0],
    cameraPos: [0, 1.65, 0.55],
    metrics: [
      { label: 'الضغط داخل القحف (ICP)', key: 'icp', unit: 'mmHg', defaultVal: 14, normalRange: '10 - 15' },
      { label: 'تدفق الدم المخي (CBF)', key: 'cbf', unit: 'mL/100g/min', defaultVal: 54, normalRange: '50 - 60' },
      { label: 'درجة حرارة الدماغ', key: 'brainTemp', unit: '°C', defaultVal: 37.2, normalRange: '36.8 - 37.5' },
      { label: 'مؤشر اليقظة الإدراكية', key: 'cogIndex', unit: '%', defaultVal: 96, normalRange: '90 - 100' }
    ],
    physiologicalSummary: '19 بنية تشريحية رئيسية بما في ذلك الفصوص الجبهية والجدارية والصدغية والقذالية والمخيخ، المسؤولة عن الوظائف المعرفية والتوازن الحركي.',
    microgravityImpact: [
      'متلازمة العيون العصبية المرتبطة برحلات الفضاء (SANS): ارتفاع الضغط الوريدي الدماغي يؤثر على العصب البصري والصلبة الخلفية للعين.',
      'دوار الفضاء (Space Motion Sickness): تناقض حسي حاد بين مدخلات الجهاز الدهليزي للأذن الداخلية وإشارات العينين في الأيام الأولى.',
      'إعادة التخطيط العصبي الحركي (Neuroplasticity) للتكيف مع التنقل ثلاثي الأبعاد بالأيدي والأرجل في الجاذبية الصغرى.'
    ],
    nasaCountermeasure: 'مراقبة العصب البصري بمطيافية OCT الدورية، تمارين التكيف الدهليزي، وجلسات الضغط السلبي السفلي لتخفيف احتقان الرأس الوريدي.',
    simulationNote: 'مناطق القشرة الدماغية مأخوذة من مسوحات ثلاثية الأبعاد طبية، وتوضيحات التنشيط العصبي هي تمثيلات تعليمية لتوضيح الفصوص التشريحية.'
  },
  skeleton: {
    id: 'skeleton',
    name: 'الهيكل العظمي والعمود الفقري',
    nameEn: 'Skeletal System & Vertebral Column',
    system: 'skeleton',
    systemEn: 'Skeletal System',
    cameraTarget: [0, 1.0, 0],
    cameraPos: [0, 1.1, 1.7],
    metrics: [
      { label: 'احتفاظ الكثافة المعدنية (BMD)', key: 'bmd', unit: '%', defaultVal: 97.4, normalRange: '> 95%' },
      { label: 'استطالة العمود الفقري', key: 'spineElong', unit: 'cm', defaultVal: '+3.8', normalRange: '0 - +5 cm' },
      { label: 'إفراز الكالسيوم البولي', key: 'calcium', unit: 'mg/24h', defaultVal: 280, normalRange: '100 - 300' },
      { label: 'صلابة عظام الحوض والورك', key: 'hipRigidity', unit: '%', defaultVal: 96.8, normalRange: '> 94%' }
    ],
    physiologicalSummary: '242 عظمة تشريحية تشكل الإطار الهيكلي، بما فيها القحف والفقرات العنقية والصدرية والقطنية والقفص الصدري والحوض والأطراف.',
    microgravityImpact: [
      'فقدان ما بين 1% إلى 1.5% من الكثافة العظمية شهرياً في عظام الحوض وعنق الفخذ نتيجة غياب التحميل الميكانيكي الضاغط.',
      'استطالة العمود الفقري بما يصل إلى 5-7 سم نتيجة تمدد الأقراص بين الفقرات، مما يسبب آلام الظهر الحادة في أول أسبوعين.',
      'زيادة نشاط الخلايا الهادمة للعظم (Osteoclasts) وتثبيط البانية (Osteoblasts)، مع خطر تشكل حصوات الكلى من الكالسيوم المفرز.'
    ],
    nasaCountermeasure: 'ساعتان ونصف يومياً من تمارين المقاومة العنيفة على جهاز ARED (أحمال تصل لـ 270 كجم)، مكملات فيتامين D3 ومثبطات ارتشاف العظم (Bisphosphonates).',
    simulationNote: 'النماذج العظمية مستخرجة بدقة كاملة من قاعدة البيانات الطبية BodyParts3D، وتبين توزيع العظام والفقرات الحقيقي.'
  },
  muscles: {
    id: 'muscles',
    name: 'الجهاز العضلي ومجموعات الحركة',
    nameEn: 'Muscular System & Locomotor Groups',
    system: 'muscles',
    systemEn: 'Muscular System',
    cameraTarget: [0, 0.95, 0],
    cameraPos: [0, 1.05, 1.6],
    metrics: [
      { label: 'كتلة العضلات الهيكلية', key: 'muscleMass', unit: '%', defaultVal: 98.2, normalRange: '> 95%' },
      { label: 'قوة العضلات الباسطة (Extensors)', key: 'extensorStrength', unit: '%', defaultVal: 94.6, normalRange: '> 90%' },
      { label: 'استهلاك الأكسجين العضلي (VO2)', key: 'vo2', unit: 'mL/kg/min', defaultVal: 38, normalRange: '35 - 50' },
      { label: 'نغمة عضلة الساق (Soleus Tone)', key: 'soleusTone', unit: '%', defaultVal: 92.1, normalRange: '> 90%' }
    ],
    physiologicalSummary: '177 مجموعة عضلية تشريحية رئيسية مسؤولة عن الحفاظ على القوام وتوليد القوة الحركية للأطراف والجذع.',
    microgravityImpact: [
      'ضمور متسارع في العضلات الباسطة المضادة للجاذبية (مثل العضلة النعلية Soleus وعضلات الفخذ الرباعية والظهر).',
      'تحول تدريجي في ألياف العضلات من النوع الأول البطيء المعتمد على الأكسدة (Type I Slow-Twitch) إلى النوع الثاني السريع القابل للتعب.',
      'انخفاض كفاءة الوصلات العصبية العضلية إذا لم يتم ممارسة تدريبات التحميل المكثفة يومياً.'
    ],
    nasaCountermeasure: 'التدريب اليومي على جهاز الجري الفضائي T2 مع أحزمة الشد المطاطية، وجهاز الدراجة الثابتة CEVIS، وجهاز المقاومة ARED.',
    simulationNote: 'تمثيل الألياف والمجموعات العضلية مبني على مسح تشريحي دقيق يوضح موضع العضلات السطحية والعميقة.'
  },
  liver: {
    id: 'liver',
    name: 'الكبد والاستقلاب الدوائي',
    nameEn: 'Liver & Hepatic Metabolism',
    system: 'visceral',
    systemEn: 'Visceral & Metabolic',
    cameraTarget: [0.06, 1.12, 0],
    cameraPos: [0.06, 1.15, 0.65],
    metrics: [
      { label: 'تدفق الدم الكبدي', key: 'liverFlow', unit: 'mL/min', defaultVal: 1450, normalRange: '1300 - 1600' },
      { label: 'إنزيم ALT', key: 'alt', unit: 'U/L', defaultVal: 24, normalRange: '7 - 56' },
      { label: 'إنزيم AST', key: 'ast', unit: 'U/L', defaultVal: 22, normalRange: '10 - 40' },
      { label: 'معدل تنقية الأدوية (CYP450)', key: 'cyp450', unit: '%', defaultVal: 95, normalRange: '> 90%' }
    ],
    physiologicalSummary: 'أكبر عضو حشوي في التجويف البطني الأيمن العلوي، مسؤول عن إزالة السموم، استقلاب الكربوهيدرات، وتخزين الجليكوجين.',
    microgravityImpact: [
      'تغير حركية الدواء (Pharmacokinetics) داخل الجسم نتيجة تغير تدفق الدم عبر الوريد البابي الكبدي.',
      'احتمال تباطؤ استقلاب بعض المسكنات والمضادات الحيوية، مما يتطلب تعديل الجرعات العلاجية لرواد الفضاء.',
      'تغيرات طفيفة في تخزين الدهون بالجسم بسبب انعدام النشاط العضلي الطبيعي للوقوف.'
    ],
    nasaCountermeasure: 'مراقبة دورية للاستقلاب الدوائي وضبط الصيدلية الفضائية وفق دراسات التوافر الحيوي الدوائي في الجاذبية الصغرى.',
    simulationNote: 'التموضع التشريحي الحشوي يتبع بدقة تجويف المراق الأيمن أسفل الحجاب الحاجز.'
  },
  kidneys: {
    id: 'kidneys',
    name: 'الكليتان والتحكم بالسائل البولي',
    nameEn: 'Kidneys & Renal Regulation',
    system: 'visceral',
    systemEn: 'Visceral & Metabolic',
    cameraTarget: [0, 1.08, 0],
    cameraPos: [0, 1.10, 0.65],
    metrics: [
      { label: 'معدل الترشيح الكبيبي (GFR)', key: 'gfr', unit: 'mL/min', defaultVal: 115, normalRange: '90 - 120' },
      { label: 'تركيز البول (Specific Gravity)', key: 'sg', unit: '', defaultVal: '1.018', normalRange: '1.010 - 1.025' },
      { label: 'حجم البول اليومي', key: 'urineOutput', unit: 'mL/day', defaultVal: 1650, normalRange: '1500 - 2000' },
      { label: 'مؤشر تشكل الحصوات', key: 'stoneRisk', unit: 'Risk', defaultVal: 'LOW (1.2x)', normalRange: '< 1.5x' }
    ],
    physiologicalSummary: 'عضوان خلف الصفاق يقومان بفلترة الدم والحفاظ على التوازن الكهرلي والضغط التناضحي وحموضة الدم.',
    microgravityImpact: [
      'استجابة غاور-هنري (Gauer-Henry Reflex): الإحساس الخاطئ للقلب بزيادة حجم الدم في البداية يحفز إدرار البول وفقدان السوائل.',
      'ارتفاع ملحوظ في تركيز الكالسيوم والفوسفات في البول بسبب تحلل العظام، مما يزيد خطر حصوات الكلى بنسبة تصل إلى 2-3 أضعاف.',
      'ضرورة الحفاظ الدقيق على كمية السوائل المستهلكة لضمان بقاء البول مخففاً وتجنب الجفاف الخلوي.'
    ],
    nasaCountermeasure: 'استهلاك إلزامي لما لا يقل عن 2.5 لتر ماء يومياً، مع مكملات سيترات البوتاسيوم (Potassium Citrate) لقلونة البول ومنع تبلور الكالسيوم.',
    simulationNote: 'النموذج يبرز التموضع الظهري خلف الصفاق بمستوى الفقرات الصدرية الأخيرة والقطنية.'
  }
};
