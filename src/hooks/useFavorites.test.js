import { beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "../test/renderHook";
import { loadFavorites, useFavorites } from "./useFavorites";

const STORAGE_KEY = "norte-store-favorites";
const productId = (id) => id;

beforeEach(() => {
  localStorage.clear();
});

describe("loadFavorites", () => {
  it("retorna lista vazia quando não há dados salvos", () => {
    expect(loadFavorites()).toEqual([]);
  });

  it("ignora JSON inválido", () => {
    localStorage.setItem(STORAGE_KEY, "{não é json");
    expect(loadFavorites()).toEqual([]);
  });

  it("remove ids duplicados e valores inválidos", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([3, 3, "1", null, {}, true]));
    expect(loadFavorites()).toEqual([3, "1"]);
  });
});

describe("useFavorites", () => {
  it("começa vazio e alterna favoritos", () => {
    const { result, act } = renderHook(() => useFavorites());

    expect(result.current.count).toBe(0);
    expect(result.current.isFavorite(1)).toBe(false);

    act(() => result.current.toggle(1));
    expect(result.current.ids).toEqual([1]);
    expect(result.current.count).toBe(1);
    expect(result.current.isFavorite(1)).toBe(true);

    act(() => result.current.toggle(1));
    expect(result.current.ids).toEqual([]);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("mantém múltiplos favoritos na ordem de inclusão", () => {
    const { result, act } = renderHook(() => useFavorites());

    act(() => result.current.toggle(2));
    act(() => result.current.toggle(productId(5)));

    expect(result.current.ids).toEqual([2, 5]);
  });

  it("persiste no localStorage", () => {
    const { result, act } = renderHook(() => useFavorites());

    act(() => result.current.toggle(4));

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([4]);
  });

  it("carrega favoritos salvos na inicialização", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 8]));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.ids).toEqual([1, 8]);
    expect(result.current.count).toBe(2);
    expect(result.current.isFavorite(8)).toBe(true);
  });

  it("remove e limpa favoritos", () => {
    const { result, act } = renderHook(() => useFavorites());

    act(() => result.current.toggle(1));
    act(() => result.current.toggle(2));
    act(() => result.current.remove(1));

    expect(result.current.ids).toEqual([2]);

    act(() => result.current.clear());
    expect(result.current.ids).toEqual([]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
  });
});
