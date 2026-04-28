import { slugify } from "../utils/helpers.js";
import dbconnect from "../config/dbConnect.js";
import { ExperienceLevelModel } from "../models/ExperienceLevel/experience.level.model.js";

const EXPERIENCE_LEVELS = [
  { en: "Internship", ar: "تدريب", minYears: 0, maxYears: 0 },
  { en: "Entry Level", ar: "مبتدئ", minYears: 0, maxYears: 1 },
  { en: "Junior", ar: "مبتدئ متقدم", minYears: 1, maxYears: 3 },
  { en: "Mid Level", ar: "متوسط", minYears: 3, maxYears: 5 },
  { en: "Senior", ar: "كبير", minYears: 5, maxYears: 8 },
  { en: "Lead", ar: "قائد", minYears: 8, maxYears: 12 },
  { en: "Manager", ar: "مدير", minYears: 10, maxYears: 15 },
  { en: "Director", ar: "مدير تنفيذي", minYears: 12, maxYears: 20 },
  { en: "Executive", ar: "تنفيذي", minYears: 15, maxYears: 30 },
];

const experienceLevels = EXPERIENCE_LEVELS.map((level) => ({
  title: { en: level.en, ar: level.ar },
  slug: slugify(level.en),
  minYears: level.minYears,
  maxYears: level.maxYears,
}));

const seedExperienceLevels = async () => {
  try {
    await dbconnect();

    await ExperienceLevelModel.deleteMany();

    await ExperienceLevelModel.insertMany(experienceLevels);

    console.log("Experience levels seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed ", error);
    process.exit(1);
  }
};

seedExperienceLevels();
