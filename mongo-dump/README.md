# MongoDB Dump & Restore Instructions

This folder contains a MongoDB database dump with all collections and sample data.

## Contents

- `test/customers.bson` - Customer collection data
- `test/customers.metadata.json` - Customer collection metadata
- `test/manufacturers.bson` - Manufacturer collection data
- `test/manufacturers.metadata.json` - Manufacturer collection metadata
- `test/sellers.bson` - Seller collection data
- `test/sellers.metadata.json` - Seller collection metadata
- `test/products.bson` - Product collection data
- `test/products.metadata.json` - Product collection metadata
- `test/orders.bson` - Order collection data
- `test/orders.metadata.json` - Order collection metadata

## Prerequisites

- MongoDB must be installed and running
- `mongorestore` utility should be available in your PATH

## Restore Database

### Option 1: Using mongorestore (Recommended)

```bash
# Navigate to project root
cd path/to/machine

# Restore the entire database dump
mongorestore --uri "mongodb://localhost:27017/machinetest" ./mongo-dump
```

### Option 2: With MongoDB Atlas

```bash
# Replace with your MongoDB Atlas connection string
mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net/machinetest" ./mongo-dump
```

### Option 3: Using environment variable

```bash
# Set the MONGO_URI in .env file, then restore
mongorestore --uri $MONGO_URI ./mongo-dump
```

## Restore from Windows Command Prompt

```cmd
mongorestore --uri "mongodb://localhost:27017/machinetest" "./mongo-dump"
```

## Verify Restoration

After restoring, verify the data was imported correctly:

```javascript
// Connect to MongoDB and check collections
db.customers.countDocuments()      // Should return number of customers
db.manufacturers.countDocuments()  // Should return number of manufacturers
db.sellers.countDocuments()        // Should return number of sellers
db.products.countDocuments()       // Should return number of products
db.orders.countDocuments()         // Should return number of orders
```

## Sample Data

The dump contains sample data for:
- Multiple customers with addresses
- Multiple manufacturers
- Multiple sellers
- Multiple products with status tracking
- Sample orders with product details

## Backup Database

To create a new backup:

```bash
# Backup entire database
mongodump --uri "mongodb://localhost:27017/machinetest" --out ./mongo-dump-new

# Backup specific collection
mongodump --uri "mongodb://localhost:27017" --db machinetest --collection products --out ./mongo-dump-products
```

## Troubleshooting

### Error: "mongorestore: command not found"
- Ensure MongoDB is installed and added to your system PATH
- On Windows, MongoDB tools are typically in `C:\Program Files\MongoDB\Server\[version]\bin`

### Error: "Failed to connect to MongoDB"
- Ensure MongoDB service is running
- Verify connection string in .env file
- Check network connectivity to MongoDB Atlas if using cloud

### Error: "Database already exists"
- The dump will merge with existing data by default
- To replace existing data, drop the database first:
```bash
mongo "mongodb://localhost:27017" --eval "db.dropDatabase()"
```

## For Development

Quick restore command for local development:

```bash
mongorestore mongodb://localhost:27017/machinetest ./mongo-dump
```

Then start your app:

```bash
npm start
```

Your API will now have all the sample data loaded and ready to use!
