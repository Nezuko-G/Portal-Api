import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import { corsOptions } from "./config/corsOptions.js";
import globalErrorHandler from "./middlewares/global_error_handler.middleware.js";
import { ApiRouter } from "./routers/index.js";
import { notFoundMiddleware } from "./middlewares/not_found.middleware.js";
import { swaggerUi, swaggerSpec } from "./utils/swagger.js";
import i18n, { i18nMiddleware } from "./config/i18n.js";
import passport from "./config/passport.config.js";
import startCronJobs from "./jobs/index.js";

const app = express();

startCronJobs();

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    name: "repodoctor.sid", // Custom session name
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 Hour
      sameSite: "lax", // Help with OAuth flow
    },
    rolling: true, // Reset maxAge on every response
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(i18n.init);
app.use(i18nMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Nezuzo Api....",
    status: "success",
    version: "1.0.0",
    endpoints: {
      "/": "GET - Welcome message",
    },
  });
});

app.use("/api", ApiRouter);

// 404 Not Found Middleware
app.use(notFoundMiddleware);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
