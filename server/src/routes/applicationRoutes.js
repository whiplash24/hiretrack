import express from "express"
import {
  createApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(authMiddleware)

router.post("/", createApplication)
router.get("/", getApplications)
router.put("/:id/status", updateApplicationStatus)
router.delete("/:id", deleteApplication)

export default router
