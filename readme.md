# ConvertCart2 — Dish Search Backend (Node + Express + MongoDB)

A small backend service that allows users to search for restaurants by dish name, returning the top restaurants where that dish has been ordered the most within a mandatory price range.

Tech: Node.js, Express, MongoDB, Mongoose

One API: GET /search/dishes?name=<dish>&minPrice=<min>&maxPrice=<max>

Includes seeding script to load sample restaurants, menu items and orders (one order = single item for simplicity)

# Environment variables

Create a .env file in the project root (or use .env.development when NODE_ENV=development):

# .env (example)
PORT=3000
MONGO_URL=mongodb://localhost:27017/dish_search_db
NODE_ENV=development


Important: Your start script reads process.env.NODE_ENV to pick .env.development if NODE_ENV === "development". Adjust as needed.

# Seed data

The repo includes a seeding script at src/seeds/runSeed.js (invoked by npm run seed). The seeds should insert documents for:

Restaurants (fields: name, city, isDeleted)

MenuItems (fields: name, price, restaurantId, isDeleted)

Orders (fields: menuItemId, quantity, orderedAt, orderTotal, isDeleted)

# Local setup

Clone the repo

git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>


# Install dependencies

pnpm install


Create .env (or .env.development) with the variables shown above.

Start MongoDB (if local) or ensure your MONGO_URL points to a running MongoDB instance (e.g., Atlas or Railway).

# Seed the database with sample data

pnpm run seed


This runs node src/seeds/runSeed.js — confirm the file exists and inserts example restaurants/menu items/orders.

# Start the app

Development (nodemon):

npm run dev


Production:

npm start


Your server should log something like:

# server started at : http://localhost:3000


# sample deployed input

    https://convertcart2.onrender.com/
    
    https://convertcart2.onrender.com/api/search/dishes?name=biryani&minPrice=150&maxPrice=300