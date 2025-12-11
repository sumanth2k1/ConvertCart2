const path = require("path");
const app = require('./app');
const { ConnectDB } = require('./database/connect');
const dotenv = require("dotenv");


const envFile = process.env.NODE_ENV === "development" ? ".env.development" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });


const port = process.env.PORT;
const url = process.env.MONGO_URL;
let server;

// Server connection
const start = async () => {
    try {
        await ConnectDB(url);
        server = app.listen(port, console.log(`server started at : http://localhost:${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();

// --- GRACEFUL SHUTDOWN LOGIC ---
async function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);

  try {

    server.close(() => console.log("HTTP server closed."));

    await mongoose.connection.close();
    console.log("MongoDB connection closed.");

    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown", err);
    process.exit(1);
  }
}

// --- HANDLE SIGNALS ---
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));