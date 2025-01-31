const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files (CSS, JS)
app.set("view engine", "ejs");

// MongoDB Connection
mongoose.connect("mongodb://mongo:27017/url-hasher", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// URL Model
const Url = require("./models/Url");

// Generate a unique hash for a URL
function generateHash(url) {
    const hash1 = crypto.createHash("sha256").update(url).digest("hex"); // 64 characters
    const hash2 = crypto.createHash("sha256").update(hash1).digest("hex"); // Another 64 characters
    const hash3 = crypto.createHash("sha256").update(url).digest("hex"); // 64 characters
    const hash4 = crypto.createHash("sha256").update(hash1).digest("hex"); // Another
    const combinedHash = hash1 + hash2 + hash3 + hash4; // 128 characters
    return combinedHash.substring(0, 240); // Trim to 100 characters
}

// Homepage route
app.get("/", (req, res) => {
    res.render("index", { hashedUrl: null });
});

// Handle URL submission
app.post("/hash", async(req, res) => {
    const originalUrl = req.body.url;
    const hash = generateHash(originalUrl);

    // Save the URL mapping to MongoDB
    const url = new Url({ hash, originalUrl });
    await url.save();

    const hashedUrl = `http://localhost:${port}/ls/click?upn=${hash}`;
    res.render("index", { hashedUrl });
});

// Redirect hashed URL to original URL
app.get("/ls/click", async(req, res) => {
    const hash = req.query.upn;
    const url = await Url.findOne({ hash });

    if (url) {
        res.redirect(url.originalUrl);
    } else {
        res.status(404).send("URL not found");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});