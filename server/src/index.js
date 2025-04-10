// Import necessary modules
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { createServer } from "http"; // Import HTTP module to create a server
import { Server } from "socket.io"; // Import Socket.io for real-time communication
import { initializeSocket } from "./webSocket/socket.js"; // Import function to initialize sockets
import cors from "cors";
import { setIOInstance } from "./webSocket/SocketStore.js";
 
// Get the root directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, "../.env"), // Go up one level to find the .env file
});  

// Import database connection function 
import connectToDB from "./utils/db.js";

// Import the Express app instance
import { app } from "./app.js";



// Create an HTTP server and bind it to Express
const server = createServer(app);

// console.log("Cors -> ",process.env.CORS_ORIGIN);
// Initialize Socket.io and configure CORS settings
const io = new Server(server, {
  cors: {
    origin: [process.env.CORS_ORIGIN, "http://localhost:3000", "http://192.168.29.197:3000"], // Allow multiple origins
    methods: ["GET", "POST"],
    credentials: true, // Allow authentication
    allowedHeaders: ["Authorization", "Content-Type"], // Ensure required headers are allowed
  }, 
});   
 
// Initialize Socket.io event listeners
initializeSocket(io);
setIOInstance(io);


// Define the server port
const port = process.env.PORT || 8000;
console.log("PORT from env:", process.env.PORT);

// Define a basic API route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server and connect to the database
server.listen(port, "0.0.0.0", async () => {
  await connectToDB(); // Ensure database connection before starting
  console.log(`Server is running on port ${port}`);
});
