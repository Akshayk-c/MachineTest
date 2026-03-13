const Product = require("../model/product");
const Order = require("../model/order");
const Customer = require("../model/customer");
const Manufacturer = require("../model/manufacturer");
const Seller = require("../model/seller");

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      status,
      manufacturer,
      sellers,
      category,
    } = req.body;

    if (!name || !price || !manufacturer) {
      return res
        .status(400)
        .json({ message: "Name, price, and manufacturer are required." });
    }

    // Validate manufacturer exists in the database
    const manufacturerExists = await Manufacturer.findById(manufacturer);
    if (!manufacturerExists) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }

    // Validate sellers exist in the database (if provided)
    if (sellers && sellers.length > 0) {
      const sellerIds = Array.isArray(sellers) ? sellers : [sellers];
      const foundSellers = await Seller.find({ _id: { $in: sellerIds } });

      if (foundSellers.length !== sellerIds.length) {
        return res.status(404).json({ message: "One or more sellers not found" });
      }
    }

    const newProduct = new Product({
      name,
      description,
      price,
      status: status || "instock",
      manufacturer,
      sellers: sellers || [],
      category,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status, entityType, entityId } = req.body;
    const validStatuses = ["instock", "outofstock", "faulty"];
    const validEntityTypes = ["manufacturer", "seller"];
    console.log(req.body);
    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          message: "Status must be one of: instock, outofstock, faulty",
        });
    }

    if (!entityType || !validEntityTypes.includes(entityType)) {
      return res
        .status(400)
        .json({ message: "Entity type must be either manufacturer or seller" });
    }

    if (!entityId) {
      return res.status(400).json({ message: "Entity ID is required" });
    }

    // Fetch entity data from the appropriate collection
    let entity;
    if (entityType === "manufacturer") {
      entity = await Manufacturer.findById(entityId);
    } else if (entityType === "seller") {
      entity = await Seller.findById(entityId);
    }

    if (!entity) {
      return res.status(404).json({ message: `${entityType} not found` });
    }

    const statusUpdate = {
      entityType,
      entityId,
      entityName: entity.name || "Unknown",
      status,
      updatedAt: Date.now(),
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        status,
        updatedAt: Date.now(),
        lastUpdatedBy: entity.name || entityId,
        lastUpdatedAt: Date.now(),
        $push: { updateProductStatus: statusUpdate },
      },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product status updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFaultyProducts = async (req, res) => {
  try {
    const faultyProducts = await Product.find({ status: "faulty" }).select(
      "name description price status manufacturer category lastUpdatedBy lastUpdatedAt createdAt",
    );

    if (faultyProducts.length === 0) {
      return res.status(200).json({
        message: "No faulty products found",
        products: [],
      });
    }

    res.status(200).json({
      message: "Faulty products retrieved successfully",
      count: faultyProducts.length,
      products: faultyProducts,
    });
  } catch (error) {
    console.error("Error retrieving faulty products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllOrders = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ message: "Page and limit must be greater than 0" });
    }

    const skip = (page - 1) * limit;

    // Get total count of orders
    const totalOrders = await Order.countDocuments();

    // Fetch paginated orders
    const orders = await Order.find()
      .populate("customer")
      .populate({
        path: "products.productId",
        populate: [{ path: "manufacturer" }, { path: "sellers" }],
      })
      .populate("products.sellerId")
      .populate("products.manufacturerId")
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit);

    if (!orders.length) {
      return res.status(200).json({
        message: "No orders found",
        orders: [],
        pagination: {
          currentPage: page,
          limit,
          totalOrders: 0,
          totalPages: 0,
        },
      });
    }

    const transformedOrders = orders.map((order) => {
      const orderObj = order.toObject();

      orderObj.products = orderObj.products.map((product) => {
        const { sellers, ...productData } = product.productId; // remove sellers array

        return {
          quantity: product.quantity,
          productData,
          sellerData: product.sellerId,
          manufacturerData: product.manufacturerId,
        };
      });

      return orderObj;
    });

    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      message: "Orders retrieved successfully",
      count: transformedOrders.length,
      pagination: {
        currentPage: page,
        limit,
        totalOrders,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      orders: transformedOrders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMostOrderedProducts = async (req, res) => {
  try {
    const mostOrderedProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalOrdered: { $sum: "$products.quantity" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalOrdered: -1 } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "manufacturers",
          localField: "productDetails.manufacturer",
          foreignField: "_id",
          as: "manufacturer",
        },
      },
      { $unwind: { path: "$manufacturer", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$productDetails.name",
          productDescription: "$productDetails.description",
          price: "$productDetails.price",
          category: "$productDetails.category",
          status: "$productDetails.status",
          manufacturer: "$manufacturer.name",
          totalOrdered: 1,
          orderCount: 1,
        },
      },
    ]);

    if (!mostOrderedProducts.length) {
      return res.status(200).json({ message: "No orders found", products: [] });
    }

    res.status(200).json({
      message: "Most ordered products retrieved successfully",
      count: mostOrderedProducts.length,
      products: mostOrderedProducts,
    });
  } catch (error) {
    console.error("Error retrieving most ordered products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMonthlyOrdersAndRevenue = async (req, res) => {
  try {
    const monthlyData = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
          totalOrders: { $addToSet: "$_id" },
          totalRevenue: { $sum: "$totalAmount" },
          totalProductsSold: { $sum: 1 },
          totalProductQuantity: { $sum: "$products.quantity" },
        },
      },
      { $addFields: { totalOrders: { $size: "$totalOrders" } } },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          monthName: {
            $arrayElemAt: [
              [
                "",
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              "$_id.month",
            ],
          },
          totalOrders: 1,
          totalRevenue: 1,
          totalProductsSold: 1,
          totalProductQuantity: 1,
        },
      },
    ]);

    if (!monthlyData.length) {
      return res
        .status(200)
        .json({ message: "No order data found", monthlyData: [] });
    }

    res.status(200).json({
      message: "Monthly orders and revenue retrieved successfully",
      count: monthlyData.length,
      data: monthlyData,
    });
  } catch (error) {
    console.error("Error retrieving monthly data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addProduct,
  updateProductStatus,
  getFaultyProducts,
  getAllOrders,
  getMostOrderedProducts,
  getMonthlyOrdersAndRevenue,
};
