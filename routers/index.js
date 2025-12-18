import { Router } from "express";
import { AuthRouter } from "./Auth/auth.routes.js";
import { UserRouter } from "./User/user.routes.js";
import { CategoryRouter } from "./Category/category.router.js";
import { ContactUsRouter } from "./ContactUs/contactus.route.js";
import { FAQRouter } from "./FAQ/faq.route.js";
import { CountryRouter } from "./Country/country.routes.js";
import { JobRouter } from "./Job/job.routes.js";
import { JobApplicationRouter } from "./Job/job.application.routes.js";
import { ExperienceLevelRouter } from "./ExperienceLevel/experiencelevel.route.js";
import { keywordRouter } from "./Keyword/keyword.route.js";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/category", CategoryRouter);
router.use("/contactus", ContactUsRouter);
router.use("/faq", FAQRouter);
router.use("/country", CountryRouter);
router.use("/job", JobRouter);
router.use("/job-application", JobApplicationRouter);
router.use("/keyword", keywordRouter);
router.use("/experience", ExperienceLevelRouter);

export { router as ApiRouter };
