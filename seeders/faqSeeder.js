import dbconnect from "../config/dbConnect.js";
import { Faq } from "../models/FAQ/faq.model.js";

const faqs = [
  {
    question: {
      en: "What is this service?",
      ar: "ما هذه الخدمة؟",
    },
    answer: {
      en: "This service helps you manage your tasks efficiently.",
      ar: "تساعدك هذه الخدمة على إدارة مهامك بكفاءة.",
    },
  },
  {
    question: {
      en: "How can I reset my password?",
      ar: "كيف يمكنني إعادة تعيين كلمة المرور؟",
    },
    answer: {
      en: "Click on forgot password and follow the instructions.",
      ar: "اضغط على نسيت كلمة المرور واتبع التعليمات.",
    },
  },
  {
    question: { en: "Is this service free?", ar: "هل هذه الخدمة مجانية؟" },
    answer: {
      en: "Yes, we offer a free plan with basic features.",
      ar: "نعم، نقدم خطة مجانية بالميزات الأساسية.",
    },
  },
  {
    question: {
      en: "How can I contact support?",
      ar: "كيف يمكنني التواصل مع الدعم؟",
    },
    answer: {
      en: "You can contact us via email or live chat.",
      ar: "يمكنك التواصل معنا عبر البريد الإلكتروني أو الدردشة المباشرة.",
    },
  },
  {
    question: {
      en: "How do I create an account?",
      ar: "كيف أنشئ حسابًا؟",
    },
    answer: {
      en: "Click on the sign-up button and fill in the required information.",
      ar: "اضغط على زر التسجيل واملأ المعلومات المطلوبة.",
    },
  },
  {
    question: {
      en: "Can I change my email address?",
      ar: "هل يمكنني تغيير عنوان بريدي الإلكتروني؟",
    },
    answer: {
      en: "Yes, you can update your email from your account settings.",
      ar: "نعم، يمكنك تحديث بريدك الإلكتروني من إعدادات حسابك.",
    },
  },
  {
    question: { en: "Is my data secure?", ar: "هل بياناتي آمنة؟" },
    answer: {
      en: "Yes, we use industry-standard security measures to protect your data.",
      ar: "نعم، نستخدم إجراءات أمان قياسية لحماية بياناتك.",
    },
  },
  {
    question: {
      en: "Can I delete my account?",
      ar: "هل يمكنني حذف حسابي؟",
    },
    answer: {
      en: "Yes, you can delete your account permanently from the settings page.",
      ar: "نعم، يمكنك حذف حسابك نهائيًا من صفحة الإعدادات.",
    },
  },
  {
    question: {
      en: "Do you support multiple devices?",
      ar: "هل تدعمون عدة أجهزة؟",
    },
    answer: {
      en: "Yes, you can access your account from multiple devices.",
      ar: "نعم، يمكنك الوصول إلى حسابك من عدة أجهزة.",
    },
  },
  {
    question: {
      en: "What payment methods are accepted?",
      ar: "ما طرق الدفع المقبولة؟",
    },
    answer: {
      en: "We accept credit cards, debit cards, and online payment methods.",
      ar: "نقبل البطاقات الائتمانية وبطاقات الخصم وطرق الدفع الإلكترونية.",
    },
  },
  {
    question: {
      en: "Can I upgrade my plan later?",
      ar: "هل يمكنني ترقية خطتي لاحقًا؟",
    },
    answer: {
      en: "Yes, you can upgrade or downgrade your plan at any time.",
      ar: "نعم، يمكنك ترقية خطتك أو تخفيضها في أي وقت.",
    },
  },
  {
    question: { en: "Do you offer refunds?", ar: "هل تقدمون استردادًا؟" },
    answer: {
      en: "Refunds are available according to our refund policy.",
      ar: "الاستردادات متاحة وفقًا لسياسة الاسترداد لدينا.",
    },
  },
  {
    question: {
      en: "How often is my data backed up?",
      ar: "كم مرة يتم نسخ بياناتي احتياطيًا؟",
    },
    answer: {
      en: "We back up your data regularly to prevent any loss.",
      ar: "نقوم بنسخ بياناتك احتياطيًا بانتظام لمنع أي فقدان.",
    },
  },
  {
    question: {
      en: "Is customer support available 24/7?",
      ar: "هل الدعم متاح على مدار الساعة؟",
    },
    answer: {
      en: "Yes, our support team is available 24/7 to assist you.",
      ar: "نعم، فريق الدعم متاح على مدار الساعة لمساعدتك.",
    },
  },
  {
    question: {
      en: "Can I use the service on mobile?",
      ar: "هل يمكنني استخدام الخدمة على الهاتف المحمول؟",
    },
    answer: {
      en: "Yes, the service is fully responsive and works on mobile devices.",
      ar: "نعم، الخدمة متجاوبة بالكامل وتعمل على الأجهزة المحمولة.",
    },
  },
  {
    question: {
      en: "How do I reset my notifications?",
      ar: "كيف أعيد ضبط الإشعارات؟",
    },
    answer: {
      en: "You can manage notification settings from your profile preferences.",
      ar: "يمكنك إدارة إعدادات الإشعارات من تفضيلات الملف الشخصي.",
    },
  },
  {
    question: {
      en: "Is there a limit to the number of tasks?",
      ar: "هل يوجد حد لعدد المهام؟",
    },
    answer: {
      en: "Limits depend on your subscription plan.",
      ar: "تعتمد الحدود على خطة الاشتراك الخاصة بك.",
    },
  },
  {
    question: {
      en: "Can I collaborate with other users?",
      ar: "هل يمكنني التعاون مع مستخدمين آخرين؟",
    },
    answer: {
      en: "Yes, you can invite other users to collaborate on tasks.",
      ar: "نعم، يمكنك دعوة مستخدمين آخرين للتعاون في المهام.",
    },
  },
  {
    question: {
      en: "How do I report a bug?",
      ar: "كيف أبلغ عن خطأ؟",
    },
    answer: {
      en: "You can report bugs via the support page or email.",
      ar: "يمكنك الإبلاغ عن الأخطاء عبر صفحة الدعم أو البريد الإلكتروني.",
    },
  },
  {
    question: { en: "Do you provide updates?", ar: "هل تقدمون تحديثات؟" },
    answer: {
      en: "Yes, we regularly release updates with new features and improvements.",
      ar: "نعم، نصدر تحديثات بانتظام مع ميزات وتحسينات جديدة.",
    },
  },
];

const seedFaqs = async () => {
  try {
    await dbconnect();

    await Faq.deleteMany();

    await Faq.insertMany(faqs);

    console.log("FAQs seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("FAQ seeding failed", error);
    process.exit(1);
  }
};

seedFaqs();
