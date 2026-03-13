const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid");

const manufacturerSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4
        },
        name: {
            type: String,
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String
        },
        contact: {
            email: String,
            phone: String
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

module.exports = mongoose.model('Manufacturer', manufacturerSchema)