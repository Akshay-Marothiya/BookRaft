
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

function Navbar() {
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const { cart } = useCart();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setProfileOpen(false);
        navigate("/login");
    }

    return (
        <header className="site-header">
            <div className="navbar">
                <Link to="/" className="brand">
                    <span className="brand-icon">B</span>
                    <span>Book<span className="brand-light">Raft</span></span>
                </Link>

                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/categories">Categories</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact</Link>
                </nav>

                <div className="nav-actions">
                    <Link
                        to="/cart"
                        className="nav-icon-link"
                        aria-label={`Shopping cart, ${cartCount} items`}
                    >
                        <span className="cart-symbol">♧</span>
                        <span className="cart-label">Cart</span>
                        <span className="cart-count">{cartCount}</span>
                    </Link>

                    <div className="profile-wrapper">
                        <button
                            className="profile-button"
                            onClick={() => setProfileOpen(!profileOpen)}
                            aria-expanded={profileOpen}
                            aria-label="Open profile menu"
                        >
                            <span className="profile-avatar">
                                {user?.name?.charAt(0)?.toUpperCase() || "G"}
                            </span>
                            <span className="profile-label">
                                {user?.name || "Account"}
                            </span>
                            <span>⌄</span>
                        </button>

                        {profileOpen && (
                            <div className="profile-dropdown">
                                <div className="profile-info">
                                    <strong>{user?.name || "Guest"}</strong>
                                    <span>{user?.role || "Visitor"}</span>
                                </div>

                                {user?.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}

                                {user ? (
                                    <button onClick={logout}>
                                        Log out
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        Log in / Register
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
