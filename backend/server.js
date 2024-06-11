const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Schema
const searchSchema = new mongoose.Schema({
  city: String,
  date: { type: Date, default: Date.now }
});

const Search = mongoose.model('Search', searchSchema);

// Routes
app.post('/search', async (req, res) => {
  const newSearch = new Search({ city: req.body.city });
  await newSearch.save();
  res.json('Search added!');
});

app.get('/searches', async (req, res) => {
  const searches = await Search.find();
  res.json(searches);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});