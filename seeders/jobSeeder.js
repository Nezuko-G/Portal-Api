import dbconnect from "../config/dbConnect.js";
import { Job } from "../models/Job/job.model.js";
import { Category } from "../models/Category/category.model.js";
import { ExperienceLevel } from "../models/ExperienceLevel/experience.level.model.js";
import { Keyword } from "../models/keyword/keyword.model.js";
import { Country } from "../models/Country/country.model.js";
import { slugify } from "../utils/helpers.js";

const JOB_COUNT = 50;

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const jobTitles = [
  {
    en: "Software Developer",
    ar: "مطور برمجيات",
  },
  {
    en: "Data Analyst",
    ar: "محلل بيانات",
  },
  {
    en: "Project Manager",
    ar: "مدير مشروع",
  },
  {
    en: "Business Analyst",
    ar: "محلل أعمال",
  },
  {
    en: "Systems Administrator",
    ar: "مسؤول أنظمة",
  },
  {
    en: "DevOps Engineer",
    ar: "مهندس DevOps",
  },
  {
    en: "Frontend Developer",
    ar: "مطور واجهات أمامية",
  },
  {
    en: "Backend Developer",
    ar: "مطور واجهات خلفية",
  },
];

const companies = [
  { en: "Tech Solutions Inc", ar: "شركة حلول التكنولوجيا" },
  { en: "Digital Innovations Ltd", ar: "شركة الابتكارات الرقمية" },
  { en: "Global Systems Corp", ar: "شركة الأنظمة العالمية" },
  { en: "Future Tech Group", ar: "مجموعة تكنولوجيا المستقبل" },
];

const responsibilities = {
  en: [
    { text: "Develop and maintain software applications" },
    { text: "Collaborate with cross-functional teams" },
    { text: "Participate in code reviews and quality assurance" },
    { text: "Document technical specifications" },
  ],
  ar: [
    { text: "تطوير والمحافظة على تطبيقات البرمجيات" },
    { text: "التعاون مع فريق متعدد التخصصات" },
    { text: "المشاركة في مراجعة الأكواد وضمان الجودة" },
    { text: "توثيق المتطلبات التقنية" },
  ],
};

const requirements = {
  en: [
    { text: "Strong programming skills" },
    { text: "Experience with relevant technologies" },
    { text: "Excellent problem-solving abilities" },
    { text: "Good communication skills" },
  ],
  ar: [
    { text: "مهارات برمجية قوية" },
    { text: "خبرة بالتقنيات ذات الصلة" },
    { text: "القدرة على حل المشاكل بكفاءة" },
    { text: "مهارات تواصل جيدة" },
  ],
};

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
      const jobTitle = getRandom(jobTitles);
      const company = getRandom(companies);

      // pick 2-4 random keywords
      const jobKeywords = [];
      const shuffledKeywords = [...keywords].sort(() => 0.5 - Math.random());
      jobKeywords.push(
        ...shuffledKeywords.slice(0, Math.floor(Math.random() * 3) + 2),
      );

      const selectedResponsibilities = responsibilities.en.slice(0, 2);
      const selectedRequirements = requirements.en.slice(0, 2);

      jobs.push({
        title: {
          en: `${jobTitle.en} ${i}`,
          ar: `${jobTitle.ar} ${i}`,
        },
        slug: slugify(`${jobTitle.en}-${i}`),
        jobId: `JOB${String(i).padStart(3, "0")}`,
        company: company,
        organization: {
          en: `Organization ${i}`,
          ar: `المنظمة ${i}`,
        },
        description: {
          en: `We are looking for a talented ${jobTitle.en} to join our team and contribute to innovative projects.`,
          ar: `نحن نبحث عن ${jobTitle.ar} موهوب للانضمام إلى فريقنا والمساهمة في المشاريع المبتكرة.`,
        },
        fieldOfWork: category._id,
        experienceLevel: expLevel._id,
        keywords: jobKeywords.map((k) => k._id),
        jobType: getRandom(["full-time", "part-time", "internship"]),
        employmentType: getRandom(["permanent", "fixed-term", "contract"]),
        responsibilities: {
          en: selectedResponsibilities,
          ar: requirements.ar.slice(0, 2),
        },
        requirements: {
          en: selectedRequirements,
          ar: requirements.ar.slice(2, 4),
        },
        country: country._id,
        locationDetails: {
          en: `${country.name.en} - City Center`,
          ar: `${country.name.ar} - وسط المدينة`,
        },
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
