const express = require("express");
const {
  getPrices,
  getPrice,
  createPrice,
  deletePrice,
  updatePrice,
} = require("../Controllers/priceModule");
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all price routes
router.use(requireAuth)

// GET all prices
router.get('/', getPrices)

//GET a single price
router.get('/:id', getPrice)

// POST a new price
router.post('/', createPrice)

// DELETE a price
router.delete('/:id', deletePrice)

// UPDATE a price
router.patch('/:id', updatePrice)


module.exports = router
