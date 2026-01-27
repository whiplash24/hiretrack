import Application from "../models/Application.js"

export const createApplication = async (req, res) => {
  try {
    const { company, role } = req.body

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" })
    }

    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      status: "APPLIED",
      type: "INTERNSHIP",
    })

    res.status(201).json(application)
  } catch (error) {
    console.error("Create application error:", error.message)
    res.status(500).json({ message: "Failed to create application" })
  }
}

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
    res.json(applications)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" })
  }
}

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    res.json({ message: "Application deleted" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete application" })
  }
}
