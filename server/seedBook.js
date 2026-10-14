
require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/Book");

const books = [
    {
        title: "Atomic Habits",
        author: "James Clear",
        price: 299,
        category: "Self-Help",
        coverImage: "",
        description: "A practical guide to building good habits and breaking bad ones."
    },
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 499,
        category: "Programming",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg?default=false",
        description: "Principles and practices for writing maintainable software."
    },
    {
        title: "The Pragmatic Programmer",
        author: "David Thomas and Andrew Hunt",
        price: 399,
        category: "Programming",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg?default=false",
        description: "Practical advice for becoming a better software developer."
    },
    {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        price: 349,
        category: "Finance",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg?default=false",
        description: "Lessons about how people think about money and wealth."
    },
    {
        title: "Ikigai",
        author: "Hector Garcia and Francesc Miralles",
        price: 249,
        category: "Self-Help",
        coverImage: "https://covers.openlibrary.org/b/isbn/9781786330895-L.jpg?default=false",
        description: "An introduction to the Japanese concept of finding purpose."
    },
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        price: 399,
        category: "Fantasy",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg?default=false",
        description: "A fantasy adventure about Bilbo Baggins and a journey to reclaim treasure."
    },
    {
        title: "1984",
        author: "George Orwell",
        price: 199,
        category: "Fiction",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg?default=false",
        description: "A dystopian novel about surveillance and authoritarian control."
    },
    {
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 279,
        category: "Fiction",
        coverImage: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg?default=false",
        description: "A shepherd travels in search of treasure and discovers his personal journey."
    }
];

async function seedBooks() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Book.deleteMany({});
        await Book.insertMany(books);

        console.log("Books seeded successfully!");
        console.log(`${books.length} books inserted.`);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedBooks();
