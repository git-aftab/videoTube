import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { User } from "../models/user.models";

passport.use(
    new GoogleStrategy(
        {
            clientID: "",
            clientSecret: "",
            callbackURL: "",
        },

        async (refreshAccessToken, refreshToken, profile, done) =>{
            try {
                
            } catch (error) {
                
            }
        }
    )
)

export default passport;