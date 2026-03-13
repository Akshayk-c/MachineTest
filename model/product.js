const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid");

const productSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['instock', 'outofstock', 'faulty'],
            default: 'instock'
        },
        manufacturer: {
            type: String,
            ref: 'Manufacturer',
            required: true
        },
        sellers: [{
            type: String,
            ref: 'Seller'
        }],
        category: {
            type: String
        },
        lastUpdatedBy: {
            type: String
        },
        lastUpdatedAt: {
            type: Date
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

module.exports = mongoose.model('Product', productSchema)