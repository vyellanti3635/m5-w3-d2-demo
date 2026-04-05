const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book = require("./models/Book");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booklist";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);

    const filePath = path.join(__dirname, "..", "db.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);

    const sourceBooks = Array.isArray(parsed.posts) ? parsed.posts : [];
    const booksToInsert = sourceBooks
      .filter((item) => item.title && item.author)
      .map((item) => ({
        title: item.title,
        author: item.author,
      }));

    await Book.deleteMany({});
    await Book.insertMany(booksToInsert);

    console.log(`Seed complete. Inserted ${booksToInsert.length} books.`);
  } catch (error) {
    console.error("Seed failed", error);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
