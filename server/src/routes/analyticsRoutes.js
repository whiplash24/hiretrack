import express from "express"
import { getDashboardStats } from "../controllers/analyticsController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(authMiddleware)
router.get("/", getDashboardStats)

export default router
