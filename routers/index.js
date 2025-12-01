import { Router } from "express";
import { AuthRouter } from "./Auth/auth.routes.js";
import { UserRouter } from "./User/user.routes.js";
import { CategoryRouter } from "./Category/category.router.js";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/category", CategoryRouter);

export { router as ApiRouter };
