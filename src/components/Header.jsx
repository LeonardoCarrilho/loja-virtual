export default function Header({
  count,
  favoritesCount = 0,
  onlyFavorites = false,
  onToggleFavorites,
  onOpenCart,
}) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="logo" href="#top">
          <span className="logo-mark" aria-hidden="true">N</span>
          <span>Norte<span className="logo-dot">.</span></span>
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#produtos">Produtos</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className={`favorites-button${onlyFavorites ? " is-active" : ""}`}
            onClick={onToggleFavorites}
            aria-pressed={onlyFavorites}
            aria-label={
              onlyFavorites
                ? `Mostrando somente favoritos (${favoritesCount}). Desativar filtro`
                : `Mostrar somente favoritos (${favoritesCount})`
            }
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20s-7-4.3-7-9.4A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 7 3.5C19 15.7 12 20 12 20Z" />
            </svg>
            <span className="favorites-button-text">Favoritos</span>
            <span className="favorites-count" aria-hidden="true">{favoritesCount}</span>
          </button>

          <button
            type="button"
            className="cart-button"
            onClick={onOpenCart}
            aria-label={`Abrir carrinho com ${count} ${count === 1 ? "item" : "itens"}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 8h12l1 12H5L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="cart-button-text">Carrinho</span>
            {count > 0 && <span className="cart-count">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
