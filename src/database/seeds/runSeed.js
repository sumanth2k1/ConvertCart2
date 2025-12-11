const path = require("path");
const mongoose = require("mongoose");
const restaurantsSeed = require("./restaurants.seed");
const menuItemsSeed = require("./menuItems.seed");
const ordersSeed = require("./orders.seed");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const dotenv = require("dotenv");


const envFile = process.env.NODE_ENV === "development" ? ".env.development" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const url = process.env.MONGO_URL;


async function seed() {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");

    // Clear existing collections
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared old data");

    // Insert data
    const restaurants = await Restaurant.insertMany(restaurantsSeed);
    console.log("Inserted Restaurants");

    const menuItems = await MenuItem.insertMany(
      menuItemsSeed.map((item) => ({
        ...item,
        restaurantId: restaurants[item.restaurantIndex]._id,
      }))
    );
    console.log("Inserted Menu Items");

    await Order.insertMany(
      ordersSeed.map((order) => ({
        menuItemId: menuItems[order.menuItemIndex]._id,
        quantity: order.quantity,
        orderTotal: menuItems[order.menuItemIndex].price * order.quantity,
      }))
    );
    console.log("Inserted Orders");

    console.log("Database Seed Completed!");
    process.exit(0);

  } catch (err) {
    console.error("Seed Error:", err);
    process.exit(1);
  }
}

seed();
