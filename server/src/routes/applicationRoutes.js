import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication
} from "../controllers/applicationController.js"

const router = express.Router()

router.post("/", authMiddleware, createApplication)
router.get("/", authMiddleware, getApplications)
router.put("/:id", authMiddleware, updateApplication)
router.delete("/:id", authMiddleware, deleteApplication)

export default router
