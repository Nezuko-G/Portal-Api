import dbconnect from "../config/dbConnect.js";
import { JobModel } from "../models/Job/job.model.js";
import { Category } from "../models/Category/category.model.js";
import { ExperienceLevelModel } from "../models/ExperienceLevel/experience.level.model.js";
import { KeywordModel } from "../models/Keyword/keyword.model.js";
import { Country } from "../models/Country/country.model.js";
import { slugify } from "../utils/helpers.js";

const JOB_COUNT = 50;

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const localizedText = (en, ar) => ({ en, ar });

const seedJobs = async () => {
  try {
    await dbconnect();

    await JobModel.deleteMany();

    const categories = await Category.find();
    const expLevels = await ExperienceLevelModel.find();
    const keywords = await KeywordModel.find();
    const countries = await Country.find();

    const jobs = [];

    for (let i = 1; i <= JOB_COUNT; i++) {
      const category = getRandom(categories);
      const expLevel = getRandom(expLevels);
      const country = getRandom(countries);
      const durationMonths = Math.floor(Math.random() * 12) + 1;

      // pick 2-4 random keywords
      const jobKeywords = [];
      const shuffledKeywords = keywords.sort(() => 0.5 - Math.random());
      jobKeywords.push(
        ...shuffledKeywords.slice(0, Math.floor(Math.random() * 3) + 2),
      );

      jobs.push({
        title: localizedText(
          `${category.name.en} Specialist ${i}`,
          `${category.name.ar} - أخصائي ${i}`,
        ),
        slug: slugify(`${category.name.en}-specialist-${i}`),
        jobId: `JOB${String(i).padStart(3, "0")}`,
        company: `Company ${i}`,
        organization: `Organization ${i}`,
        description: localizedText(
          `We are looking for a talented ${category.name.en} specialist to join our team.`,
          `نبحث عن متخصص موهوب في ${category.name.ar} للانضمام إلى فريقنا.`,
        ),
        fieldOfWork: category._id,
        experienceLevel: expLevel._id,
        keywords: jobKeywords.map((k) => k._id),
        jobType: getRandom(["full-time", "part-time", "internship"]),
        employmentType: getRandom(["permanent", "fixed-term", "contract"]),
        responsibilities: [
          {
            text: localizedText(
              "Complete assigned tasks",
              "إكمال المهام الموكلة",
            ),
          },
          {
            text: localizedText(
              "Collaborate with team members",
              "التعاون مع أعضاء الفريق",
            ),
          },
        ],
        requirements: [
          {
            text: localizedText(
              `${expLevel.title.en} experience required`,
              `مطلوب خبرة بمستوى ${expLevel.title.ar}`,
            ),
          },
          {
            text: localizedText(
              "Relevant technical skills",
              "مهارات تقنية ذات صلة",
            ),
          },
        ],
        country: country._id,
        locationDetails: localizedText(
          `${country.name.en} - City Center`,
          `وسط المدينة - ${country.name.ar}`,
        ),
        workMode: getRandom(["office", "remote", "hybrid"]),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        duration: localizedText(
          `${durationMonths} months`,
          `${durationMonths} شهرًا`,
        ),
      });
    }

    await JobModel.insertMany(jobs);

    console.log(`${JOB_COUNT} Jobs seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Job seeding failed", error);
    process.exit(1);
  }
};

seedJobs();
