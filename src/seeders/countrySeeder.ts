import { Country } from "../models/Country/country.model.js";
import dbconnect from "../config/dbConnect.js";

const countries = [
  {
    name: { en: "Egypt", ar: "مصر" },
    code: "EG",
    cities: [
      { name: { en: "Cairo", ar: "القاهرة" } },
      { name: { en: "Giza", ar: "الجيزة" } },
      { name: { en: "Alexandria", ar: "الإسكندرية" } },
      { name: { en: "Mansoura", ar: "المنصورة" } },
    ],
  },
  {
    name: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
    code: "SA",
    cities: [
      { name: { en: "Riyadh", ar: "الرياض" } },
      { name: { en: "Jeddah", ar: "جدة" } },
      { name: { en: "Mecca", ar: "مكة" } },
      { name: { en: "Medina", ar: "المدينة المنورة" } },
    ],
  },
  {
    name: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
    code: "AE",
    cities: [
      { name: { en: "Dubai", ar: "دبي" } },
      { name: { en: "Abu Dhabi", ar: "أبوظبي" } },
      { name: { en: "Sharjah", ar: "الشارقة" } },
    ],
  },
  {
    name: { en: "Kuwait", ar: "الكويت" },
    code: "KW",
    cities: [{ name: { en: "Kuwait City", ar: "مدينة الكويت" } }],
  },
  {
    name: { en: "Qatar", ar: "قطر" },
    code: "QA",
    cities: [{ name: { en: "Doha", ar: "الدوحة" } }],
  },
  {
    name: { en: "Jordan", ar: "الأردن" },
    code: "JO",
    cities: [
      { name: { en: "Amman", ar: "عمّان" } },
      { name: { en: "Zarqa", ar: "الزرقاء" } },
    ],
  },
  {
    name: { en: "Morocco", ar: "المغرب" },
    code: "MA",
    cities: [
      { name: { en: "Casablanca", ar: "الدار البيضاء" } },
      { name: { en: "Rabat", ar: "الرباط" } },
      { name: { en: "Marrakesh", ar: "مراكش" } },
    ],
  },
  {
    name: { en: "United Kingdom", ar: "المملكة المتحدة" },
    code: "GB",
    cities: [
      { name: { en: "London", ar: "لندن" } },
      { name: { en: "Manchester", ar: "مانشستر" } },
      { name: { en: "Liverpool", ar: "ليفربول" } },
    ],
  },
  {
    name: { en: "Germany", ar: "ألمانيا" },
    code: "DE",
    cities: [
      { name: { en: "Berlin", ar: "برلين" } },
      { name: { en: "Munich", ar: "ميونخ" } },
      { name: { en: "Hamburg", ar: "هامبورغ" } },
    ],
  },
  {
    name: { en: "France", ar: "فرنسا" },
    code: "FR",
    cities: [
      { name: { en: "Paris", ar: "باريس" } },
      { name: { en: "Lyon", ar: "ليون" } },
      { name: { en: "Marseille", ar: "مرسيليا" } },
    ],
  },
  {
    name: { en: "Italy", ar: "إيطاليا" },
    code: "IT",
    cities: [
      { name: { en: "Rome", ar: "روما" } },
      { name: { en: "Milan", ar: "ميلانو" } },
      { name: { en: "Naples", ar: "نابولي" } },
    ],
  },
  {
    name: { en: "Spain", ar: "إسبانيا" },
    code: "ES",
    cities: [
      { name: { en: "Madrid", ar: "مدريد" } },
      { name: { en: "Barcelona", ar: "برشلونة" } },
      { name: { en: "Valencia", ar: "فالنسيا" } },
    ],
  },
  {
    name: { en: "India", ar: "الهند" },
    code: "IN",
    cities: [
      { name: { en: "Delhi", ar: "نيودلهي" } },
      { name: { en: "Mumbai", ar: "مومباي" } },
      { name: { en: "Bangalore", ar: "بنغالورو" } },
    ],
  },
  {
    name: { en: "China", ar: "الصين" },
    code: "CN",
    cities: [
      { name: { en: "Beijing", ar: "بكين" } },
      { name: { en: "Shanghai", ar: "شنغهاي" } },
      { name: { en: "Shenzhen", ar: "شنتشن" } },
    ],
  },
  {
    name: { en: "Japan", ar: "اليابان" },
    code: "JP",
    cities: [
      { name: { en: "Tokyo", ar: "طوكيو" } },
      { name: { en: "Osaka", ar: "أوساكا" } },
      { name: { en: "Kyoto", ar: "كيوتو" } },
    ],
  },
  {
    name: { en: "South Korea", ar: "كوريا الجنوبية" },
    code: "KR",
    cities: [
      { name: { en: "Seoul", ar: "سيول" } },
      { name: { en: "Busan", ar: "بوسان" } },
    ],
  },
  {
    name: { en: "South Africa", ar: "جنوب أفريقيا" },
    code: "ZA",
    cities: [
      { name: { en: "Cape Town", ar: "كيب تاون" } },
      { name: { en: "Johannesburg", ar: "جوهانسبرغ" } },
    ],
  },
  {
    name: { en: "Nigeria", ar: "نيجيريا" },
    code: "NG",
    cities: [
      { name: { en: "Lagos", ar: "لاغوس" } },
      { name: { en: "Abuja", ar: "أبوجا" } },
    ],
  },
  {
    name: { en: "Kenya", ar: "كينيا" },
    code: "KE",
    cities: [
      { name: { en: "Nairobi", ar: "نيروبي" } },
      { name: { en: "Mombasa", ar: "مومباسا" } },
    ],
  },
  {
    name: { en: "United States", ar: "الولايات المتحدة" },
    code: "US",
    cities: [
      { name: { en: "New York", ar: "نيويورك" } },
      { name: { en: "Los Angeles", ar: "لوس أنجلوس" } },
      { name: { en: "Chicago", ar: "شيكاغو" } },
    ],
  },
  {
    name: { en: "Canada", ar: "كندا" },
    code: "CA",
    cities: [
      { name: { en: "Toronto", ar: "تورونتو" } },
      { name: { en: "Vancouver", ar: "فانكوفر" } },
      { name: { en: "Montreal", ar: "مونتريال" } },
    ],
  },
  {
    name: { en: "Brazil", ar: "البرازيل" },
    code: "BR",
    cities: [
      { name: { en: "São Paulo", ar: "ساو باولو" } },
      { name: { en: "Rio de Janeiro", ar: "ريو دي جانيرو" } },
    ],
  },
  {
    name: { en: "Mexico", ar: "المكسيك" },
    code: "MX",
    cities: [
      { name: { en: "Mexico City", ar: "مكسيكو سيتي" } },
      { name: { en: "Guadalajara", ar: "غوادالاخارا" } },
    ],
  },
];

const seedCountries = async () => {
  try {
    await dbconnect();

    await Country.deleteMany();

    await Country.insertMany(countries);

    console.log("Countries seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Country seeding failed", error);
    process.exit(1);
  }
};

seedCountries();
