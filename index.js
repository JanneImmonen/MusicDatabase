// This is a Node.js application using Express, Mongoose, and Axios to create a Music Database API

// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const axios = require("axios");

// Initialize the Express app and use bodyParser and CORS middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());

<<<<<<< HEAD
// Define constants for MongoDB URI and LastFM API key
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/musicdb";
const LASTFM_API_KEY =
  process.env.LASTFM_API_KEY || "5b5387b8170f4e10e07cbac290dced2d";

// Function to connect to MongoDB using Mongoose
async function connectToMongoDB() {
  try {
    const connectionString =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/musicdb";
=======
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/musicdb";
const LASTFM_API_KEY = process.env.LASTFM_API_KEY || "5b5387b8170f4e10e07cbac290dced2d";

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/musicdb";
>>>>>>> acfe169984a5da0a67ea2d8cfd1d94197e51219c
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}
// Define the album schema and model using Mongoose
connectToMongoDB();

// Define album schema and model
const albumSchema = new mongoose.Schema({
  title: String,
  artist: String,
  year: Number,
});

const Album = mongoose.model("Album", albumSchema);

// Serve the index.html file on the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Define the API routes
// Get all albums
app.get("/api/getall", async (req, res) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific album by ID
app.get("/api/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new album
app.post("/api/add", async (req, res) => {
  try {
    const album = new Album(req.body);
    await album.save();
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing album by ID
app.put("/api/update/:id", async (req, res) => {
  try {
    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedAlbum);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an album by ID
app.delete("/api/delete/:id", async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Album deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search for albums using the LastFM API
app.get("/api/lastfmsearch/:query", async (req, res) => {
  try {
    const response = await axios.get("http://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "album.search",
        album: req.params.query,
        api_key: LASTFM_API_KEY,
        format: "json",
        limit: 10,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
