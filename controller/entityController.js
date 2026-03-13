const Customer = require('../model/customer');
const Manufacturer = require('../model/manufacturer');
const Seller = require('../model/seller');
const Order = require('../model/order');
const Product = require('../model/product');

const addCustomer = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required.' });
        }

        const newCustomer = new Customer({
            name,
            email,
            phone,
            address
        });

        const savedCustomer = await newCustomer.save();

        res.status(201).json({
            message: 'Customer added successfully',
            customer: savedCustomer
        });
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addManufacturer = async (req, res) => {
    try {
        const { name, address, contact, website } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Manufacturer name is required.' });
        }

        const newManufacturer = new Manufacturer({
            name,
            address,
            contact,
            website
        });

        const savedManufacturer = await newManufacturer.save();

        res.status(201).json({
            message: 'Manufacturer added successfully',
            manufacturer: savedManufacturer
        });
    } catch (error) {
        console.error('Error adding manufacturer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addSeller = async (req, res) => {
    try {
        const { name, address, contact, website, manufacturerIds } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Seller name is required.' });
        }

        const newSeller = new Seller({
            name,
            address,
            contact,
            website,
            manufacturerIds: manufacturerIds || []
        });

        const savedSeller = await newSeller.save();

        res.status(201).json({
            message: 'Seller added successfully',
            seller: savedSeller
        });
    } catch (error) {
        console.error('Error adding seller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addOrder = async (req, res) => {
    try {
        const { customer, products, status, shippingAddress, sellerId } = req.body;

        if (!customer || !products) {
            return res.status(400).json({ message: 'Customer and products are required.' });
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products must be a non-empty array with productId and quantity.' });
        }

        // Validate and fetch product details to calculate total amount
        let totalAmount = 0;
        const productsData = [];

        for (const item of products) {
            if (!item.productId || !item.quantity) {
                return res.status(400).json({ message: 'Each product must have productId and quantity.' });
            }

            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
            }
console.log(item)
            totalAmount += product.price * item.quantity;
            productsData.push({
                productId: item.productId,
                quantity: item.quantity,
                sellerId: item.sellerId ,
                manufacturerId: item.manufacturerId 
            });
        }

        const newOrder = new Order({
            customer,
            products: productsData,
            totalAmount,
            status: status || 'pending',
            shippingAddress,
            sellerId: sellerId
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: 'Order added successfully',
            order: savedOrder
        });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addCustomer,
    addManufacturer,
    addSeller,
    addOrder
};
