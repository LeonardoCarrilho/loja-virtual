import { useMemo, useState } from "react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import { categories, products } from "./data/products";
import { useCart } from "./hooks/useCart";

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
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("relevance");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const cart = useCart();

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = products.filter((product) => {
      const matchesCategory = category === "Todos" || product.category === category;
      const matchesTerm =
        !term ||
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(term);
      return matchesCategory && matchesTerm;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [query, category, sort]);

  const openCart = () => setCartOpen(true);
  const openCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("Todos");
    setSort("relevance");
  };

  return (
    <div id="top">
      <div className="announcement">
        Frete grátis em pedidos acima de R$ 250 · Troca fácil em 7 dias
      </div>

      <Header count={cart.count} onOpenCart={openCart} />

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
              <span className="results-count">
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1 ? "produto" : "produtos"}
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
                  <option value="relevance">Relevância</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="rating">Melhor avaliação</option>
                </select>
              </div>
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
                <span aria-hidden="true">🔎</span>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente outro termo ou remova os filtros.</p>
                <button type="button" className="button" onClick={clearFilters}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={cart.add} />
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
