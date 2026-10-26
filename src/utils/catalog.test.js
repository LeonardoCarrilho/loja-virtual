import { describe, expect, it } from "vitest";
import {
  ALL_CATEGORIES,
  DEFAULT_FILTERS,
  filterProducts,
  getPriceBounds,
  hasActiveFilters,
  normalizePriceRange,
  selectProducts,
  sortProducts,
} from "./catalog";

const products = [
  {
    id: 1,
    name: "Fone Bluetooth",
    category: "Áudio",
    price: 349.9,
    rating: 4.9,
    description: "Cancelamento de ruído",
  },
  {
    id: 2,
    name: "Smartwatch Pulse",
    category: "Tecnologia",
    price: 499,
    rating: 4.8,
    description: "Monitor de sono",
  },
  {
    id: 3,
    name: "Mouse Sem Fio",
    category: "Setup",
    price: 189.9,
    rating: 4.6,
    description: "Design ergonômico",
  },
  {
    id: 4,
    name: "Luminária de Mesa",
    category: "Casa",
    price: 179.9,
    rating: 4.7,
    description: "Luz quente",
  },
];

const ids = (list) => list.map((item) => item.id);

describe("filterProducts", () => {
  it("filtra por termo de busca em nome, descrição e categoria", () => {
    expect(ids(filterProducts(products, { query: "fone" }))).toEqual([1]);
    expect(ids(filterProducts(products, { query: "ergonômico" }))).toEqual([3]);
    expect(ids(filterProducts(products, { query: "setup" }))).toEqual([3]);
  });

  it("filtra por categoria", () => {
    expect(ids(filterProducts(products, { category: "Setup" }))).toEqual([3]);
    expect(ids(filterProducts(products, { category: ALL_CATEGORIES }))).toEqual([1, 2, 3, 4]);
  });

  it("filtra somente favoritos", () => {
    expect(
      ids(filterProducts(products, { onlyFavorites: true, favoriteIds: [2, 4] }))
    ).toEqual([2, 4]);
  });

  it("combina busca, categoria e favoritos", () => {
    expect(
      ids(
        filterProducts(products, {
          query: "sem fio",
          category: "Setup",
          onlyFavorites: true,
          favoriteIds: [3, 1],
        })
      )
    ).toEqual([3]);
  });

  it("filtra por faixa de preço", () => {
    expect(ids(filterProducts(products, { minPrice: 180, maxPrice: 360 }))).toEqual([1, 3]);
    expect(ids(filterProducts(products, { minPrice: 300 }))).toEqual([1, 2]);
  });

  it("retorna lista vazia quando nada corresponde", () => {
    expect(filterProducts(products, { query: "inexistente" })).toEqual([]);
    expect(filterProducts([], { query: "fone" })).toEqual([]);
  });
});

describe("sortProducts", () => {
  it("mantém a ordem original em relevância", () => {
    expect(ids(sortProducts(products, "relevance"))).toEqual([1, 2, 3, 4]);
  });

  it("ordena por menor e maior preço", () => {
    expect(ids(sortProducts(products, "price-asc"))).toEqual([4, 3, 1, 2]);
    expect(ids(sortProducts(products, "price-desc"))).toEqual([2, 1, 3, 4]);
  });

  it("ordena por nome A-Z considerando acentos", () => {
    expect(ids(sortProducts(products, "name-asc"))).toEqual([1, 4, 3, 2]);
  });

  it("ordena por avaliação", () => {
    expect(ids(sortProducts(products, "rating"))).toEqual([1, 2, 4, 3]);
  });

  it("não altera a lista original", () => {
    const original = [...products];
    sortProducts(products, "price-asc");
    expect(products).toEqual(original);
  });
});

describe("selectProducts", () => {
  it("aplica filtros antes da ordenação", () => {
    expect(
      ids(
        selectProducts(products, {
          category: "Setup",
          sort: "price-asc",
        })
      )
    ).toEqual([3]);
  });

  it("combina busca, faixa de preço e ordenação", () => {
    expect(
      ids(
        selectProducts(products, {
          minPrice: 180,
          maxPrice: 400,
          sort: "price-desc",
        })
      )
    ).toEqual([1, 3]);
  });
});

describe("getPriceBounds", () => {
  it("arredonda a faixa para múltiplos de 50", () => {
    expect(getPriceBounds(products)).toEqual({ min: 150, max: 500, step: 50 });
  });

  it("trata catálogo vazio", () => {
    expect(getPriceBounds([])).toEqual({ min: 0, max: 0, step: 50 });
  });
});

describe("normalizePriceRange", () => {
  it("usa os limites do catálogo quando não há valor", () => {
    expect(normalizePriceRange(products, {})).toEqual({ min: 150, max: 500 });
  });

  it("limita valores fora da faixa", () => {
    expect(normalizePriceRange(products, { minPrice: 0, maxPrice: 9999 })).toEqual({
      min: 150,
      max: 500,
    });
  });

  it("inverte valores quando o mínimo é maior que o máximo", () => {
    expect(normalizePriceRange(products, { minPrice: 400, maxPrice: 200 })).toEqual({
      min: 200,
      max: 400,
    });
  });
});

describe("hasActiveFilters", () => {
  it("detecta filtros padrão", () => {
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false);
  });

  it("detecta cada tipo de filtro ativo", () => {
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, query: "fone" })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, category: "Setup" })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, sort: "price-asc" })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, onlyFavorites: true })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, maxPrice: 300 })).toBe(true);
  });
});
