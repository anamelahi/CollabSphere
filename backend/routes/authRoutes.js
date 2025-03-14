import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import passport from "passport";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", passport.authenticate("local"), loginUser);
router.post("/logout", logoutUser);

export default router;
