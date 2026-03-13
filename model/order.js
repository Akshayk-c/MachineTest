const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid");

const orderSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4
        },
        customer: {
            type: String,
            ref: 'Customer',
            required: true
        },
        products: [{
            productId: {
                type: String,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            sellerId: {
                type: String,
                ref: 'Seller'
            },
            manufacturerId: {
                type: String,
                ref: 'Manufacturer'
            },
            _id: false
        }],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        },
        orderDate: {
            type: Date,
            default: Date.now
        },
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
)

module.exports = mongoose.model('Order', orderSchema)