
import { useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [error, setError] = useState("");

    // Replace this with your actual contact email.
    const contactEmail = "honeymarothiya2005@gmail.com";

    function handleChange(event) {
        const { name, value } = event.target;

        setForm(current => ({
            ...current,
            [name]: value
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!contactEmail) {
            setError(
                "The contact email hasn't been configured yet. Please use the email option once it is available."
            );
            return;
        }

        const subject = encodeURIComponent(
            form.subject || "Message from BookRaft"
        );

        const body = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
        );

        window.location.href =
            `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    }

    return (
        <div className="container">
            <Navbar />

            <main className="contact-page store-content">
                <header className="contact-heading">
                    <span className="store-eyebrow">GET IN TOUCH</span>

                    <h1>Let's start a conversation.</h1>

                    <p>
                        Have a question, feedback, or an idea to share?
                        Send a message. I'd be happy to hear from you.
                    </p>
                </header>

                <div className="contact-layout">
                    <aside className="contact-info">
                        <span className="store-eyebrow">
                            CONTACT INFORMATION
                        </span>

                        <h2>We're listening.</h2>

                        <p>
                            Whether it's about the store or a suggestion
                            for making BookRaft better, this is the place
                            to reach out.
                        </p>

                        <div className="contact-info-item">
                            <span className="contact-info-icon">@</span>
                            <div>
                                <h3>Email</h3>
                                <p>
                                    {contactEmail ||
                                        "Contact email coming soon"}
                                </p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <span className="contact-info-icon">◷</span>
                            <div>
                                <h3>Response time</h3>
                                <p>I'll respond as soon as I can.</p>
                            </div>
                        </div>

                        <div className="contact-note">
                            Your feedback helps make BookRaft better.
                        </div>
                    </aside>

                    <section className="contact-form-panel">
                        <h2>Send a message</h2>
                        <p className="contact-form-subtitle">
                            Fill in the details below to compose your message.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="contact-form-row">
                                <div className="contact-field">
                                    <label htmlFor="contact-name">
                                        Your name
                                    </label>
                                    <input
                                        id="contact-name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                        required
                                    />
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="contact-email">
                                        Email address
                                    </label>
                                    <input
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-subject">
                                    Subject
                                </label>
                                <input
                                    id="contact-subject"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="What is this about?"
                                    required
                                />
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-message">
                                    Message
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    rows={6}
                                    required
                                />
                            </div>

                            {error && (
                                <p className="contact-error" role="alert">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="about-primary-button contact-submit"
                            >
                                Compose Email →
                            </button>

                            <p className="contact-privacy-note">
                                This opens your default email application.
                                Your message isn't sent directly by this form.
                            </p>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Contact;
