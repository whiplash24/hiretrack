import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String },
    branch: { type: String },
    graduationYear: { type: Number }
  },
  { timestamps: true }
)

export default mongoose.model("User", userSchema)
