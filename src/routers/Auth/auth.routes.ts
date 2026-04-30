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
// GitHub OAuth Routes
// ======================
router.get("/github", loginLimiter, async (req, res, next) => {
  res.clearCookie("connect.sid");

  try {
    const state = `auth_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const githubAuthUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/api/auth/github/callback")}` +
      `&scope=user:email,user` +
      `&state=${state}` +
      `&response_type=code` +
      `&allow_signup=true`;

    res.redirect(githubAuthUrl);
  } catch (error) {
    next(error);
  }
});

router.post("/github/revoke", loginLimiter, async (req, res) => {
  try {
    const githubAccessToken = req.cookies.githubAccessToken;

    if (githubAccessToken) {
      const revokeUrl = `https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/grant`;

      await fetch(revokeUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`).toString("base64")}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: githubAccessToken }),
      });
    }

    // Clear cookies
    res.clearCookie("jwt");
    res.clearCookie("connect.sid");
    res.clearCookie("githubAccessToken");

    res.json({
      message: "GitHub authorization revoked and cookies cleared",
      note: "Next login will show the GitHub authorization screen",
    });
  } catch (error) {
    res.clearCookie("jwt");
    res.clearCookie("connect.sid");
    res.clearCookie("githubAccessToken");

    res.json({
      message: "Cookies cleared (revocation may have failed)",
      error:
        "You may need to manually revoke the app at https://github.com/settings/applications",
    });
  }
});

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login?error=github_auth_failed",
    session: false,
  }),
  (req, res) => {
    try {
      const user = req.user as any;
      const { refreshToken, githubAccessToken } = user;

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      if (githubAccessToken) {
        res.cookie("githubAccessToken", githubAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      res.redirect("http://localhost:5173/");
    } catch (error) {
      res.redirect("http://localhost:5173/login?error=github_callback_failed");
    }
  },
);

// ======================
// Google OAuth Routes
// ======================

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login?error=google_auth_failed",
    session: false,
  }),
  (req, res) => {
    try {
      const user = req.user as any;
      const { accessToken, refreshToken } = user;

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect("http://localhost:5173/");
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("http://localhost:5173/login?error=google_callback_failed");
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
