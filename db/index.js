const mongoose = require("mongoose");

// MongoDB connection URI
const mongoURI = "mongodb://mongo:27017/url-hasher";

// Function to connect to MongoDB with retry logic
const connectWithRetry = () => {
    mongoose
        .connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Successfully connected to MongoDB");
        })
        .catch((err) => {
            console.error("Failed to connect to MongoDB:", err.message);
            console.log("Retrying connection in 5 seconds...");
            setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
        });
};

// Handle MongoDB connection events
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB");
    console.log("Attempting to reconnect...");
    connectWithRetry(); // Attempt to reconnect
});

// Export the connectWithRetry function
module.exports = connectWithRetry;