import { Router } from "express";
import passport from "passport";
import {
  signupLimiter,
  loginLimiter,
} from "../../middlewares/rate_limiter.middleware.js";
import {
  SignUpController,
  LoginController,
  LogoutController,
  RefreshTokenController,
  ForgotPasswordController,
  VerifyResetCodeController,
  ResetPasswordController,
} from "../../controllers/Auth/auth.controller.js";
import {
  SignUpSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyResetCodeSchema,
} from "../../validations/Auth/auth.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

// ======================
// Standard Authentication
// ======================
router.post("/signup", validate(SignUpSchema), SignUpController);
router.post("/login", loginLimiter, validate(LoginSchema), LoginController);
router.get("/logout", LogoutController);
router.post("/refresh-token", RefreshTokenController);

// ======================
// Password Reset Flow
// ======================
router.post(
  "/forgot-password",
  validate(ForgotPasswordSchema),
  ForgotPasswordController,
);
router.post(
  "/verify-reset-code",
  validate(VerifyResetCodeSchema),
  VerifyResetCodeController,
);
router.post(
  "/reset-password",
  validate(ResetPasswordSchema),
  ResetPasswordController,
);

// ======================
// Google OAuth Routes
// ======================

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://nezuko-portal.vercel.app/login?error=google_auth_failed",
    session: false,
  }),
  (req, res) => {
    try {
      const user = req.user as any;
      const { accessToken, refreshToken } = user;

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect("https://nezuko-portal.vercel.app/");
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("https://nezuko-portal.vercel.app/login?error=google_callback_failed");
    }
  },
);

router.get("/google", (req, res, next) => {
  res.clearCookie("connect.sid");
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

export { router as AuthRouter };
