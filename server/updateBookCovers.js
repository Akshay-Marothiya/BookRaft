
require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/Book");

const covers = [
    {
        title: "Atomic Habits",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg?default=false"
    },
    {
        title: "Clean Code",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg?default=false"
    },
    {
        title: "The Pragmatic Programmer",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg?default=false"
    },
    {
        title: "The Psychology of Money",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg?default=false"
    },
    {
        title: "Ikigai",
        coverImage: "https://covers.openlibrary.org/b/isbn/9781786330895-L.jpg?default=false"
    },
    {
        title: "The Hobbit",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg?default=false"
    },
    {
        title: "1984",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg?default=false"
    },
    {
        title: "The Alchemist",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg?default=false"
    }
];

async function updateBookCovers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        for (const cover of covers) {
            const result = await Book.updateOne(
                { title: cover.title },
                { $set: { coverImage: cover.coverImage } }
            );

            if (result.matchedCount > 0) {
                console.log(`Updated cover: ${cover.title}`);
            } else {
                console.log(`Book not found: ${cover.title}`);
            }
        }

        console.log("Cover update finished.");
    } catch (error) {
        console.error("Update failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

updateBookCovers();
