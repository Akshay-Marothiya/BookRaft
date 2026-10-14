
const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { customerName, email, address, items } = req.body;

        if (
            !customerName?.trim() ||
            !email?.trim() ||
            !address?.trim() ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                message: "Please provide your details and at least one book."
            });
        }

        const quantities = new Map();

        for (const item of items) {
            if (
                !mongoose.isValidObjectId(item.bookId) ||
                !Number.isSafeInteger(item.quantity) ||
                item.quantity < 1 ||
                item.quantity > 99
            ) {
                return res.status(400).json({
                    message: "One or more cart items are invalid."
                });
            }

            const id = item.bookId.toString();
            quantities.set(id, (quantities.get(id) || 0) + item.quantity);

            if (quantities.get(id) > 99) {
                return res.status(400).json({
                    message: "Maximum quantity per book is 99."
                });
            }
        }

        const bookIds = [...quantities.keys()];
        const books = await Book.find({ _id: { $in: bookIds } });

        if (books.length !== bookIds.length) {
            return res.status(400).json({
                message: "A book in your cart is no longer available."
            });
        }

        const orderItems = books.map(book => ({
            bookId: book._id,
            title: book.title,
            price: book.price,
            quantity: quantities.get(book._id.toString())
        }));

        const total = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            customerName: customerName.trim(),
            email: email.trim().toLowerCase(),
            address: address.trim(),
            items: orderItems,
            total
        });

        res.status(201).json({
            message: "Order placed successfully.",
            orderId: order._id,
            total: order.total
        });
    } catch (error) {
        console.error("Create order error:", error.message);
        res.status(500).json({
            message: "Failed to place order."
        });
    }
});

module.exports = router;
