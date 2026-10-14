const mongoose = require("mongoose");
const express = require("express");
const Book = require("../models/Book");
const Order = require("../models/Order");
const {
    authenticateToken,
    requireAdmin
} = require("../middleware/auth");

const router = express.Router();

// Every route in this file requires an authenticated admin.
router.use(authenticateToken, requireAdmin);

// Get all books for the dashboard

const validStatuses = [
    "Pending",
    "Processing",
    "Completed",
    "Cancelled"
];

// Get all customer orders (admin only)
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error("Fetch orders error:", error.message);
        res.status(500).json({
            message: "Failed to fetch orders."
        });
    }
});

// Update an order's status (admin only)
router.patch("/orders/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID."
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status."
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        res.json({
            message: "Order status updated.",
            order
        });
    } catch (error) {
        console.error("Update order error:", error.message);
        res.status(500).json({
            message: "Failed to update order status."
        });
    }
});


// Delete a book
router.delete("/books/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        res.json({ message: "Book deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: "Invalid book ID." });
    }
});

module.exports = router;
