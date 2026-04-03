import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { User } from "../models/user.models";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (refreshAccessToken, refreshToken, profile, done) => {
      // This runs after Google redirects back to your app
      try {
        let user = await User.findOne({ email: profile._json.email });

        if (!user) {
          user = await User.create({
            email: profile._json.email,
            username: profile._json.email.split("@")[0],
            isEmailVerified: true, //Google already verified it
            loginType: "GOOGLE",
          });

          done(null, user); // passes user to the next step
        }
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

export default passport;
