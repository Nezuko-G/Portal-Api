import { slugify } from "../utils/helpers.js";
import dbconnect from "../config/dbConnect.js";
import { Category } from "../models/Category/category.model.js";
import { JOB_CATEGORIES } from "../utils/constants.js";

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  Engineering: "الهندسة",
  "Information Technology": "تكنولوجيا المعلومات",
  Healthcare: "الرعاية الصحية",
  "Sales & Marketing": "المبيعات والتسويق",
  "Finance & Accounting": "المالية والمحاسبة",
  "Human Resources": "الموارد البشرية",
  "Operations & Supply Chain": "العمليات وسلسلة التوريد",
  "Customer Service": "خدمة العملاء",
  "Research & Development": "البحث والتطوير",
  "Manufacturing & Production": "التصنيع والإنتاج",
  "Quality Assurance": "ضمان الجودة",
  "Legal & Compliance": "القانون والامتثال",
  "Project Management": "إدارة المشاريع",
  "Business Development": "تطوير الأعمال",
  Administration: "الإدارة",
  "Design & Creative": "التصميم والإبداع",
  "Data & Analytics": "البيانات والتحليلات",
  Consulting: "الاستشارات",
  "Education & Training": "التعليم والتدريب",
  "Logistics & Transportation": "اللوجستيات والنقل",
};

const categories = JOB_CATEGORIES.map((category: string) => ({
  name: {
    en: category,
    ar: CATEGORY_TRANSLATIONS[category] || category,
  },
  slug: slugify(category),
  description: {
    en: `${category} related jobs and opportunities.`,
    ar: `وظائف وفرص مرتبطة بـ${CATEGORY_TRANSLATIONS[category] || category}.`,
  },
  keywords: category
    .toLowerCase()
    .split(/[\s&]+/)
    .filter(Boolean),
}));

const seedCategories = async () => {
  try {
    await dbconnect();

    await Category.deleteMany();

    await Category.insertMany(categories);

    console.log("Job categories seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Category seeding failed", error);
    process.exit(1);
  }
};

seedCategories();
