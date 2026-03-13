# Machine Test API

A comprehensive Node.js/Express API for managing products and orders with manufacturer and seller management.

## Features

- ✅ Product Management (Add, Update Status, Retrieve)
- ✅ Order Management with Pagination
- ✅ Manufacturer and Seller Management
- ✅ Product Status History Tracking
- ✅ Analytics - Most Ordered Products
- ✅ Analytics - Monthly Orders & Revenue
- ✅ Input Validation & Error Handling
- ✅ Comprehensive API Documentation

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **ID Generation:** UUID

## Project Structure

```
machine/
├── app.js                 # Main application file
├── database.js            # MongoDB connection
├── package.json          # Dependencies
├── .gitignore            # Git ignore configuration
├── controller/
│   ├── apiController.js  # API business logic
│   └── entityController.js
├── model/
│   ├── customer.js
│   ├── manufacturer.js
│   ├── seller.js
│   ├── product.js
│   └── order.js
└── router/
    ├── apiRouter.js      # API routes
    └── entityRouter.js
```

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Akshayk-c/MachineTest.git
cd machine
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
Create a `.env` file in the root directory:
```
DB_URL=mongodb://localhost:27017/machinetest
PORT=3000
NODE_ENV=development
```

4. **Start the server:**
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Documentation

### Postman Collection

Access the complete API documentation and test all endpoints using the public Postman collection:

**[🔗 Machine Test API - Postman Collection](https://www.postman.com/akshay666/machine-test/collection/40990793-51384b32-a704-41e4-a51d-094fa2ab12db)**

All endpoints are pre-configured with request examples and response documentation.

### API Endpoints

#### Product Management

**Add Product**
```
POST /api/add-product
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 50000,
  "manufacturer": "mfg_id",
  "sellers": ["seller_id1", "seller_id2"],
  "category": "Electronics"
}
```
- **Response:** 201 Created
- **Validation:** Manufacturer and all sellers must exist in database

**Update Product Status**
```
PUT /api/update-product-status/:productId
Content-Type: application/json

{
  "status": "faulty|instock|outofstock",
  "entityType": "manufacturer|seller",
  "entityId": "entity_id"
}
```
- **Response:** 200 OK
- **Feature:** Tracks status changes with entity history

**Get Faulty Products**
```
GET /api/get-faulty-products
```
- **Response:** 200 OK with array of faulty products

#### Order Management

**Get All Orders (Paginated)**
```
GET /api/get-all-orders?page=1&limit=10
```

**Response:**
```json
{
  "message": "Orders retrieved successfully",
  "count": 10,
  "pagination": {
    "currentPage": 1,
    "limit": 10,
    "totalOrders": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "orders": [
    {
      "_id": "order_id",
      "customer": { /* customer details */ },
      "products": [
        {
          "quantity": 2,
          "productData": { /* product details */ },
          "sellerData": { /* seller info */ },
          "manufacturerData": { /* manufacturer info */ }
        }
      ]
    }
  ]
}
```

**Get Most Ordered Products**
```
GET /api/get-most-ordered-products
```

**Response:**
```json
{
  "message": "Most ordered products retrieved successfully",
  "count": 5,
  "products": [
    {
      "productId": "...",
      "productName": "Product A",
      "price": 100,
      "manufacturer": "Manufacturer Name",
      "totalOrdered": 50,
      "orderCount": 10
    }
  ]
}
```

**Get Monthly Orders & Revenue**
```
GET /api/get-monthly-orders-revenue
```

**Response:**
```json
{
  "message": "Monthly orders and revenue retrieved successfully",
  "count": 5,
  "data": [
    {
      "year": 2026,
      "month": 3,
      "monthName": "March",
      "totalOrders": 25,
      "totalRevenue": 5500.50,
      "totalProductsSold": 42,
      "totalProductQuantity": 150
    }
  ]
}
```

## Database Models

### Customer
```javascript
{
  _id: String,
  name: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: Date
}
```

### Manufacturer
```javascript
{
  _id: String,
  name: String,
  email: String,
  phone: String,
  address: String,
  createdAt: Date
}
```

### Seller
```javascript
{
  _id: String,
  name: String,
  email: String,
  phone: String,
  commissionRate: Number,
  status: String,
  createdAt: Date
}
```

### Product
```javascript
{
  _id: String,
  name: String,
  description: String,
  price: Number,
  status: String (instock|outofstock|faulty),
  manufacturer: ObjectId,
  sellers: [ObjectId],
  category: String,
  updateProductStatus: [{
    entityType: String (manufacturer|seller),
    entityId: String,
    entityName: String,
    status: String,
    updatedAt: Date
  }],
  createdAt: Date
}
```

### Order
```javascript
{
  _id: String,
  customer: ObjectId,
  products: [{
    productId: ObjectId,
    quantity: Number,
    sellerId: ObjectId,
    manufacturerId: ObjectId
  }],
  totalAmount: Number,
  status: String,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  orderDate: Date,
  createdAt: Date
}
```

## Key Features Explained

### 1. Product Status Management
- Track product status changes (instock, outofstock, faulty)
- Manufacturer and seller can update product status
- Complete history of status updates with entity information

### 2. Order Management
- Each product in an order has its own seller and manufacturer
- Flexible pricing for different sellers
- Comprehensive order details with all related data

### 3. Pagination
- Get orders with pagination support
- Configurable page size (limit parameter)
- Total pages and navigation flags provided

### 4. Analytics
- Most ordered products - sorted by quantity
- Monthly revenue and order statistics
- Detailed breakdown by month and year

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Resource created
- `400` - Bad request / Validation error
- `404` - Resource not found
- `500` - Server error

## Validation

- **Products:** Manufacturer must exist, all sellers must exist in database
- **Orders:** Customer and product data are validated
- **Pagination:** Page and limit must be greater than 0
- **Status Updates:** Valid statuses are instock, outofstock, faulty

## Future Enhancements

- Authentication & Authorization
- Rate Limiting
- Caching Layer
- Advanced Filtering & Sorting
- Export to CSV/PDF
- WebSocket for real-time updates
- Unit & Integration Tests
- Swagger/OpenAPI Documentation

## Testing

Use the Postman collection to test all endpoints:
- Pre-configured requests
- Sample request bodies
- Response examples
- Parameter documentation

## Repository

**GitHub:** https://github.com/Akshayk-c/MachineTest.git

## License

MIT

## Author

Akshay K C

## Support

For issues or questions, please:
1. Check the Postman collection for endpoint documentation
2. Create an issue on GitHub
3. Refer to the API endpoint documentation above
