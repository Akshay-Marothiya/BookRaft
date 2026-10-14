
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        items: [
            {
                bookId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book",
                    required: true
                },
                title: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true, min: 1 }
            }
        ],
        total: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Completed", "Cancelled"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

