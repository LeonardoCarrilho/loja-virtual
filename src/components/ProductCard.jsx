import { useState } from "react";
import { formatBRL } from "../data/products";

export default function ProductCard({ product, onAdd }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="product-card">
      <div className={`product-media${imageFailed ? " is-fallback" : ""}`}>
        {imageFailed ? (
          <span className="product-emoji" aria-hidden="true">
            {product.emoji}
          </span>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        {product.tag && <span className="product-tag">{product.tag}</span>}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          <span aria-hidden="true">★</span>
          {product.rating.toFixed(1)}
        </div>

        <div className="product-bottom">
          <div className="product-price">
            <strong>{formatBRL(product.price)}</strong>
            {product.oldPrice && <s>{formatBRL(product.oldPrice)}</s>}
          </div>
          <button
            type="button"
            className="add-button"
            onClick={() => onAdd(product)}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
