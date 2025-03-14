import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "../config/db.js";

passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const result = await db.query("SELECT * FROM user_credentials WHERE email = $1", [email]);
            if (result.rows.length === 0) return done(null, false, { message: "User not found" });

            const user = result.rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return done(null, false, { message: "Invalid password" });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const result = await db.query("SELECT * FROM user_credentials WHERE id = $1", [id]);
    done(null, result.rows[0]);
});

export default passport;
