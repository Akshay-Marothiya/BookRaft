
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
    {
        eyebrow: "THE ART OF READING",
        title: "Find your next great escape.",
        description:
            "Extraordinary stories, timeless classics, and new perspectives await in your next read.",
        button: "Explore the collection",
        category: "Fiction",
        number: "01",
        className: "hero-slide-one"
    },
    {
        eyebrow: "KNOW MORE. GROW MORE.",
        title: "A little reading changes everything.",
        description:
            "Discover books that challenge your thinking, spark curiosity, and inspire your next chapter.",
        button: "Discover nonfiction",
        category: "Self-Development",
        number: "02",
        className: "hero-slide-two"
    },
    {
        eyebrow: "WORLDS BEYOND YOUR OWN",
        title: "Adventure is one page away.",
        description:
            "Travel through impossible worlds, unforgettable characters, and stories that stay with you.",
        button: "Find your adventure",
        category: "Science Fiction",
        number: "03",
        className: "hero-slide-three"
    }
];

function HeroCarousel() {
    const [active, setActive] = useState(0);

    function nextSlide() {
        setActive(current => (current + 1) % slides.length);
    }

    function previousSlide() {
        setActive(current =>
            (current - 1 + slides.length) % slides.length
        );
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setActive(current => (current + 1) % slides.length);
        }, 6000);

        return () => clearInterval(timer);
    }, []);

    const slide = slides[active];

    return (
        <section className="hero-section">
            <div className={`hero-carousel ${slide.className}`}>
                <div className="hero-copy" key={slide.number}>
                    <span className="hero-eyebrow">
                        <span className="eyebrow-line"></span>
                        {slide.eyebrow}
                    </span>

                    <h1>{slide.title}</h1>

                    <p>{slide.description}</p>

                    <div className="hero-buttons">
                        <a href="/#books" className="hero-primary-button">
                            {slide.button} <span>↗</span>
                        </a>
                        <a href="/#categories" className="hero-secondary-button">
                            Browse categories
                        </a>
                    </div>

                    <div className="hero-bottom">
                        <span>CURATED FOR CURIOUS MINDS</span>
                        <span>{slide.number} / 03</span>
                    </div>
                </div>

                <div className="hero-art" aria-hidden="true">
                    <div className="hero-orbit orbit-one"></div>
                    <div className="hero-orbit orbit-two"></div>

                    <div className="hero-book hero-book-back">
                        <span>THE ART OF</span>
                        <strong>DISCOVERY</strong>
                        <span className="cover-decoration">✳</span>
                    </div>

                    <div className="hero-book hero-book-front">
                        <span>BOOKRAFT EDITIONS</span>
                        <strong>{slide.category.toUpperCase()}</strong>
                        <div className="cover-rule"></div>
                        <span className="cover-subtitle">
                            A WORLD OF IDEAS
                        </span>
                    </div>

                    <span className="hero-art-caption">
                        YOUR NEXT CHAPTER
                    </span>
                </div>

                <div className="hero-controls">
                    <button
                        onClick={previousSlide}
                        aria-label="Previous slide"
                    >
                        ←
                    </button>

                    <div className="hero-dots">
                        {slides.map((item, index) => (
                            <button
                                key={item.number}
                                className={active === index ? "active" : ""}
                                onClick={() => setActive(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={active === index ? "true" : undefined}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        →
                    </button>
                </div>
            </div>
        </section>
    );
}

export default HeroCarousel;
