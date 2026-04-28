import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

const cacheMock = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

const createCategoryDocument = {
  _id: "cat-1",
  name: { en: "Engineering", ar: "الهندسة" },
  description: { en: "Engineering jobs", ar: "وظائف الهندسة" },
  slug: "engineering",
};

const createCountryDocument = {
  _id: "country-1",
  name: { en: "Egypt", ar: "مصر" },
  code: "EG",
  cities: [{ name: { en: "Cairo", ar: "القاهرة" } }],
};

const createFaqDocument = {
  _id: "faq-1",
  question: { en: "What is this service?", ar: "ما هذه الخدمة؟" },
  answer: {
    en: "This service helps you manage your tasks efficiently.",
    ar: "تساعدك هذه الخدمة على إدارة مهامك بكفاءة.",
  },
};

const CategoryMock = jest.fn();
CategoryMock.find = jest.fn();
CategoryMock.findOne = jest.fn();
CategoryMock.findById = jest.fn();
CategoryMock.findByIdAndUpdate = jest.fn();

const CountryMock = jest.fn();
CountryMock.find = jest.fn();
CountryMock.findOne = jest.fn();
CountryMock.findOneAndUpdate = jest.fn();
CountryMock.countDocuments = jest.fn();

const FaqMock = jest.fn();
FaqMock.find = jest.fn();
FaqMock.findOne = jest.fn();

jest.unstable_mockModule("../config/cache.js", () => ({
  cache: cacheMock,
}));

jest.unstable_mockModule("../models/Category/category.model.js", () => ({
  Category: CategoryMock,
}));

jest.unstable_mockModule("../models/Country/country.model.js", () => ({
  Country: CountryMock,
}));

jest.unstable_mockModule("../models/FAQ/faq.model.js", () => ({
  Faq: FaqMock,
}));

jest.unstable_mockModule(
  "../middlewares/authenticate_token.middlware.js",
  () => ({
    authenticateToken: (_req, _res, next) => next(),
  }),
);

jest.unstable_mockModule("../middlewares/check_roles.middleware.js", () => ({
  checkRole: () => (_req, _res, next) => next(),
}));

const { CategoryRouter } =
  await import("../routers/Category/category.router.js");
const { CountryRouter } = await import("../routers/Country/country.routes.js");
const { FAQRouter } = await import("../routers/FAQ/faq.route.js");

const buildApp = () => {
  const app = express();

  app.use(express.json());
  app.use((req, res, next) => {
    const translate = (key) => key;
    req.getLocale = () =>
      req.query.lang === "ar" ||
      String(req.headers["accept-language"] || "").startsWith("ar")
        ? "ar"
        : "en";
    req._t = translate;
    req.__ = translate;
    res._t = translate;
    res.__ = translate;
    next();
  });

  app.use("/categories", CategoryRouter);
  app.use("/countries", CountryRouter);
  app.use("/faqs", FAQRouter);

  return app;
};

beforeEach(() => {
  jest.clearAllMocks();
  cacheMock.get.mockReturnValue(undefined);
});

describe("localized routes", () => {
  it("serves and caches category lists per locale", async () => {
    const app = buildApp();
    CategoryMock.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([createCategoryDocument]),
    });

    const englishResponse = await request(app).get("/categories?lang=en");
    const arabicResponse = await request(app).get("/categories?lang=ar");

    expect(englishResponse.status).toBe(200);
    expect(englishResponse.body.data[0].name).toBe("Engineering");
    expect(arabicResponse.body.data[0].name).toBe("الهندسة");
    expect(cacheMock.set).toHaveBeenCalledWith(
      "categories:en",
      expect.objectContaining({
        data: [expect.objectContaining({ name: "Engineering" })],
      }),
    );
    expect(cacheMock.set).toHaveBeenCalledWith(
      "categories:ar",
      expect.objectContaining({
        data: [expect.objectContaining({ name: "الهندسة" })],
      }),
    );
  });

  it("localizes category creation and clears all cache variants", async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    CategoryMock.mockImplementation((payload) => ({
      _id: "cat-new",
      ...payload,
      save,
    }));
    CategoryMock.findOne.mockResolvedValue(null);

    const app = buildApp();
    const response = await request(app)
      .post("/categories?lang=ar")
      .send({
        name: { en: "Engineering", ar: "الهندسة" },
        description: { en: "Engineering jobs", ar: "وظائف الهندسة" },
        keywords: ["engineering"],
      });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("الهندسة");
    expect(cacheMock.del).toHaveBeenCalledWith("categories:en");
    expect(cacheMock.del).toHaveBeenCalledWith("categories:ar");
  });

  it("serves and caches country lists per locale", async () => {
    const app = buildApp();
    CountryMock.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([createCountryDocument]),
    });
    CountryMock.countDocuments.mockResolvedValue(1);

    const response = await request(app).get("/countries?lang=ar");

    expect(response.status).toBe(200);
    expect(response.body.countries[0].name).toBe("مصر");
    expect(response.body.countries[0].cities[0].name).toBe("القاهرة");
    expect(cacheMock.set).toHaveBeenCalledWith(
      "countries:ar",
      expect.objectContaining({
        countries: [expect.objectContaining({ name: "مصر" })],
      }),
    );
  });

  it("localizes country creation and clears all cache variants", async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    CountryMock.mockImplementation((payload) => ({
      _id: "country-new",
      ...payload,
      save,
    }));
    CountryMock.findOne.mockResolvedValue(null);

    const app = buildApp();
    const response = await request(app)
      .post("/countries?lang=ar")
      .send({
        name: { en: "Egypt", ar: "مصر" },
        code: "EG",
        cities: [
          { name: { en: "Cairo", ar: "القاهرة" } },
          { name: { en: "Giza", ar: "الجيزة" } },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.country.name).toBe("مصر");
    expect(cacheMock.del).toHaveBeenCalledWith("countries:en");
    expect(cacheMock.del).toHaveBeenCalledWith("countries:ar");
  });

  it("serves and caches FAQ lists per locale", async () => {
    const app = buildApp();
    FaqMock.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([createFaqDocument]),
    });

    const response = await request(app).get("/faqs?lang=en");

    expect(response.status).toBe(200);
    expect(response.body.data[0].question).toBe("What is this service?");
    expect(cacheMock.set).toHaveBeenCalledWith(
      "faqs:en",
      expect.objectContaining({
        data: [expect.objectContaining({ question: "What is this service?" })],
      }),
    );
  });

  it("localizes FAQ creation and clears all cache variants", async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    FaqMock.mockImplementation((payload) => ({
      _id: "faq-new",
      ...payload,
      save,
    }));
    FaqMock.findOne.mockResolvedValue(null);

    const app = buildApp();
    const response = await request(app)
      .post("/faqs?lang=ar")
      .send({
        question: {
          en: "How can I reset my password?",
          ar: "كيف يمكنني إعادة تعيين كلمة المرور؟",
        },
        answer: {
          en: "Click on forgot password.",
          ar: "اضغط على نسيت كلمة المرور.",
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.data.question).toBe(
      "كيف يمكنني إعادة تعيين كلمة المرور؟",
    );
    expect(cacheMock.del).toHaveBeenCalledWith("faqs:en");
    expect(cacheMock.del).toHaveBeenCalledWith("faqs:ar");
  });
});
