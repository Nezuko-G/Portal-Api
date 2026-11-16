import passport from "passport";
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
}

// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "https://nezuko0hr.alwaysdata.net/api/auth/google/callback",
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
