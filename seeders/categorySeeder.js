import { slugify } from "../utils/helpers.js";
import dbconnect from "../config/dbConnect.js";
import { Category } from "../models/Category/category.model.js";

const categories = [
  {
    name: { en: "Engineering", ar: "الهندسة" },
    slug: slugify("Engineering"),
    description: {
      en: "Engineering related jobs and opportunities.",
      ar: "الوظائف والفرص المتعلقة بالهندسة.",
    },
    keywords: ["engineering", "design", "construction"],
  },
  {
    name: { en: "Information Technology", ar: "تكنولوجيا المعلومات" },
    slug: slugify("Information Technology"),
    description: {
      en: "Information Technology related jobs and opportunities.",
      ar: "الوظائف والفرص المتعلقة بتكنولوجيا المعلومات.",
    },
    keywords: ["it", "software", "development"],
  },
  {
    name: { en: "Healthcare", ar: "الرعاية الصحية" },
    slug: slugify("Healthcare"),
    description: {
      en: "Healthcare related jobs and opportunities.",
      ar: "الوظائف والفرص المتعلقة بالرعاية الصحية.",
    },
    keywords: ["healthcare", "medical", "nursing"],
  },
  {
    name: { en: "Sales & Marketing", ar: "المبيعات والتسويق" },
    slug: slugify("Sales & Marketing"),
    description: {
      en: "Sales and Marketing related jobs and opportunities.",
      ar: "الوظائف والفرص المتعلقة بالمبيعات والتسويق.",
    },
    keywords: ["sales", "marketing", "business"],
  },
  {
    name: { en: "Finance & Accounting", ar: "المالية والمحاسبة" },
    slug: slugify("Finance & Accounting"),
    description: {
      en: "Finance and Accounting related jobs and opportunities.",
      ar: "الوظائف والفرص المتعلقة بالمالية والمحاسبة.",
    },
    keywords: ["finance", "accounting", "cfo"],
  },
  {
    name: { en: "Human Resources", ar: "الموارد البشرية" },
    slug: slugify("Human Resources"),
    description: {
      en: "Human Resources related jobs and opportunities.",
      ar: "الوظائف والفرص المتعلقة بالموارد البشرية.",
    },
    keywords: ["hr", "recruitment", "talent"],
  },
  {
    name: { en: "Operations & Supply Chain", ar: "العمليات وسلسلة التوريد" },
    slug: slugify("Operations & Supply Chain"),
    description: {
      en: "Operations and Supply Chain related jobs and opportunities.",
      ar: "الوظائف والفرص المتعلقة بالعمليات وسلسلة التوريد.",
    },
    keywords: ["operations", "supply", "chain"],
  },
  {
    name: { en: "Customer Service", ar: "خدمة العملاء" },
    slug: slugify("Customer Service"),
    description: {
      en: "Customer Service related jobs and opportunities.",
      ar: "الوظائف والفرص المتعلقة بخدمة العملاء.",
    },
    keywords: ["customer", "service", "support"],
  },
  {
    name: { en: "Research & Development", ar: "البحث والتطوير" },
    slug: slugify("Research & Development"),
    description: {
      en: "Research and Development related jobs and opportunities.",
      ar: "الوظائف والفرص المتعلقة بالبحث والتطوير.",
    },
    keywords: ["research", "development", "innovation"],
  },
];

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
