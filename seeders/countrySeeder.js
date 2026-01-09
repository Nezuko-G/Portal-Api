import { Country } from "../models/Country/country.model.js";
import dbconnect from "../config/dbConnect.js";

const countries = [
  // 🌍 Middle East & Arab Countries
  {
    name: "Egypt",
    code: "EG",
    cities: [
      { name: "Cairo" },
      { name: "Giza" },
      { name: "Alexandria" },
      { name: "Mansoura" },
    ],
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    cities: [
      { name: "Riyadh" },
      { name: "Jeddah" },
      { name: "Mecca" },
      { name: "Medina" },
    ],
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    cities: [{ name: "Dubai" }, { name: "Abu Dhabi" }, { name: "Sharjah" }],
  },
  {
    name: "Kuwait",
    code: "KW",
    cities: [{ name: "Kuwait City" }],
  },
  {
    name: "Qatar",
    code: "QA",
    cities: [{ name: "Doha" }],
  },
  {
    name: "Jordan",
    code: "JO",
    cities: [{ name: "Amman" }, { name: "Zarqa" }],
  },
  {
    name: "Morocco",
    code: "MA",
    cities: [{ name: "Casablanca" }, { name: "Rabat" }, { name: "Marrakesh" }],
  },

  // 🌍 Europe
  {
    name: "United Kingdom",
    code: "GB",
    cities: [{ name: "London" }, { name: "Manchester" }, { name: "Liverpool" }],
  },
  {
    name: "Germany",
    code: "DE",
    cities: [{ name: "Berlin" }, { name: "Munich" }, { name: "Hamburg" }],
  },
  {
    name: "France",
    code: "FR",
    cities: [{ name: "Paris" }, { name: "Lyon" }, { name: "Marseille" }],
  },
  {
    name: "Italy",
    code: "IT",
    cities: [{ name: "Rome" }, { name: "Milan" }, { name: "Naples" }],
  },
  {
    name: "Spain",
    code: "ES",
    cities: [{ name: "Madrid" }, { name: "Barcelona" }, { name: "Valencia" }],
  },

  // 🌏 Asia
  {
    name: "India",
    code: "IN",
    cities: [{ name: "Delhi" }, { name: "Mumbai" }, { name: "Bangalore" }],
  },
  {
    name: "China",
    code: "CN",
    cities: [{ name: "Beijing" }, { name: "Shanghai" }, { name: "Shenzhen" }],
  },
  {
    name: "Japan",
    code: "JP",
    cities: [{ name: "Tokyo" }, { name: "Osaka" }, { name: "Kyoto" }],
  },
  {
    name: "South Korea",
    code: "KR",
    cities: [{ name: "Seoul" }, { name: "Busan" }],
  },

  // 🌍 Africa
  {
    name: "South Africa",
    code: "ZA",
    cities: [{ name: "Cape Town" }, { name: "Johannesburg" }],
  },
  {
    name: "Nigeria",
    code: "NG",
    cities: [{ name: "Lagos" }, { name: "Abuja" }],
  },
  {
    name: "Kenya",
    code: "KE",
    cities: [{ name: "Nairobi" }, { name: "Mombasa" }],
  },

  // 🌎 Americas
  {
    name: "United States",
    code: "US",
    cities: [
      { name: "New York" },
      { name: "Los Angeles" },
      { name: "Chicago" },
    ],
  },
  {
    name: "Canada",
    code: "CA",
    cities: [{ name: "Toronto" }, { name: "Vancouver" }, { name: "Montreal" }],
  },
  {
    name: "Brazil",
    code: "BR",
    cities: [{ name: "São Paulo" }, { name: "Rio de Janeiro" }],
  },
  {
    name: "Mexico",
    code: "MX",
    cities: [{ name: "Mexico City" }, { name: "Guadalajara" }],
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
