
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const Book = require("./models/Book");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
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

// Serve the React frontend in production
if (process.env.NODE_ENV === "production") {
    const clientPath = path.join(__dirname, "../client/dist");

    app.use(express.static(clientPath));

    // React Router fallback for frontend pages
    app.get(/.*/, (req, res, next) => {
        if (req.path.startsWith("/api/")) {
            return next();
        }

        res.sendFile(
            path.join(clientPath, "index.html"),
            (error) => {
                if (error) next(error);
            }
        );
    });
}

// Start the server only after MongoDB connects
async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is missing.");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
