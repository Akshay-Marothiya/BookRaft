import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { useCart } from "./CartContext";
import Navbar from "./Navbar";
import HeroCarousel from "./HeroCarousel";
import "./App.css";
import { API_BASE } from "./api";
function Store() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(
    () => new URLSearchParams(window.location.search).get("category") || "All"
);
    const [maxPrice, setMaxPrice] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { addToCart } = useCart();

    useEffect(() => {
        const controller = new AbortController();

        async function loadBooks() {
            setLoading(true);
            setError("");

            try {
                const params = new URLSearchParams();

                if (search.trim()) {
                    params.append("search", search.trim());
                }

                if (category !== "All") {
                    params.append("category", category);
                }

                if (maxPrice !== "") {
                    params.append("maxPrice", maxPrice);
                }

                const response = await fetch(
    `${API_BASE}/api/books?${params.toString()}`,
    { signal: controller.signal }
);

                if (!response.ok) {
                    throw new Error("Failed to fetch books.");
                }

                const data = await response.json();
                setBooks(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Book loading error:", err);
                    setError(
                        "Unable to load books. Please check your connection and try again."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadBooks();

        return () => controller.abort();
    }, [search, category, maxPrice]);

    function clearFilters() {
        setSearch("");
        setCategory("All");
        setMaxPrice("");
    }

    return (
        <div className="container">
            <Navbar />
            <HeroCarousel />

            <main className="store-content">
                <section className="store-intro">
                    <span className="store-eyebrow">
                        THE BOOKRAFT COLLECTION
                    </span>

                    <div className="store-section-header">
                        <div>
                            <h1>Find your next favourite read.</h1>
                            <p>
                                Thoughtfully selected stories, fresh ideas,
                                and worlds waiting to be discovered.
                            </p>
                        </div>

                        {!loading && !error && (
                            <span className="book-result-count">
                                {books.length}{" "}
                                {books.length === 1 ? "book" : "books"}
                            </span>
                        )}
                    </div>
                </section>

                <section className="store-section" aria-label="Search and filter books">
                    <div className="store-toolbar">
                        <input
                            type="search"
                            placeholder="Search by title or author..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            aria-label="Search books by title or author"
                        />

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                            aria-label="Filter books by category"
                        >
                            <option value="All">All Categories</option>
                            <option value="Programming">Programming</option>
                            <option value="Self-Help">Self-Help</option>
                            <option value="Finance">Finance</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Fiction">Fiction</option>
                        </select>

                        <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Max price (₹)"
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(event.target.value)
                            }
                            aria-label="Maximum book price"
                        />

                        <button
                            type="button"
                            className="clear-filters-button"
                            onClick={clearFilters}
                            disabled={
                                !search &&
                                category === "All" &&
                                maxPrice === ""
                            }
                        >
                            Clear filters
                        </button>
                    </div>
                </section>

                <section className="store-section" id="books">
                    <div className="store-section-header">
                        <div>
                            <h2>Explore Our Collection</h2>
                            <p>
                                Find a book that matches your curiosity.
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <div className="store-empty" role="status">
                            Loading your next great read...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="store-empty" role="alert">
                            <p>{error}</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch((current) => current);
                                    setCategory((current) => current);
                                    setMaxPrice((current) => current);
                                }}
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {!loading && !error && books.length === 0 && (
                        <div className="store-empty">
                            <h3>No books found</h3>
                            <p>
                                Try another search or adjust your filters.
                            </p>
                            <button
                                type="button"
                                className="clear-filters-button"
                                onClick={clearFilters}
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {!loading && !error && books.length > 0 && (
                        <div className="book-grid">
                            {books.map((book) => (
                                <BookCard
                                    key={book._id}
                                    title={book.title}
                                    author={book.author}
                                    price={book.price}
                                    book={book}
                                    onAddToCart={addToCart}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <footer className="store-footer" id="contact">
                <div className="store-footer-inner">
                    <a href="/" className="brand">
                        <span className="brand-icon">B</span>
                        <span>
                            Book<span className="brand-light">Raft</span>
                        </span>
                    </a>

                    <p>
                        A good book can take you anywhere.
                    </p>

                    <div className="store-footer-links">
                        <a href="/#books">Explore Books</a>
                        <a href="/#categories">Categories</a>
                        <a href="/#about">About Us</a>
                        <a href="/#contact">Contact</a>
                    </div>

                    <small>
                        © {new Date().getFullYear()} BookRaft. All rights reserved.
                    </small>
                </div>
            </footer>
        </div>
    );
}

export default Store;
