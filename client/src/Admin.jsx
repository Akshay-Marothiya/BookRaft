
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

const emptyForm = {
    title: "",
    author: "",
    price: "",
    category: "Programming",
    coverImage: "",
    description: ""
};

function Admin() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const token = localStorage.getItem("token");

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        user = null;
    }

    const request = useCallback(async (url, options = {}) => {
        const response = await fetch(`http://localhost:5000${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Request failed.");
        }

        return data;
    }, [token]);

    const loadBooks = useCallback(async () => {
        setLoadingBooks(true);

        try {
            const data = await request("/api/admin/books");
            setBooks(data);
        } catch (err) {
            setMessage(err.message || "Unable to load books.");
            setError(true);
        } finally {
            setLoadingBooks(false);
        }
    }, [request]);

    const loadOrders = useCallback(async () => {
        setLoadingOrders(true);

        try {
            const data = await request("/api/admin/orders");
            setOrders(data);
        } catch (err) {
            setMessage(err.message || "Unable to load orders.");
            setError(true);
        } finally {
            setLoadingOrders(false);
        }
    }, [request]);

    useEffect(() => {
        if (!token || user?.role !== "admin") {
            navigate("/login", { replace: true });
            return;
        }

        loadBooks();
        loadOrders();
    }, [token, user?.role, navigate, loadBooks, loadOrders]);

    function updateForm(event) {
        const { name, value } = event.target;

        setForm(current => ({
            ...current,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setError(false);
        setSaving(true);

        try {
            await request("/api/admin/books", {
                method: "POST",
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price)
                })
            });

            setForm({ ...emptyForm });
            setMessage("Book added successfully.");
            await loadBooks();
        } catch (err) {
            setMessage(err.message || "Unable to add book.");
            setError(true);
        } finally {
            setSaving(false);
        }
    }

    async function deleteBook(id) {
        if (!window.confirm("Are you sure you want to delete this book?")) {
            return;
        }

        setMessage("");
        setError(false);

        try {
            await request(`/api/admin/books/${id}`, {
                method: "DELETE"
            });

            setBooks(current => current.filter(book => book._id !== id));
            setMessage("Book deleted successfully.");
        } catch (err) {
            setMessage(err.message || "Unable to delete book.");
            setError(true);
        }
    }

    async function updateOrderStatus(orderId, status) {
        setMessage("");
        setError(false);

        try {
            await request(`/api/admin/orders/${orderId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status })
            });

            setOrders(current =>
                current.map(order =>
                    order._id === orderId
                        ? { ...order, status }
                        : order
                )
            );

            setMessage("Order status updated.");
        } catch (err) {
            setMessage(err.message || "Unable to update order.");
            setError(true);
            await loadOrders();
        }
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    }

    const totalRevenue = orders
        .filter(order => order.status === "Completed")
        .reduce((sum, order) => sum + Number(order.total || 0), 0);

    const pendingOrders = orders.filter(
        order => order.status === "Pending"
    ).length;

    return (
        <main className="admin-page">
            <header className="admin-topbar">
                <Link to="/" className="admin-brand">
                    <span className="admin-brand-icon">B</span>
                    <span>Book<span>Raft</span></span>
                    <span className="admin-brand-label">ADMIN</span>
                </Link>

                <div className="admin-topbar-actions">
                    <span className="admin-user-label">
                        <span className="admin-user-dot" />
                        Administrator
                    </span>

                    <Link to="/" className="admin-store-link">
                        View Store ↗
                    </Link>

                    <button
                        type="button"
                        className="admin-logout"
                        onClick={logout}
                    >
                        Log out
                    </button>
                </div>
            </header>

            <div className="admin-content">
                <section className="admin-welcome">
                    <div>
                        <span className="admin-eyebrow">
                            STORE MANAGEMENT
                        </span>
                        <h1>Dashboard</h1>
                        <p>
                            Manage your book collection and keep track
                            of customer orders.
                        </p>
                    </div>

                    <div className="admin-date">
                        {new Date().toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </div>
                </section>

                <section className="admin-stats">
                    <article className="admin-stat-card">
                        <span className="admin-stat-icon">▤</span>
                        <div>
                            <p>Total books</p>
                            <h2>{books.length}</h2>
                        </div>
                    </article>

                    <article className="admin-stat-card">
                        <span className="admin-stat-icon">▣</span>
                        <div>
                            <p>Total orders</p>
                            <h2>{orders.length}</h2>
                        </div>
                    </article>

                    <article className="admin-stat-card">
                        <span className="admin-stat-icon">◷</span>
                        <div>
                            <p>Pending orders</p>
                            <h2>{pendingOrders}</h2>
                        </div>
                    </article>

                    <article className="admin-stat-card">
                        <span className="admin-stat-icon">₹</span>
                        <div>
                            <p>Completed sales</p>
                            <h2>
                                ₹{totalRevenue.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2
                                })}
                            </h2>
                        </div>
                    </article>
                </section>

                {message && (
                    <div
                        className={`admin-message ${error ? "is-error" : "is-success"}`}
                        role={error ? "alert" : "status"}
                    >
                        <span>{error ? "!" : "✓"}</span>
                        {message}
                        <button
                            type="button"
                            onClick={() => setMessage("")}
                            aria-label="Dismiss message"
                        >
                            ×
                        </button>
                    </div>
                )}

                <section className="admin-panel" id="add-book">
                    <div className="admin-section-heading">
                        <div>
                            <span className="admin-eyebrow">INVENTORY</span>
                            <h2>Add a new book</h2>
                            <p>Add a title to your store collection.</p>
                        </div>
                    </div>

                    <form className="admin-book-form" onSubmit={handleSubmit}>
                        <div className="admin-form-grid">
                            <div className="admin-field">
                                <label htmlFor="book-title">Book title</label>
                                <input
                                    id="book-title"
                                    name="title"
                                    value={form.title}
                                    onChange={updateForm}
                                    placeholder="Enter book title"
                                    required
                                />
                            </div>

                            <div className="admin-field">
                                <label htmlFor="book-author">Author</label>
                                <input
                                    id="book-author"
                                    name="author"
                                    value={form.author}
                                    onChange={updateForm}
                                    placeholder="Enter author name"
                                    required
                                />
                            </div>

                            <div className="admin-field">
                                <label htmlFor="book-price">Price (₹)</label>
                                <input
                                    id="book-price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={updateForm}
                                    placeholder="299"
                                    required
                                />
                            </div>

                            <div className="admin-field">
                                <label htmlFor="book-category">Category</label>
                                <select
                                    id="book-category"
                                    name="category"
                                    value={form.category}
                                    onChange={updateForm}
                                >
                                    <option>Programming</option>
                                    <option>Self-Help</option>
                                    <option>Finance</option>
                                    <option>Fantasy</option>
                                    <option>Fiction</option>
                                </select>
                            </div>

                            <div className="admin-field admin-field-wide">
                                <label htmlFor="book-cover">Cover image URL</label>
                                <input
                                    id="book-cover"
                                    name="coverImage"
                                    type="url"
                                    value={form.coverImage}
                                    onChange={updateForm}
                                    placeholder="https://example.com/cover.jpg"
                                />
                            </div>

                            <div className="admin-field admin-field-wide">
                                <label htmlFor="book-description">
                                    Description
                                </label>
                                <textarea
                                    id="book-description"
                                    name="description"
                                    value={form.description}
                                    onChange={updateForm}
                                    placeholder="Write a short description..."
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="admin-form-footer">
                            <p>Fields marked by the form are required.</p>
                            <button
                                className="admin-primary-button"
                                type="submit"
                                disabled={saving}
                            >
                                {saving ? "Adding book..." : "+ Add book"}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="admin-panel">
                    <div className="admin-section-heading admin-heading-row">
                        <div>
                            <span className="admin-eyebrow">YOUR CATALOGUE</span>
                            <h2>Manage books</h2>
                            <p>Review and manage the books available in your store.</p>
                        </div>

                        <button
                            type="button"
                            className="admin-secondary-button"
                            onClick={loadBooks}
                            disabled={loadingBooks}
                        >
                            {loadingBooks ? "Loading..." : "↻ Refresh"}
                        </button>
                    </div>

                    {loadingBooks ? (
                        <p className="admin-empty">Loading books...</p>
                    ) : books.length === 0 ? (
                        <p className="admin-empty">
                            No books found. Add your first book above.
                        </p>
                    ) : (
                        <div className="admin-book-list">
                            {books.map(book => (
                                <article className="admin-book-row" key={book._id}>
                                    <div className="admin-book-cover">
                                        {book.coverImage ? (
                                            <img
                                                src={book.coverImage}
                                                alt=""
                                                onError={event => {
                                                    event.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <span>B</span>
                                        )}
                                    </div>

                                    <div className="admin-book-details">
                                        <h3>{book.title}</h3>
                                        <p>by {book.author}</p>
                                        <div className="admin-book-meta">
                                            <span>{book.category}</span>
                                            <strong>
                                                ₹{Number(book.price).toLocaleString("en-IN")}
                                            </strong>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="admin-delete-button"
                                        onClick={() => deleteBook(book._id)}
                                    >
                                        Delete
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="admin-panel" id="customer-orders">
                    <div className="admin-section-heading admin-heading-row">
                        <div>
                            <span className="admin-eyebrow">ORDER MANAGEMENT</span>
                            <h2>Customer orders</h2>
                            <p>Review customer details and update order status.</p>
                        </div>

                        <button
                            type="button"
                            className="admin-secondary-button"
                            onClick={loadOrders}
                            disabled={loadingOrders}
                        >
                            {loadingOrders ? "Loading..." : "↻ Refresh"}
                        </button>
                    </div>

                    {loadingOrders ? (
                        <p className="admin-empty">Loading orders...</p>
                    ) : orders.length === 0 ? (
                        <div className="admin-empty">
                            <span className="admin-empty-icon">▣</span>
                            <h3>No orders yet</h3>
                            <p>Customer orders will appear here when placed.</p>
                        </div>
                    ) : (
                        <div className="admin-order-list">
                            {orders.map(order => (
                                <article className="admin-order-card" key={order._id}>
                                    <div className="admin-order-header">
                                        <div>
                                            <span className="admin-order-label">
                                                ORDER
                                            </span>
                                            <h3>#{order._id.slice(-8).toUpperCase()}</h3>
                                            <p>
                                                {new Date(order.createdAt).toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                        <span
                                            className={`admin-status status-${order.status.toLowerCase()}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="admin-customer-details">
                                        <div>
                                            <span>Customer</span>
                                            <strong>{order.customerName}</strong>
                                        </div>
                                        <div>
                                            <span>Email</span>
                                            <strong>{order.email}</strong>
                                        </div>
                                        <div className="admin-address">
                                            <span>Delivery address</span>
                                            <strong>{order.address}</strong>
                                        </div>
                                    </div>

                                    <div className="admin-order-items">
                                        <h4>Order items</h4>

                                        {order.items.map((item, index) => (
                                            <div
                                                className="admin-order-item"
                                                key={`${order._id}-${index}`}
                                            >
                                                <span>
                                                    {item.title} × {item.quantity}
                                                </span>
                                                <strong>
                                                    ₹{(
                                                        Number(item.price) *
                                                        Number(item.quantity)
                                                    ).toLocaleString("en-IN", {
                                                        maximumFractionDigits: 2
                                                    })}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="admin-order-footer">
                                        <div className="admin-order-total">
                                            <span>Order total</span>
                                            <strong>
                                                ₹{Number(order.total).toLocaleString("en-IN", {
                                                    maximumFractionDigits: 2
                                                })}
                                            </strong>
                                        </div>

                                        <div className="admin-status-control">
                                            <label htmlFor={`status-${order._id}`}>
                                                Update status
                                            </label>
                                            <select
                                                id={`status-${order._id}`}
                                                value={order.status}
                                                onChange={event =>
                                                    updateOrderStatus(
                                                        order._id,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <footer className="admin-footer">
                    <Link to="/" className="admin-footer-brand">
                        BookRaft
                    </Link>
                    <span>Store administration</span>
                </footer>
            </div>
        </main>
    );
}

export default Admin;
