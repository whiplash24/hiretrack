import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./src/config/db.js"

import authRoutes from "./src/routes/authRoutes.js"
import applicationRoutes from "./src/routes/applicationRoutes.js"
import analyticsRoutes from "./src/routes/analyticsRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

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
