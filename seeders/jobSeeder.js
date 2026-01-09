import dbconnect from "../config/dbConnect.js";
import { Job } from "../models/Job/job.model.js";
import { Category } from "../models/Category/category.model.js";
import { ExperienceLevel } from "../models/ExperienceLevel/experience.level.model.js";
import { Keyword } from "../models/keyword/keyword.model.js";
import { Country } from "../models/Country/country.model.js";
import { slugify } from "../utils/helpers.js";

const JOB_COUNT = 50;

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedJobs = async () => {
  try {
    await dbconnect();

    await Job.deleteMany();

    const categories = await Category.find();
    const expLevels = await ExperienceLevel.find();
    const keywords = await Keyword.find();
    const countries = await Country.find();

    const jobs = [];

    for (let i = 1; i <= JOB_COUNT; i++) {
      const category = getRandom(categories);
      const expLevel = getRandom(expLevels);
      const country = getRandom(countries);

      // pick 2-4 random keywords
      const jobKeywords = [];
      const shuffledKeywords = keywords.sort(() => 0.5 - Math.random());
      jobKeywords.push(
        ...shuffledKeywords.slice(0, Math.floor(Math.random() * 3) + 2)
      );

      jobs.push({
        title: `${category.name} Specialist ${i}`,
        slug: slugify(`${category.name}-specialist-${i}`),
        jobId: `JOB${String(i).padStart(3, "0")}`,
        company: `Company ${i}`,
        organization: `Organization ${i}`,
        description: `We are looking for a talented ${category.name} specialist to join our team.`,
        fieldOfWork: category._id,
        experienceLevel: expLevel._id,
        keywords: jobKeywords.map((k) => k._id),
        jobType: getRandom(["full-time", "part-time", "internship"]),
        employmentType: getRandom(["permanent", "fixed-term", "contract"]),
        responsibilities: [
          { text: "Complete assigned tasks" },
          { text: "Collaborate with team members" },
        ],
        requirements: [
          { text: `${expLevel.title.en} experience required` },
          { text: "Relevant technical skills" },
        ],
        country: country._id,
        locationDetails: `${country.name} - City Center`,
        workMode: getRandom(["office", "remote", "hybrid"]),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        duration: `${Math.floor(Math.random() * 12) + 1} months`,
      });
    }

    await Job.insertMany(jobs);

    console.log(`${JOB_COUNT} Jobs seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Job seeding failed", error);
    process.exit(1);
  }
};

seedJobs();
