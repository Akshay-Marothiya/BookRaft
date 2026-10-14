
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css";

const categories = [
    {
        name: "Programming",
        icon: "⌘",
        description: "Learn coding, software development, and clean code."
    },
    {
        name: "Self-Help",
        icon: "✦",
        description: "Build better habits and develop yourself."
    },
    {
        name: "Finance",
        icon: "₹",
        description: "Explore money management and financial thinking."
    },
    {
        name: "Fantasy",
        icon: "✧",
        description: "Discover magical worlds and epic adventures."
    },
    {
        name: "Fiction",
        icon: "❝",
        description: "Explore unforgettable characters and stories."
    }
];

function Categories() {
    const navigate = useNavigate();
    const [bookCounts, setBookCounts] = useState({});

    useEffect(() => {
        async function loadCounts() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/books"
                );

                if (!response.ok) return;

                const books = await response.json();
                const counts = {};

                for (const book of books) {
                    counts[book.category] =
                        (counts[book.category] || 0) + 1;
                }

                setBookCounts(counts);
            } catch (error) {
                console.error("Unable to load categories:", error);
            }
        }

        loadCounts();
    }, []);

    function openCategory(category) {
        navigate(`/?category=${encodeURIComponent(category)}#books`);
    }

    return (
        <div className="container">
            <Navbar />

            <main className="categories-page store-content">
                <header className="categories-heading">
                    <span className="store-eyebrow">
                        FIND YOUR NEXT READ
                    </span>

                    <h1>Explore Categories</h1>

                    <p>
                        From practical knowledge to imaginative worlds,
                        discover books that match your interests.
                    </p>
                </header>

                <section className="categories-page-grid">
                    {categories.map(category => (
                        <button
                            type="button"
                            className="categories-page-card"
                            key={category.name}
                            onClick={() => openCategory(category.name)}
                        >
                            <span className="categories-page-icon">
                                {category.icon}
                            </span>

                            <h2>{category.name}</h2>

                            <p>{category.description}</p>

                            <span className="categories-page-count">
                                {bookCounts[category.name] || 0} books
                            </span>

                            <span className="categories-page-link">
                                Explore books →
                            </span>
                        </button>
                    ))}
                </section>
            </main>
        </div>
    );
}

export default Categories;
