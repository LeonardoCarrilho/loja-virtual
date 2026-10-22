import { useEffect, useState } from "react";
import { formatBRL } from "../data/products";

function CartThumb({ item }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="cart-thumb is-fallback" aria-hidden="true">
        {item.emoji}
      </span>
    );
  }

  return (
    <img
      className="cart-thumb"
      src={item.image}
      alt=""
      onError={() => setFailed(true)}
    />
  );
}

export default function CartDrawer({
  items,
  count,
  subtotal,
  shipping,
  total,
  freeShippingFrom,
  missingForFreeShipping,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const progress = Math.min(100, (subtotal / freeShippingFrom) * 100);

  return (
    <div className="drawer-root">
      <button
        type="button"
        className="drawer-overlay"
        aria-label="Fechar carrinho"
        onClick={onClose}
      />

      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <header className="cart-head">
          <div>
            <h2 id="cart-title">Seu carrinho</h2>
            <span>{count} {count === 1 ? "item" : "itens"}</span>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fechar carrinho">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon" aria-hidden="true">🛍️</span>
            <h3>Seu carrinho está vazio</h3>
            <p>Explore o catálogo e escolha algo que combine com você.</p>
            <button type="button" className="button" onClick={onClose}>
              Ver produtos
            </button>
          </div>
        ) : (
          <>
            <div className="shipping-box">
              <div className="shipping-copy">
                {missingForFreeShipping > 0 ? (
                  <span>
                    Faltam <strong>{formatBRL(missingForFreeShipping)}</strong> para o frete grátis
                  </span>
                ) : (
                  <span className="shipping-done">Você ganhou frete grátis!</span>
                )}
                <span className="shipping-icon" aria-hidden="true">🚚</span>
              </div>
              <div className="shipping-bar">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="cart-items">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <CartThumb item={item} />
                  <div className="cart-item-main">
                    <strong>{item.name}</strong>
                    <span className="cart-item-price">{formatBRL(item.price)}</span>
                    <div className="qty-control">
                      <button
                        type="button"
                        onClick={() => onDecrease(item.id)}
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        −
                      </button>
                      <span aria-label={`Quantidade: ${item.qty}`}>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => onIncrease(item.id)}
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-side">
                    <strong>{formatBRL(item.price * item.qty)}</strong>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remover ${item.name} do carrinho`}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="cart-footer">
              <dl className="cart-summary">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatBRL(subtotal)}</dd>
                </div>
                <div>
                  <dt>Frete</dt>
                  <dd>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</dd>
                </div>
                <div className="cart-total">
                  <dt>Total</dt>
                  <dd>{formatBRL(total)}</dd>
                </div>
              </dl>

              <button type="button" className="button button-full" onClick={onCheckout}>
                Finalizar compra
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <p className="cart-note">Ambiente de demonstração — nenhuma cobrança é feita.</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
