import { useMemo, useState } from "react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import { categories, products } from "./data/products";
import { useCart } from "./hooks/useCart";
import { useFavorites } from "./hooks/useFavorites";
import { formatBRL } from "./utils/format";
import {
  ALL_CATEGORIES,
  SORT_OPTIONS,
  getPriceBounds,
  hasActiveFilters,
  normalizePriceRange,
  selectProducts,
} from "./utils/catalog";

function HeroVisual() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="hero-visual">
      <div className={`hero-media${imageFailed ? " is-fallback" : ""}`}>
        {imageFailed ? (
          <span className="hero-emoji" aria-hidden="true">⌚</span>
        ) : (
          <img
            src={products[1].image}
            alt="Smartwatch Pulse em destaque"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <div className="hero-float hero-float-top">
        <span className="float-icon" aria-hidden="true">★</span>
        <span>
          <strong>4,8 de 5</strong>
          <small>avaliação dos clientes</small>
        </span>
      </div>

      <div className="hero-float hero-float-bottom">
        <span className="float-icon" aria-hidden="true">🚚</span>
        <span>
          <strong>Frete grátis</strong>
          <small>acima de R$ 250</small>
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [sort, setSort] = useState("relevance");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const cart = useCart();
  const favorites = useFavorites();

  const priceBounds = useMemo(() => getPriceBounds(products), []);
  const activePriceRange = useMemo(
    () => normalizePriceRange(products, priceRange),
    [priceRange]
  );

  const visibleProducts = useMemo(
    () =>
      selectProducts(products, {
        query,
        category,
        sort,
        onlyFavorites,
        favoriteIds: favorites.ids,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      }),
    [query, category, sort, onlyFavorites, favorites.ids, priceRange]
  );

  const quantityByProduct = useMemo(
    () => new Map(cart.items.map((item) => [item.id, item.qty])),
    [cart.items]
  );

  const filtersAreActive = hasActiveFilters({
    query,
    category,
    sort,
    onlyFavorites,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
  });

  const openCart = () => setCartOpen(true);
  const openCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handlePriceChange = (field) => (event) => {
    const value = Number(event.target.value);

    setPriceRange((current) => {
      const range = normalizePriceRange(products, current);

      return field === "min"
        ? { min: Math.min(value, range.max), max: range.max }
        : { min: range.min, max: Math.max(value, range.min) };
    });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory(ALL_CATEGORIES);
    setSort("relevance");
    setOnlyFavorites(false);
    setPriceRange({ min: null, max: null });
  };

  const favoritesEmpty = onlyFavorites && favorites.count === 0;

  return (
    <div id="top">
      <div className="announcement">
        Frete grátis em pedidos acima de R$ 250 · Troca fácil em 7 dias
      </div>

      <Header
        count={cart.count}
        favoritesCount={favorites.count}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={() => setOnlyFavorites((current) => !current)}
        onOpenCart={openCart}
      />

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">Nova coleção · 2026</span>
              <h1>
                Objetos que acompanham o seu <em>dia.</em>
              </h1>
              <p>
                Tecnologia, áudio e acessórios escolhidos para deixar a rotina mais leve,
                bonita e produtiva.
              </p>
              <div className="hero-actions">
                <a className="button" href="#produtos">
                  Ver produtos
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <span className="hero-note">Curadoria pequena, escolhas certeiras.</span>
              </div>

              <dl className="hero-stats">
                <div>
                  <dt>Produtos</dt>
                  <dd>08</dd>
                </div>
                <div>
                  <dt>Avaliação</dt>
                  <dd>4,8</dd>
                </div>
                <div>
                  <dt>Envio</dt>
                  <dd>24h</dd>
                </div>
              </dl>
            </div>

            <HeroVisual />
          </div>
        </section>

        <section className="section" id="produtos" aria-labelledby="catalog-title">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Catálogo</span>
                <h2 id="catalog-title">Escolhas da estação</h2>
              </div>
              <span className="results-count" role="status" aria-live="polite">
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1 ? "produto" : "produtos"}
                {onlyFavorites ? " em favoritos" : ""}
              </span>
            </div>

            <div className="catalog-toolbar">
              <div className="search-field">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6" />
                  <path d="M16 16l4 4" />
                </svg>
                <label className="sr-only" htmlFor="search">Buscar produtos</label>
                <input
                  id="search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por nome ou categoria"
                />
                {query && (
                  <button type="button" className="clear-search" onClick={() => setQuery("")} aria-label="Limpar busca">
                    ×
                  </button>
                )}
              </div>

              <div className="sort-field">
                <label htmlFor="sort">Ordenar por</label>
                <select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="catalog-filters">
              <fieldset className="price-field">
                <legend>Faixa de preço</legend>
                <div className="price-slider">
                  <label htmlFor="price-min">Mín.</label>
                  <input
                    id="price-min"
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={priceBounds.step}
                    value={activePriceRange.min}
                    onChange={handlePriceChange("min")}
                    aria-valuetext={formatBRL(activePriceRange.min)}
                  />
                  <output htmlFor="price-min">{formatBRL(activePriceRange.min)}</output>
                </div>
                <div className="price-slider">
                  <label htmlFor="price-max">Máx.</label>
                  <input
                    id="price-max"
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={priceBounds.step}
                    value={activePriceRange.max}
                    onChange={handlePriceChange("max")}
                    aria-valuetext={formatBRL(activePriceRange.max)}
                  />
                  <output htmlFor="price-max">{formatBRL(activePriceRange.max)}</output>
                </div>
              </fieldset>

              <button
                type="button"
                className={`toggle-filter${onlyFavorites ? " is-active" : ""}`}
                onClick={() => setOnlyFavorites((current) => !current)}
                aria-pressed={onlyFavorites}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 20s-7-4.3-7-9.4A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 7 3.5C19 15.7 12 20 12 20Z" />
                </svg>
                Somente favoritos
                <span className="filter-count">{favorites.count}</span>
              </button>

              {filtersAreActive && (
                <button type="button" className="clear-filters" onClick={clearFilters}>
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="category-pills" role="group" aria-label="Filtrar por categoria">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={category === item ? "is-active" : ""}
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                >
                  {item}
                </button>
              ))}
            </div>

            {visibleProducts.length === 0 ? (
              <div className="empty-catalog">
                <span aria-hidden="true">{favoritesEmpty ? "♡" : "🔎"}</span>
                <h3>{favoritesEmpty ? "Nenhum favorito ainda" : "Nenhum produto encontrado"}</h3>
                <p>
                  {favoritesEmpty
                    ? "Toque no coração dos produtos para montar a sua lista."
                    : "Tente outro termo, ajuste a faixa de preço ou remova os filtros."}
                </p>
                {filtersAreActive && !favoritesEmpty && (
                  <button type="button" className="button" onClick={clearFilters}>
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={cart.add}
                    isFavorite={favorites.isFavorite(product.id)}
                    onToggleFavorite={favorites.toggle}
                    inCartQty={quantityByProduct.get(product.id) ?? 0}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section section-soft" id="sobre" aria-labelledby="about-title">
          <div className="container about-grid">
            <div className="about-copy">
              <span className="eyebrow">Sobre a Norte</span>
              <h2 id="about-title">Menos opções, melhores escolhas.</h2>
              <p>
                A Norte é uma loja fictícia criada como projeto de portfólio. O catálogo
                reúne itens de tecnologia e lifestyle com foco em design, funcionalidade e
                uma experiência de compra simples.
              </p>
              <p>
                Tudo aqui é uma demonstração: carrinho, frete e checkout funcionam no
                navegador, sem processar pagamentos reais.
              </p>
            </div>

            <div className="benefits">
              <article>
                <span aria-hidden="true">🚚</span>
                <h3>Envio rápido</h3>
                <p>Pedidos saem em até 24h úteis.</p>
              </article>
              <article>
                <span aria-hidden="true">↩️</span>
                <h3>Troca fácil</h3>
                <p>7 dias para trocar sem complicação.</p>
              </article>
              <article>
                <span aria-hidden="true">🔒</span>
                <h3>Compra segura</h3>
                <p>Dados e pagamento protegidos.</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contato">
        <div className="container footer-inner">
          <div>
            <a className="logo logo-light" href="#top">
              <span className="logo-mark" aria-hidden="true">N</span>
              <span>Norte<span className="logo-dot">.</span></span>
            </a>
            <p>Design &amp; tecnologia para o dia a dia.</p>
          </div>
          <div className="footer-meta">
            <span>Projeto de demonstração</span>
            <span>Feito com React + Vite</span>
          </div>
        </div>
      </footer>

      {cartOpen && (
        <CartDrawer
          items={cart.items}
          count={cart.count}
          subtotal={cart.subtotal}
          shipping={cart.shipping}
          total={cart.total}
          freeShippingFrom={cart.freeShippingFrom}
          missingForFreeShipping={cart.missingForFreeShipping}
          onClose={() => setCartOpen(false)}
          onIncrease={cart.increase}
          onDecrease={cart.decrease}
          onRemove={cart.remove}
          onCheckout={openCheckout}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          count={cart.count}
          total={cart.total}
          onClose={() => setCheckoutOpen(false)}
          onConfirm={cart.clear}
        />
      )}
    </div>
  );
}
