const express = require("express");
const {
  getProfiles,
  getProfile,
  createProfile,
  deleteProfile,
  updateProfile
} = require("../Controllers/profileController");
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

// GET all profiles
router.get('/', getProfiles)

//GET a single profile
router.get('/:id', getProfile)

// POST a new profile
router.post('/', createProfile)

// DELETE a profile
router.delete('/:id', deleteProfile)

// UPDATE a profile
router.patch('/:id', updateProfile)


module.exports = router