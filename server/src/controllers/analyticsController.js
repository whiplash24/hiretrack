import Application from "../models/Application.js"

export const getDashboardStats = async (req, res) => {
  const userId = req.user._id

  const total = await Application.countDocuments({ user: userId })
  const offers = await Application.countDocuments({ user: userId, status: "OFFER" })
  const rejected = await Application.countDocuments({ user: userId, status: "REJECTED" })
  const active = await Application.countDocuments({
    user: userId,
    status: { $in: ["APPLIED", "OA", "INTERVIEW"] }
  })

  const byStatus = await Application.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ])

  const byDomain = await Application.aggregate([
    { $match: { user: userId, domain: { $ne: null } } },
    { $group: { _id: "$domain", count: { $sum: 1 } } }
  ])

  const conversionRate = total > 0 ? ((offers / total) * 100).toFixed(2) : "0.00"

  res.json({
    total,
    active,
    offers,
    rejected,
    conversionRate,
    byStatus,
    byDomain
  })
}
