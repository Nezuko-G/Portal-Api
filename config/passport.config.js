import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User/user.model.js";
import { generateToken } from "../services/jwt.service.js";
import dotenv from "dotenv";
dotenv.config();

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        "http://localhost:3000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GitHub profile data:", JSON.stringify(profile, null, 2));
        console.log("GitHub profile emails:", profile.emails);

        let user = await User.findOne({ githubId: profile.id });

        // Try to get email from profile, fallback to API call if needed
        let userEmail = profile.emails?.[0]?.value || null;

        // If email is not in profile, make an API call to get user's primary email
        if (!userEmail) {
          try {
            console.log(
              "Email not found in profile, making API call to GitHub..."
            );
            const emailResponse = await fetch(
              "https://api.github.com/user/emails",
              {
                headers: {
                  Authorization: `token ${accessToken}`,
                  Accept: "application/vnd.github.v3+json",
                  "User-Agent": "Authify-App",
                },
              }
            );

            if (emailResponse.ok) {
              const emails = await emailResponse.json();
              console.log("GitHub emails from API:", emails);
              // Find primary email or first verified email
              const primaryEmail = emails.find(
                (email) => email.primary && email.verified
              );
              const firstVerifiedEmail = emails.find((email) => email.verified);
              userEmail =
                primaryEmail?.email || firstVerifiedEmail?.email || null;
              console.log("Selected email:", userEmail);
            }
          } catch (emailError) {
            console.error("Error fetching GitHub emails:", emailError);
          }
        }

        if (!user) {
          try {
            user = await User.create({
              githubId: profile.id,
              name: profile.displayName || profile.username,
              email: userEmail,
              avatar: profile.photos?.[0]?.value || null,
              provider: "github",
              is_active: true,
            });
            console.log("Created new user with email:", userEmail);
          } catch (createError) {
            // Handle duplicate key error
            if (createError.code === 11000) {
              console.log(
                "User already exists, attempting to find existing user"
              );
              // Try to find by email or githubId
              user = await User.findOne({
                $or: [{ githubId: profile.id }, { email: userEmail }],
              });
              if (!user) {
                throw new Error("Failed to create or find existing user");
              }
            } else {
              throw createError;
            }
          }
        } else {
          // Update existing user's email if we found one and they don't have one
          if (userEmail && !user.email) {
            user.email = userEmail;
            await user.save();
            console.log("Updated existing user with email:", userEmail);
          }
        }

        // Generate JWT tokens for our application
        const payload = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          _id: user._id.toString(),
          role: user.role,
        };

        const { accessToken: jwtAccessToken } = generateToken(payload);

        return done(null, {
          user,
          accessToken: jwtAccessToken,
          githubAccessToken: accessToken, // Store GitHub OAuth token for revocation
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          try {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value || null,
              avatar: profile.photos?.[0]?.value || null,
              provider: "google",
              is_active: true,
            });
          } catch (createError) {
            // Handle duplicate key error
            if (createError.code === 11000) {
              console.log(
                "User already exists, attempting to find existing user"
              );
              // Try to find by email or googleId
              user = await User.findOne({
                $or: [
                  { googleId: profile.id },
                  { email: profile.emails?.[0]?.value },
                ],
              });
              if (!user) {
                throw new Error("Failed to create or find existing user");
              }
            } else {
              throw createError;
            }
          }
        }

        // Generate JWT tokens for our application
        const payload = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          _id: user._id.toString(),
          role: user.role,
        };

        const { accessToken: jwtAccessToken } = generateToken(payload);

        return done(null, {
          user,
          accessToken: jwtAccessToken,
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  const actualUser = user.user || user;
  console.log("Serializing user:", actualUser._id);
  done(null, actualUser._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return done(new Error("User not found"));
    }
    console.log("Deserialized user:", user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
