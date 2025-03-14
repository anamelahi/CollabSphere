import express from "express";
import { createSpace, getUserDashboard } from "../controllers/spaceController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/spaces", createSpace);
router.get("/dashboard", authMiddleware, getUserDashboard);

export default router;
