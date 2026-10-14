
import { useState } from "react";

function BookCard({ title, author, price, book, onAddToCart }) {
    const [imageFailed, setImageFailed] = useState(false);
    const cover = book?.coverImage;

    return (
        <article className="book-card">
            <div className="book-card-cover">
                {cover && !imageFailed ? (
                    <img
                        src={cover}
                        alt={`Cover of ${title}`}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="book-cover-placeholder">
                        <span className="cover-brand">BOOKRAFT</span>
                        <span className="cover-title">{title}</span>
                        <span className="cover-author">{author}</span>
                        <span className="cover-decoration">✳</span>
                    </div>
                )}

                <span className="book-card-badge">eBook</span>
            </div>

            <div className="book-card-info">
                <h3 title={title}>{title}</h3>
                <p className="book-card-author">by {author}</p>

                <div
                    className="book-card-rating"
                    aria-label="Rating not available"
                >
                    <span className="rating-stars" aria-hidden="true">
                        ☆☆☆☆☆
                    </span>
                    <span className="rating-label">New arrival</span>
                </div>

                <div className="book-card-price">
                    <span className="price-currency">₹</span>
                    <span>
                        {Number(price).toLocaleString("en-IN")}
                    </span>
                </div>

                <button
                    type="button"
                    className="book-card-button"
                    onClick={() => onAddToCart(book)}
                    disabled={!book || !onAddToCart}
                >
                    Add to Cart
                </button>
            </div>
        </article>
    );
}

export default BookCard;
