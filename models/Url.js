const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
});

module.exports = mongoose.model("Url", urlSchema);