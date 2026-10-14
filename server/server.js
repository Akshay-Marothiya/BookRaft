const orderRoutes = require("./routes/orderRoutes");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Book = require("./models/Book");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware must be configured before routes.
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
// Get books with search and filters
app.get("/api/books", async (req, res) => {
    try {
        const { search, category, maxPrice } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } }
            ];
        }

        if (category && category !== "All") {
            filter.category = category;
        }

        if (maxPrice !== undefined && maxPrice !== "") {
            const price = Number(maxPrice);

            if (!Number.isFinite(price) || price < 0) {
                return res.status(400).json({
                    message: "Invalid maximum price."
                });
            }

            filter.price = { $lte: price };
        }

        const books = await Book.find(filter);
        res.json(books);
    } catch (error) {
        console.error("Fetch books error:", error.message);

        res.status(500).json({
            message: "Failed to fetch books."
        });
    }
});

// Start server only after MongoDB connects.
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT || 5000, () => {
            console.log(
                `Server running on port ${process.env.PORT || 5000}`
            );
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
