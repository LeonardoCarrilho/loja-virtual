import { useState } from "react";
import { formatBRL } from "../utils/format";

export default function ProductCard({
  product,
  onAdd,
  isFavorite = false,
  onToggleFavorite,
  inCartQty = 0,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const atStockLimit = Number.isFinite(product.stock) && inCartQty >= product.stock;

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
        {onToggleFavorite && (
          <button
            type="button"
            className={`favorite-button${isFavorite ? " is-active" : ""}`}
            onClick={() => onToggleFavorite(product.id)}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Remover ${product.name} dos favoritos`
                : `Adicionar ${product.name} aos favoritos`
            }
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20s-7-4.3-7-9.4A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 7 3.5C19 15.7 12 20 12 20Z" />
            </svg>
          </button>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          <span aria-hidden="true">★</span>
          {product.rating.toFixed(1)}
          <span className="sr-only">de 5</span>
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
            disabled={atStockLimit}
            aria-label={
              atStockLimit
                ? `${product.name} atingiu o limite de estoque`
                : `Adicionar ${product.name} ao carrinho`
            }
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
