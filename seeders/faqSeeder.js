import dbconnect from "../config/dbConnect.js";
import { Faq } from "../models/FAQ/faq.model.js";

const faqs = [
  {
    question: "What is this service?",
    answer: "This service helps you manage your tasks efficiently.",
  },
  {
    question: "How can I reset my password?",
    answer: "Click on forgot password and follow the instructions.",
  },
  {
    question: "Is this service free?",
    answer: "Yes, we offer a free plan with basic features.",
  },
  {
    question: "How can I contact support?",
    answer: "You can contact us via email or live chat.",
  },
  {
    question: "How do I create an account?",
    answer: "Click on the sign-up button and fill in the required information.",
  },
  {
    question: "Can I change my email address?",
    answer: "Yes, you can update your email from your account settings.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use industry-standard security measures to protect your data.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes, you can delete your account permanently from the settings page.",
  },
  {
    question: "Do you support multiple devices?",
    answer: "Yes, you can access your account from multiple devices.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept credit cards, debit cards, and online payment methods.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Refunds are available according to our refund policy.",
  },
  {
    question: "How often is my data backed up?",
    answer: "We back up your data regularly to prevent any loss.",
  },
  {
    question: "Is customer support available 24/7?",
    answer: "Yes, our support team is available 24/7 to assist you.",
  },
  {
    question: "Can I use the service on mobile?",
    answer: "Yes, the service is fully responsive and works on mobile devices.",
  },
  {
    question: "How do I reset my notifications?",
    answer:
      "You can manage notification settings from your profile preferences.",
  },
  {
    question: "Is there a limit to the number of tasks?",
    answer: "Limits depend on your subscription plan.",
  },
  {
    question: "Can I collaborate with other users?",
    answer: "Yes, you can invite other users to collaborate on tasks.",
  },
  {
    question: "How do I report a bug?",
    answer: "You can report bugs via the support page or email.",
  },
  {
    question: "Do you provide updates?",
    answer:
      "Yes, we regularly release updates with new features and improvements.",
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
