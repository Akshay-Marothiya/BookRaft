
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { API_BASE } from "./api";
function Checkout() {
    const { cart, total, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        customerName: "",
        email: "",
        address: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...form,
                        items: cart.map(book => ({
                            bookId: book._id,
                            quantity: book.quantity
                        }))
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Checkout failed.");
            }

            clearCart();
            setSuccess(data);
        } catch (err) {
            setError(err.message || "Unable to place your order.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <main style={{ maxWidth: 650, margin: "50px auto", padding: 20 }}>
                <h1>Order Placed Successfully!</h1>
                <p>Your order has been saved.</p>
                <p>Order ID: {success.orderId}</p>
                <h2>Total: ₹{Number(success.total).toFixed(2)}</h2>
                <Link to="/">Continue Shopping</Link>
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main style={{ padding: 40, textAlign: "center" }}>
                <h1>Your cart is empty</h1>
                <Link to="/">Browse Books</Link>
            </main>
        );
    }

    return (
        <main style={{ maxWidth: 650, margin: "40px auto", padding: 20 }}>
            <h1>Checkout</h1>

            <h2>Order Summary</h2>
            {cart.map(book => (
                <p key={book._id}>
                    {book.title} × {book.quantity} — ₹
                    {(book.price * book.quantity).toFixed(2)}
                </p>
            ))}

            <h3>Total: ₹{total.toFixed(2)}</h3>

            <form onSubmit={handleSubmit}>
                <label>
                    Full Name
                    <input
                        name="customerName"
                        value={form.customerName}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        style={{ display: "block", width: "100%", marginBottom: 16 }}
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        maxLength={254}
                        style={{ display: "block", width: "100%", marginBottom: 16 }}
                    />
                </label>

                <label>
                    Delivery Address
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        maxLength={500}
                        rows={4}
                        style={{ display: "block", width: "100%", marginBottom: 16 }}
                    />
                </label>

                {error && (
                    <p role="alert" style={{ color: "red" }}>{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Placing Order..." : "Place Order"}
                </button>
            </form>
        </main>
    );
}

export default Checkout;
