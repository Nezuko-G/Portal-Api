import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import User from "../models/User/user.model.js";
import { generateToken } from "../services/jwt.service.js";
import dotenv from "dotenv";
import { VerifyCallback } from "passport-oauth2";

dotenv.config();

interface UserProfile {
  user: any;
  accessToken: string;
  refreshToken: string;
  githubAccessToken?: string;
}

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        "http://localhost:3000/api/auth/github/callback",
    },
    async (
      accessToken: string,
      refreshToken: string | undefined,
      profile: GitHubProfile,
      done: VerifyCallback,
    ): Promise<void> => {
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
              "Email not found in profile, making API call to GitHub...",
            );
            const emailResponse = await fetch(
              "https://api.github.com/user/emails",
              {
                headers: {
                  Authorization: `token ${accessToken}`,
                  Accept: "application/vnd.github.v3+json",
                  "User-Agent": "Authify-App",
                },
              },
            );

            if (emailResponse.ok) {
              const emails = await emailResponse.json();
              console.log("GitHub emails from API:", emails);
              // Find primary email or first verified email
              type GithubEmail = {
                email: string;
                primary: boolean;
                verified: boolean;
              };
              const primaryEmail = (emails as GithubEmail[]).find(
                (email: GithubEmail) => email.primary && email.verified,
              );
              const firstVerifiedEmail = (emails as GithubEmail[]).find(
                (email: GithubEmail) => email.verified,
              );
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
            console.log("Created new GitHub user:", userEmail);
          } catch (createError) {
            console.error("Error creating GitHub user:", createError);
            // Handle duplicate key error
            if (
              typeof createError === "object" &&
              createError &&
              "code" in createError &&
              (createError as any).code === 11000
            ) {
              console.log(
                "Duplicate key error - User already exists, attempting to find existing user",
              );
              // Try to find by email or githubId
              user = await User.findOne({
                $or: [{ githubId: profile.id }, { email: userEmail }],
              });

              if (!user) {
                console.error("Could not find user after duplicate key error");
                throw new Error("Failed to create or find existing user");
              }

              // Update the existing user with GitHub ID if they don't have one
              if (!user.githubId && userEmail) {
                user.githubId = profile.id;
                user.provider = "github";
                user.avatar = user.avatar || profile.photos?.[0]?.value;
                await user.save();
                console.log("Updated existing user with GitHub ID:", userEmail);
              }
            } else {
              throw createError;
            }
          }
        } else {
          if (userEmail && !user.email) {
            user.email = userEmail;
            await user.save();
            console.log("Updated existing user with email:", userEmail);
          }
        }

        const jwtAccessToken: string = generateToken(
          String(user.name ?? ""),
          String(user.email ?? ""),
          String(user.phone ?? ""),
          user._id.toString(),
          String(user.role ?? "user"),
        );

        return done(null, {
          user,
          accessToken: jwtAccessToken,
          refreshToken: jwtAccessToken,
          githubAccessToken: accessToken, // Store GitHub OAuth token for revocation
        } as UserProfile);
      } catch (err) {
        return done(err as Error, undefined);
      }
    },
  ),
);

// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/api/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string | undefined,
      profile: GoogleProfile,
      done: VerifyCallback,
    ): Promise<void> => {
      try {
        console.log("Google profile data:", JSON.stringify(profile, null, 2));
        console.log("Google profile emails:", profile.emails);

        let user = await User.findOne({ googleId: profile.id });
        const userEmail = profile.emails?.[0]?.value || null;

        if (!user) {
          try {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: userEmail,
              avatar: profile.photos?.[0]?.value || null,
              provider: "google",
              is_active: true,
            });
            console.log("Created new Google user:", userEmail);
          } catch (createError) {
            console.error("Error creating Google user:", createError);
            // Handle duplicate key error
            if (
              typeof createError === "object" &&
              createError &&
              "code" in createError &&
              (createError as any).code === 11000
            ) {
              console.log(
                "Duplicate key error - User already exists, attempting to find existing user",
              );
              // Try to find by email or googleId
              user = await User.findOne({
                $or: [{ googleId: profile.id }, { email: userEmail }],
              });

              if (!user) {
                console.error("Could not find user after duplicate key error");
                throw new Error("Failed to create or find existing user");
              }

              // Update the existing user with Google ID if they don't have one
              if (!user.googleId && userEmail) {
                user.googleId = profile.id;
                user.provider = "google";
                user.avatar = user.avatar || profile.photos?.[0]?.value;
                await user.save();
                console.log("Updated existing user with Google ID:", userEmail);
              }
            } else {
              throw createError;
            }
          }
        }

        const jwtAccessToken: string = generateToken(
          String(user.name ?? ""),
          String(user.email ?? ""),
          String(user.phone ?? ""),
          user._id.toString(),
          String(user.role ?? "user"),
        );

        return done(null, {
          user,
          accessToken: jwtAccessToken,
          refreshToken: jwtAccessToken,
        } as UserProfile);
      } catch (err) {
        return done(err as Error, undefined);
      }
    },
  ),
);

passport.serializeUser(
  (user: any, done: (err: Error | null, id?: string) => void): void => {
    const actualUser: any = user.user || user;
    console.log("Serializing user:", actualUser._id);
    done(null, actualUser._id);
  },
);

passport.deserializeUser(async (id, done) => {
  try {
    const user: any = await User.findById(id).select("-password");
    if (!user) {
      return done(new Error("User not found"), undefined);
    }
    console.log("Deserialized user:", user);
    done(null, user);
  } catch (err) {
    done(err as Error);
  }
});

export default passport;
