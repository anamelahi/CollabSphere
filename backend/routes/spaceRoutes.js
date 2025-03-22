import express from "express";
import { createSpace, joinSpace } from "../controllers/spaceController.js";

const router = express.Router();

router.post("/spaces", createSpace);
router.post("/join-space", joinSpace);

export default router;