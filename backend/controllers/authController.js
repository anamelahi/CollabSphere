import bcrypt from "bcrypt";
import db from "../config/db.js";

const saltRounds = 10;

export const register = async (req, res) => {
    console.log("Raw request body:", req.body);
    const { fName, lName, email, password } = req.body;

    console.log("Destructured values:", { fName, lName, email, password });

    try {
        if (fName == null || lName == null || email == null || password == null) {
            return res.status(400).json({ message: "All fields (fName, lName, email, password) are required" });
        }

        console.log("Checking for existing user with email:", email);
        const existingUser = await db.query("SELECT * FROM user_credentials WHERE LOWER(email) = LOWER($1)", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log("Inserting new user into user_credentials...");
        const query = await db.query(
            "INSERT INTO user_credentials (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
            [fName, lName, email, hashedPassword]
        );

        console.log("User created successfully with ID:", query.rows[0].id);
        res.json({ message: "User created successfully", userId: query.rows[0].id });
    } catch (error) {
        console.error("Error creating user:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = await db.query("SELECT * FROM user_credentials WHERE email = $1", [email]);
        if (query.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = query.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        req.session.userId = user.id;
        return res.json({ message: "User logged in successfully", userId: user.id });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed" });
    }
};

export const logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
    });
};

export const getSession = (req, res) => {
    console.log("Current Session Data:", req.session);
    res.json(req.session);
};