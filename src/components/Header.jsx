export default function Header({ count, onOpenCart }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="logo" href="#top" aria-label="Norte Store — início">
          <span className="logo-mark" aria-hidden="true">N</span>
          <span>Norte<span className="logo-dot">.</span></span>
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#produtos">Produtos</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>

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
    </header>
  );
}
