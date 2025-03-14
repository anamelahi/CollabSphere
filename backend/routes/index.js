import express from "express"
const router = express.Router();

import authRoutes from "./authRoutes"
import spaceRoutes from "./spaceRoutes"
import userRoutes from "./userRoutes"

router.use("/auth", authRoutes)
router.use("/spaces", spaceRoutes)
router.use("/users", userRoutes)

module.exports =  router;