import dbconnect from "../config/dbConnect.js";
import { Faq } from "../models/FAQ/faq.model.js";

const faqs = [
  {
    question: {
      en: "What is this service?",
      ar: "ما هي هذه الخدمة؟",
    },
    answer: {
      en: "This service helps you manage your tasks efficiently.",
      ar: "تساعدك هذه الخدمة على إدارة مهامك بكفاءة.",
    },
  },
  {
    question: {
      en: "How can I reset my password?",
      ar: "كيف يمكنني إعادة تعيين كلمة المرور الخاصة بي؟",
    },
    answer: {
      en: "Click on forgot password and follow the instructions.",
      ar: "انقر على نسيت كلمة المرور واتبع التعليمات.",
    },
  },
  {
    question: {
      en: "Is this service free?",
      ar: "هل هذه الخدمة مجانية؟",
    },
    answer: {
      en: "Yes, we offer a free plan with basic features.",
      ar: "نعم، نقدم خطة مجانية مع ميزات أساسية.",
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
      ar: "انقر على زر التسجيل وملء المعلومات المطلوبة.",
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
    question: {
      en: "Is my data secure?",
      ar: "هل بيانات آمنة؟",
    },
    answer: {
      en: "Yes, we use industry-standard security measures to protect your data.",
      ar: "نعم، نستخدم معايير الأمان الصناعية لحماية بياناتك.",
    },
  },
  {
    question: {
      en: "Can I delete my account?",
      ar: "هل يمكنني حذف حسابي؟",
    },
    answer: {
      en: "Yes, you can delete your account permanently from the settings page.",
      ar: "نعم، يمكنك حذف حسابك بشكل دائم من صفحة الإعدادات.",
    },
  },
  {
    question: {
      en: "Do you support multiple devices?",
      ar: "هل تدعمون أجهزة متعددة؟",
    },
    answer: {
      en: "Yes, you can access your account from multiple devices.",
      ar: "نعم، يمكنك الوصول إلى حسابك من أجهزة متعددة.",
    },
  },
  {
    question: {
      en: "What payment methods are accepted?",
      ar: "ما طرق الدفع المقبولة؟",
    },
    answer: {
      en: "We accept credit cards, debit cards, and online payment methods.",
      ar: "نقبل بطاقات الائتمان والخصم وطرق الدفع عبر الإنترنت.",
    },
  },
  {
    question: {
      en: "Can I upgrade my plan later?",
      ar: "هل يمكنني ترقية خطتي لاحقًا؟",
    },
    answer: {
      en: "Yes, you can upgrade or downgrade your plan at any time.",
      ar: "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت.",
    },
  },
  {
    question: {
      en: "Do you offer refunds?",
      ar: "هل تقدمون استردادات؟",
    },
    answer: {
      en: "Refunds are available according to our refund policy.",
      ar: "استردادات متاحة وفقا لسياسة الاسترجاع الخاصة بنا.",
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
