export const ALL_CATEGORIES = "Todos";

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevância" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "name-asc", label: "Nome A-Z" },
  { value: "rating", label: "Melhor avaliação" },
];

export const DEFAULT_FILTERS = {
  query: "",
  category: ALL_CATEGORIES,
  sort: "relevance",
  onlyFavorites: false,
  minPrice: null,
  maxPrice: null,
};

const PRICE_STEP = 50;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function getPriceBounds(products = []) {
  if (products.length === 0) return { min: 0, max: 0, step: PRICE_STEP };

  const prices = products.map((product) => product.price);

  return {
    min: Math.floor(Math.min(...prices) / PRICE_STEP) * PRICE_STEP,
    max: Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP,
    step: PRICE_STEP,
  };
}

/**
 * Converte os limites informados no estado para valores válidos do catálogo
 * (dentro da faixa e com mínimo menor ou igual ao máximo).
 */
export function normalizePriceRange(products, { minPrice, maxPrice } = {}) {
  const bounds = getPriceBounds(products);
  const lower = clamp(
    Number.isFinite(minPrice) ? minPrice : bounds.min,
    bounds.min,
    bounds.max
  );
  const upper = clamp(
    Number.isFinite(maxPrice) ? maxPrice : bounds.max,
    bounds.min,
    bounds.max
  );

  return lower <= upper
    ? { min: lower, max: upper }
    : { min: upper, max: lower };
}

export function filterProducts(products, filters = {}) {
  const {
    query = "",
    category = ALL_CATEGORIES,
    onlyFavorites = false,
    favoriteIds = [],
    minPrice,
    maxPrice,
  } = filters;

  const term = query.trim().toLowerCase();
  const favorites = new Set(favoriteIds);
  const { min, max } = normalizePriceRange(products, { minPrice, maxPrice });

  return products.filter((product) => {
    if (category !== ALL_CATEGORIES && product.category !== category) return false;
    if (onlyFavorites && !favorites.has(product.id)) return false;
    if (product.price < min || product.price > max) return false;
    if (!term) return true;

    return `${product.name} ${product.description} ${product.category}`
      .toLowerCase()
      .includes(term);
  });
}

export function sortProducts(products, sort = "relevance") {
  const list = [...products];

  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name, "pt-BR"));
    case "price-desc":
      return list.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name, "pt-BR"));
    case "name-asc":
      return list.sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
      );
    case "rating":
      return list.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name, "pt-BR"));
    default:
      return list;
  }
}

export function selectProducts(products, filters = {}) {
  return sortProducts(filterProducts(products, filters), filters.sort);
}

export function hasActiveFilters(filters = {}) {
  const {
    query = "",
    category = ALL_CATEGORIES,
    sort = "relevance",
    onlyFavorites = false,
    minPrice,
    maxPrice,
  } = filters;

  return Boolean(
    query.trim() ||
      category !== ALL_CATEGORIES ||
      sort !== "relevance" ||
      onlyFavorites ||
      Number.isFinite(minPrice) ||
      Number.isFinite(maxPrice)
  );
}
