const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/musicdb";
const LASTFM_API_KEY = process.env.LASTFM_API_KEY || "5b5387b8170f4e10e07cbac290dced2d";

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/musicdb";
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

connectToMongoDB();

// Define album schema and model
const albumSchema = new mongoose.Schema({
  title: String,
  artist: String,
  year: Number,
});

const Album = mongoose.model("Album", albumSchema);

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API routes
app.get("/api/getall", async (req, res) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/add", async (req, res) => {
  try {
    const album = new Album(req.body);
    await album.save();
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

app.delete("/api/delete/:id", async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Album deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
