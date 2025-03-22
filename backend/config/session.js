import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const sessionConfig = {
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
};

export default sessionConfig;