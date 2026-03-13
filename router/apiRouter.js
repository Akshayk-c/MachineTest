const express= require('express')
const router= express.Router()

const controller = require('../controller/apiController')

router.post('/add-product',controller.addProduct)
router.put('/update-product-status/:productId', controller.updateProductStatus)
router.get('/get-faulty-products', controller.getFaultyProducts)
router.get('/get-all-orders', controller.getAllOrders)
router.get('/get-most-ordered-products', controller.getMostOrderedProducts)
router.get('/get-monthly-orders-revenue', controller.getMonthlyOrdersAndRevenue)

module.exports = router ;
