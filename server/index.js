import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./src/config/db.js"

import authRoutes from "./src/routes/authRoutes.js"
import applicationRoutes from "./src/routes/applicationRoutes.js"
import analyticsRoutes from "./src/routes/analyticsRoutes.js"

dotenv.config()

const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"]
const missing = REQUIRED_ENV.filter((k) => !process.env[k])
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`)
  process.exit(1)
}

const app = express()

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins.length
      ? (origin, cb) => {
          if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
          return cb(new Error(`Origin ${origin} not allowed by CORS`))
        }
      : true,
    credentials: true,
  })
)
app.use(express.json())

connectDB()

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() })
})

app.get("/api/test", (req, res) => {
  res.json({ message: "API working" })
})

app.use("/api/auth", authRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/analytics", analyticsRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
