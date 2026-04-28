import { describe, expect, it } from "@jest/globals";
import {
  createJobSchema,
  updateJobSchema,
} from "../validations/Job/job.validation.js";

const makeRequest = () => ({
  __: (key) => key,
  _t: (key) => key,
});

const validJobPayload = {
  title: { en: "Software Engineer", ar: "مهندس برمجيات" },
  company: "Nezuko",
  organization: "Engineering",
  description: { en: "Build product features", ar: "بناء ميزات المنتج" },
  fieldOfWork: "507f1f77bcf86cd799439011",
  experienceLevel: "507f1f77bcf86cd799439012",
  keywords: ["507f1f77bcf86cd799439013"],
  responsibilities: [{ text: { en: "Ship code", ar: "تسليم الكود" } }],
  requirements: [{ text: { en: "3 years of experience", ar: "خبرة 3 سنوات" } }],
  country: "507f1f77bcf86cd799439014",
  locationDetails: { en: "Cairo", ar: "القاهرة" },
  expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  duration: { en: "3 months", ar: "3 أشهر" },
};

describe("job validation", () => {
  it("accepts localized job payloads", () => {
    const schema = createJobSchema(makeRequest());
    const { error } = schema.validate(validJobPayload);

    expect(error).toBeUndefined();
  });

  it("rejects flat text job payloads", () => {
    const schema = createJobSchema(makeRequest());
    const { error } = schema.validate({
      ...validJobPayload,
      title: "Software Engineer",
    });

    expect(error).toBeDefined();
  });

  it("accepts localized partial updates", () => {
    const schema = updateJobSchema(makeRequest());
    const { error } = schema.validate({
      title: { en: "Senior Software Engineer", ar: "مهندس برمجيات أول" },
    });

    expect(error).toBeUndefined();
  });
});
