
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

function Cart() {
    const {
        cart,
        removeFromCart,
        changeQuantity,
        total
    } = useCart();

    if (cart.length === 0) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h1>Your Cart Is Empty</h1>
                <p>Add some books to get started.</p>
                <Link to="/">Browse Books</Link>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: "1000px",
            margin: "40px auto",
            padding: "20px"
        }}>
            <h1>Shopping Cart</h1>

            {cart.map(book => (
                <div
                    key={book._id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "20px",
                        padding: "20px 0",
                        borderBottom: "1px solid #ddd",
                        flexWrap: "wrap"
                    }}
                >
                    <div>
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                        <p>₹{book.price} per book</p>
                    </div>

                    <div>
                        <button
                            onClick={() =>
                                changeQuantity(book._id, book.quantity - 1)
                            }
                        >
                            −
                        </button>

                        <span style={{ margin: "0 12px" }}>
                            {book.quantity}
                        </span>

                        <button
                            onClick={() =>
                                changeQuantity(book._id, book.quantity + 1)
                            }
                        >
                            +
                        </button>
                    </div>

                    <strong>
                        ₹{(book.price * book.quantity).toFixed(2)}
                    </strong>

                    <button
                        onClick={() => removeFromCart(book._id)}
                    >
                        Remove
                    </button>
                </div>
            ))}

            <div style={{ textAlign: "right", marginTop: "30px" }}>
                <h2>Total: ₹{total.toFixed(2)}</h2>

                <Link to="/">
                    Continue Shopping
                </Link>

                <button
                    style={{ marginLeft: "20px" }}
                    onClick={() =>
                        window.location.assign("/checkout")
                    }
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}

export default Cart;
