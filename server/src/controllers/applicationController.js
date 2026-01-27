import Application from "../models/Application.js"

export const createApplication = async (req, res) => {
  try {
    const { company, role, type = "INTERNSHIP", status = "APPLIED" } = req.body

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" })
    }

    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      type,
      status,
    })

    res.status(201).json(application)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
    res.json(applications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body

    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    application.status = status
    await application.save()

    res.json(application)
  } catch (error) {
    res.status(500).json({ message: error.message })
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
    res.status(500).json({ message: error.message })
  }
}
