const express = require('express')
const router = express.Router()

const controller = require('../controller/entityController')

router.post('/add-customer', controller.addCustomer)
router.post('/add-manufacturer', controller.addManufacturer)
router.post('/add-seller', controller.addSeller)
router.post('/add-order', controller.addOrder)

module.exports = router;
