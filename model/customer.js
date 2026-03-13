const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid");

const customerSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: String,
        address: {
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

module.exports = mongoose.model('Customer', customerSchema)