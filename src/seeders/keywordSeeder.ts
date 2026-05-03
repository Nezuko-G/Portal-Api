import { slugify } from "../utils/helpers.js";
import dbconnect from "../config/dbConnect.js";
import { KeywordModel } from "../models/Keyword/keyword.model.js";

const JOB_CATEGORIES_AR = [
  "الهندسة",
  "تكنولوجيا المعلومات",
  "الرعاية الصحية",
  "المبيعات والتسويق",
  "المالية والمحاسبة",
  "الموارد البشرية",
  "العمليات وسلسلة التوريد",
  "خدمة العملاء",
  "البحث والتطوير",
  "التصنيع والإنتاج",
  "ضمان الجودة",
  "القانون والامتثال",
  "إدارة المشاريع",
  "تطوير الأعمال",
  "الإدارة",
  "التصميم والإبداع",
  "البيانات والتحليلات",
  "الاستشارات",
  "التعليم والتدريب",
  "اللوجستيات والنقل",
];

const JOB_CATEGORIES_EN = [
  "Engineering",
  "Information Technology",
  "Healthcare",
  "Sales & Marketing",
  "Finance & Accounting",
  "Human Resources",
  "Operations & Supply Chain",
  "Customer Service",
  "Research & Development",
  "Manufacturing & Production",
  "Quality Assurance",
  "Legal & Compliance",
  "Project Management",
  "Business Development",
  "Administration",
  "Design & Creative",
  "Data & Analytics",
  "Consulting",
  "Education & Training",
  "Logistics & Transportation",
];

const keywords = JOB_CATEGORIES_EN.map((category, index) => ({
  word: {
    en: category,
    ar: JOB_CATEGORIES_AR[index],
  },
  slug: slugify(category),
}));

const seedKeywords = async () => {
  try {
    await dbconnect();

    await KeywordModel.deleteMany();

    await KeywordModel.insertMany(keywords);

    console.log("Keywords seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Keyword seeding failed", error);
    process.exit(1);
  }
};

seedKeywords();
