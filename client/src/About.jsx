
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css";

function About() {
    return (
        <div className="container">
            <Navbar />

            <main className="about-page store-content">
                {/* Introduction */}
                <section className="about-hero">
                    <span className="store-eyebrow">
                        THE PERSON BEHIND BOOKRAFT
                    </span>

                    <h1>
                        Hello, I'm the creator
                        <br />
                        <span>behind BookRaft.</span>
                    </h1>

                    <p>
                        I'm a developer who enjoys turning ideas into
                        real, usable experiences. BookRaft is one of
                        my projects, built around a simple idea:
                        making it easier to discover your next read.
                    </p>

                    <Link
                        to="/categories"
                        className="about-primary-button"
                    >
                        Explore BookRaft →
                    </Link>

                    <div className="about-decoration" aria-hidden="true">
                        <div className="about-book book-one">B</div>
                        <div className="about-book book-two">R</div>
                        <div className="about-book book-three">✦</div>
                    </div>
                </section>

                {/* My Story */}
                <section className="about-mission">
                    <div className="about-section-label">
                        <span className="store-eyebrow">MY STORY</span>
                        <h2>A project built from an idea.</h2>
                    </div>

                    <div className="about-mission-text">
                        <p>
                            I enjoy working with technology, exploring
                            new ideas, and building projects that bring
                            concepts to life. With BookRaft, I wanted
                            to create more than a basic book listing page.
                        </p>

                        <p>
                            I set out to build a complete e-book store
                            experience where people can browse categories,
                            discover books, manage a cart, and place orders
                            through a clean and approachable interface.
                        </p>

                        <p>
                            BookRaft is also an opportunity for me to
                            practise my development skills and learn by
                            building a project from the ground up.
                        </p>
                    </div>
                </section>

                {/* Project Values */}
                <section className="about-values">
                    <article className="about-value-card">
                        <span className="about-value-icon">⌘</span>
                        <h3>Built with Code</h3>
                        <p>
                            A hands-on project combining frontend design,
                            application logic, and database integration.
                        </p>
                    </article>

                    <article className="about-value-card">
                        <span className="about-value-icon">✦</span>
                        <h3>Made for Discovery</h3>
                        <p>
                            Categories and book collections help visitors
                            find something that matches their interests.
                        </p>
                    </article>

                    <article className="about-value-card">
                        <span className="about-value-icon">↗</span>
                        <h3>Always Improving</h3>
                        <p>
                            Every project is a chance to improve my skills,
                            refine details, and build something better.
                        </p>
                    </article>
                </section>

                {/* Closing */}
                <section className="about-cta">
                    <span className="store-eyebrow">
                        THANKS FOR STOPPING BY
                    </span>

                    <h2>This is BookRaft.</h2>

                    <p>
                        A project built with curiosity, code, and the
                        idea that there's always something new to discover.
                    </p>

                    <Link
                        to="/"
                        className="about-primary-button"
                    >
                        Visit the Store →
                    </Link>
                </section>
            </main>
        </div>
    );
}

export default About;
