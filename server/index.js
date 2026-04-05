const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Book = require("./models/Book");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booklist";

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books." });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: "Invalid book id." });
  }
});

app.post("/books", async (req, res) => {
  try {
    const { title, author } = req.body;
    const created = await Book.create({ title, author });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: "Failed to create book." });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const { title, author } = req.body;
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update book." });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.json({ message: "Book deleted." });
  } catch (error) {
    res.status(400).json({ message: "Invalid book id." });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

startServer();
