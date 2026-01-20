import Application from "../models/Application.js"

export const createApplication = async (req, res) => {
  const application = await Application.create({
    ...req.body,
    user: req.user._id
  })
  res.status(201).json(application)
}

export const getApplications = async (req, res) => {
  const applications = await Application.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(applications)
}

export const updateApplication = async (req, res) => {
  const application = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  )
  res.json(application)
}

export const deleteApplication = async (req, res) => {
  await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  res.json({ message: "Application deleted" })
}

export const addRound = async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    user: req.user._id
  })

  application.rounds.push(req.body)

  if (req.body.status === "REJECTED") {
    application.status = "REJECTED"
  }

  await application.save()
  res.json(application)
}

export const updateRoundStatus = async (req, res) => {
  const { roundIndex, status } = req.body

  const application = await Application.findOne({
    _id: req.params.id,
    user: req.user._id
  })

  application.rounds[roundIndex].status = status

  if (status === "REJECTED") {
    application.status = "REJECTED"
  }

  if (status === "CLEARED") {
    application.status = "INTERVIEW"
  }

  await application.save()
  res.json(application)
}
