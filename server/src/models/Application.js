import mongoose from "mongoose"

const roundSchema = new mongoose.Schema(
  {
    name: String,
    date: Date,
    status: {
      type: String,
      enum: ["PENDING", "CLEARED", "REJECTED"],
      default: "PENDING"
    },
    notes: String
  },
  { _id: false }
)

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    domain: { type: String },
    type: {
      type: String,
      enum: ["INTERNSHIP", "FULL_TIME"],
      required: true
    },
    stipendOrSalary: String,
    status: {
      type: String,
      enum: ["APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED"],
      default: "APPLIED"
    },
    rounds: [roundSchema],
    notes: String,
    appliedDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

export default mongoose.model("Application", applicationSchema)
