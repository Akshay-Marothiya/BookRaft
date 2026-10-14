
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { API_BASE } from "./api";
function Auth() {
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [role, setRole] = useState("user");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const endpoint = isRegister
                ? "/api/auth/register"
                : "/api/auth/login";

            const body = isRegister
                ? { name, email, password }
                : role === "admin"
                    ? { username, password }
                    : { email, password };

            const response = await fetch(`${API_BASE}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            if (isRegister) {
                setMessage("Account created successfully! You can now log in.");
                setIsRegister(false);
                setPassword("");
                setRole("user");
                setName("");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            setMessage(error.message || "Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    }

    function switchMode(registerMode) {
        setIsRegister(registerMode);
        setRole("user");
        setMessage("");
        setPassword("");
    }

    return (
        <main className="auth-page">
            <Link to="/" className="auth-brand">
                <span className="auth-brand-icon">B</span>
                <span>Book<span>Raft</span></span>
            </Link>

            <div className="auth-layout">
                <section className="auth-welcome">
                    <span className="auth-eyebrow">
                        YOUR NEXT CHAPTER STARTS HERE
                    </span>

                    <h1>
                        A world of stories.
                        <br />
                        <span>One place to find them.</span>
                    </h1>

                    <p>
                        Discover books, explore new ideas, and keep
                        your next favourite read close at hand.
                    </p>

                    <div className="auth-book-art" aria-hidden="true">
                        <div className="auth-book auth-book-a">Stories</div>
                        <div className="auth-book auth-book-b">Ideas</div>
                        <div className="auth-book auth-book-c">B</div>
                    </div>

                    <span className="auth-welcome-footer">
                        FIND YOUR NEXT FAVOURITE READ
                    </span>
                </section>

                <section className="auth-card">
                    <span className="auth-card-eyebrow">
                        {isRegister ? "JOIN BOOKRAFT" : "WELCOME BACK"}
                    </span>

                    <h2>
                        {isRegister ? "Create your account" : "Good to see you."}
                    </h2>

                    <p className="auth-subtitle">
                        {isRegister
                            ? "Create an account to get started."
                            : "Sign in and continue your journey."}
                    </p>

                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={!isRegister ? "active" : ""}
                            onClick={() => switchMode(false)}
                        >
                            Sign in
                        </button>

                        <button
                            type="button"
                            className={isRegister ? "active" : ""}
                            onClick={() => switchMode(true)}
                        >
                            Create account
                        </button>
                    </div>

                    {!isRegister && (
                        <div className="auth-field">
                            <label htmlFor="auth-role">Account type</label>
                            <select
                                id="auth-role"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                            >
                                <option value="user">Customer</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {isRegister && (
                            <div className="auth-field">
                                <label htmlFor="auth-name">Full name</label>
                                <input
                                    id="auth-name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Your full name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {!isRegister && role === "admin" ? (
                            <div className="auth-field">
                                <label htmlFor="auth-username">
                                    Admin username
                                </label>
                                <input
                                    id="auth-username"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="Enter admin username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        ) : (
                            <div className="auth-field">
                                <label htmlFor="auth-email">Email address</label>
                                <input
                                    id="auth-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="auth-field">
                            <label htmlFor="auth-password">Password</label>
                            <input
                                id="auth-password"
                                type="password"
                                autoComplete={
                                    isRegister ? "new-password" : "current-password"
                                }
                                placeholder={
                                    isRegister
                                        ? "At least 8 characters"
                                        : "Enter your password"
                                }
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                minLength={isRegister ? 8 : undefined}
                                required
                            />
                        </div>

                        {message && (
                            <p
                                className={`auth-message ${
                                    !isRegister &&
                                    message.toLowerCase().includes("successfully")
                                        ? "success"
                                        : ""
                                }`}
                                role="status"
                            >
                                {message}
                            </p>
                        )}

                        <button
                            className="auth-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Please wait..."
                                : isRegister
                                    ? "Create account →"
                                    : "Sign in →"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        {isRegister
                            ? "Already have an account?"
                            : "New to BookRaft?"}{" "}
                        <button
                            type="button"
                            onClick={() => switchMode(!isRegister)}
                        >
                            {isRegister ? "Sign in" : "Create an account"}
                        </button>
                    </p>

                    <Link to="/" className="auth-back-link">
                        ← Back to the store
                    </Link>
                </section>
            </div>

            <footer className="auth-footer">
                © {new Date().getFullYear()} BookRaft
            </footer>
        </main>
    );
}

export default Auth;
