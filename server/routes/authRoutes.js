
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register a regular user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user"
        });

        res.status(201).json({
            message: "Registration successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        console.error("Registration error:", error.message);
        res.status(500).json({
            message: "Registration failed."
        });
    }
});

// Login: predefined admin or registered user
router.post("/login", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required."
            });
        }

        let identity;
        let role;
        let userId = null;
        let displayName;

        // Predefined administrator
        if (
            username &&
            username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
        ) {
            identity = username;
            role = "admin";
            displayName = "Administrator";
        } else {
            // Regular user login
            if (!email) {
                return res.status(401).json({
                    message: "Invalid credentials."
                });
            }

            const user = await User.findOne({
                email: email.trim().toLowerCase()
            });

            if (
                !user ||
                !(await bcrypt.compare(password, user.password))
            ) {
                return res.status(401).json({
                    message: "Invalid credentials."
                });
            }

            identity = user.email;
            role = "user";
            userId = user._id.toString();
            displayName = user.name;
        }

        const token = jwt.sign(
            { sub: userId || identity, role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login successful.",
            token,
            user: {
                id: userId,
                name: displayName,
                role
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            message: "Login failed."
        });
    }
});

module.exports = router;
