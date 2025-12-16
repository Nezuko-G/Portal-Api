import { Router } from "express";
import { AuthRouter } from "./Auth/auth.routes.js";
import { UserRouter } from "./User/user.routes.js";
import { CategoryRouter } from "./Category/category.router.js";
import { ContactUsRouter } from "./ContactUs/contactus.route.js";
import { FAQRouter } from "./FAQ/faq.route.js";
import { CountryRouter } from "./Country/country.routes.js";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/category", CategoryRouter);
router.use("/contactus", ContactUsRouter);
router.use("/faq", FAQRouter);
router.use("/country", CountryRouter);

export { router as ApiRouter };
