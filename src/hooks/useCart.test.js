import { beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "../test/renderHook";
import { useCart } from "./useCart";

const STORAGE_KEY = "norte-store-cart";

const product = {
  id: 1,
  name: "Fone Bluetooth",
  price: 100,
  stock: 2,
  image: "fone.jpg",
  emoji: "🎧",
};

beforeEach(() => {
  localStorage.clear();
});

describe("useCart", () => {
  it("adiciona um produto novo", () => {
    const { result, act } = renderHook(() => useCart());

    act(() => result.current.add(product));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({ id: 1, qty: 1, price: 100 });
    expect(result.current.count).toBe(1);
  });

  it("incrementa a quantidade ao adicionar o mesmo produto", () => {
    const { result, act } = renderHook(() => useCart());

    act(() => result.current.add(product));
    act(() => result.current.add(product));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].qty).toBe(2);
    expect(result.current.count).toBe(2);
  });

  it("respeita o limite de estoque ao adicionar", () => {
    const { result, act } = renderHook(() => useCart());

    act(() => result.current.add(product));
    act(() => result.current.add(product));
    act(() => result.current.add(product));

    expect(result.current.items[0].qty).toBe(2);
    expect(result.current.count).toBe(2);
  });

  it("respeita o limite de estoque ao aumentar", () => {
    const { result, act } = renderHook(() => useCart());

    act(() => result.current.add(product));
    act(() => result.current.increase(1));
    act(() => result.current.increase(1));

    expect(result.current.items[0].qty).toBe(2);
  });

  it("diminui a quantidade sem passar de 1", () => {
    const { result, act } = renderHook(() => useCart());

    act(() => result.current.add(product));
    act(() => result.current.add(product));
    act(() => result.current.decrease(1));
    act(() => result.current.decrease(1));

    expect(result.current.items[0].qty).toBe(1);
  });

  it("remove itens e limpa o carrinho", () => {
    const other = { ...product, id: 2, name: "Mouse", price: 50 };

    const { result, act } = renderHook(() => useCart());

    act(() => result.current.add(product));
    act(() => result.current.add(other));
    act(() => result.current.remove(1));

    expect(result.current.items).toEqual([expect.objectContaining({ id: 2 })]);

    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it("calcula subtotal, frete e total abaixo do frete grátis", () => {
    const { result, act } = renderHook(() => useCart());

    act(() => result.current.add(product));

    expect(result.current.subtotal).toBe(100);
    expect(result.current.shipping).toBe(19.9);
    expect(result.current.total).toBe(119.9);
    expect(result.current.missingForFreeShipping).toBe(150);
  });

  it("zera o frete ao atingir o valor mínimo", () => {
    const { result, act } = renderHook(() => useCart());
    const freeShippingProduct = { ...product, id: 3, price: 260, stock: 3 };

    act(() => result.current.add(freeShippingProduct));

    expect(result.current.subtotal).toBe(260);
    expect(result.current.shipping).toBe(0);
    expect(result.current.total).toBe(260);
    expect(result.current.missingForFreeShipping).toBe(0);
  });

  it("não cobra frete com carrinho vazio", () => {
    const { result } = renderHook(() => useCart());

    expect(result.current).toMatchObject({ count: 0, subtotal: 0, shipping: 0, total: 0 });
  });

  it("persiste o carrinho no localStorage", () => {
    const { result, act } = renderHook(() => useCart());

    act(() => result.current.add(product));

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([
      expect.objectContaining({ id: 1, qty: 1 }),
    ]);
  });

  it("carrega o carrinho salvo na inicialização", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...product, stock: 5, qty: 3 }])
    );

    const { result } = renderHook(() => useCart());

    expect(result.current.count).toBe(3);
    expect(result.current.subtotal).toBe(300);
  });
});
