const mongoose = require('mongoose')
const Profile = require("../models/profileModel");

// get all profiles
const getProfiles = async (req, res) => {
  const user_id = req.user._id

  const profiles = await Profile.find({user_id}).sort({createdAt: -1})

  res.status(200).json(profiles)
}

// get a single profile
const getProfile = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such profile'})
  }

  const profile = await Profile.findById(id)

  if (!profile) {
    return res.status(404).json({error: 'No such profile'})
  }
  
  res.status(200).json(profile)
}


// create new profile
const createProfile = async (req, res) => {
  const {fullName, address1, address2, city, state, zipCode} = req.body

  let emptyFields = []

  if(!fullName) {
    emptyFields.push('fullName')
  }
  if(!address1) {
    emptyFields.push('address1')
  }
  if(!address2) {
    emptyFields.push('address2')
  }
  if(!city) {
    emptyFields.push('city')
  }
  if(!state) {
    emptyFields.push('state')
  }
  if(!zipCode) {
    emptyFields.push('zipCode')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  try {
    const user_id = req.user._id
    await Profile.findByIdAndUpdate(user_id, { isFirstTime: false });


    const profile = await Profile.create({fullName, address1, address2, city, state, zipCode, isFirstTime: false, user_id})
    res.status(200).json(profile)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete profile
const deleteProfile= async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such profile'})
  }

  const profile = await Profile.findOneAndDelete({_id: id})

  if (!profile) {
    return res.status(400).json({error: 'No such profile'})
  }

  res.status(200).json(profile)
}

// update profile
const updateProfile= async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such profile'})
  }

  const profile = await Profile.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!profile) {
    return res.status(400).json({error: 'No such profile'})
  }

  res.status(200).json(profile)
}


module.exports = {
  getProfiles,
  getProfile,
  createProfile,
  deleteProfile,
  updateProfile
}





























