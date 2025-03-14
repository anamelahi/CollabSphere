import bcrypt from "bcrypt";
import db from "../config/db.js";

const saltRounds = 10;

export const registerUser = async (req, res) => {
    const { fName, lName, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await db.query("INSERT INTO user_credentials (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)", [fName, lName, email, hashedPassword]);
        res.json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};

export const loginUser = async (req, res) => {
    res.json({ message: "User logged in successfully", userId: req.user.id });
};

export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
    });
};
