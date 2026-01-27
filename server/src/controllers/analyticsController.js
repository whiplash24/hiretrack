import Application from "../models/Application.js"

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id

    const total = await Application.countDocuments({ user: userId })

    const offers = await Application.countDocuments({
      user: userId,
      status: "OFFER",
    })

    const rejected = await Application.countDocuments({
      user: userId,
      status: "REJECTED",
    })

    const active = await Application.countDocuments({
      user: userId,
      status: { $in: ["APPLIED", "INTERVIEW"] },
    })

    res.json({
      total,
      active,
      offers,
      rejected,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
