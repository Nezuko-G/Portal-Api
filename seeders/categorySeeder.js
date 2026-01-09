import { slugify } from "../utils/helpers.js";
import dbconnect from "../config/dbConnect.js";
import { Category } from "../models/Category/category.model.js";
import { JOB_CATEGORIES } from "../utils/constants.js";

const categories = JOB_CATEGORIES.map((category) => ({
  name: category,
  slug: slugify(category),
  description: `${category} related jobs and opportunities.`,
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
