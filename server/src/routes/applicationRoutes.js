import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  addRound,
  updateRoundStatus
} from "../controllers/applicationController.js"

const router = express.Router()

router.post("/", authMiddleware, createApplication)
router.get("/", authMiddleware, getApplications)
router.put("/:id", authMiddleware, updateApplication)
router.delete("/:id", authMiddleware, deleteApplication)

router.post("/:id/rounds", authMiddleware, addRound)
router.put("/:id/rounds", authMiddleware, updateRoundStatus)

export default router
