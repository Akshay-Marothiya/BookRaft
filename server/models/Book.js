const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Book", bookSchema);