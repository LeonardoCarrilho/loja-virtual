import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "norte-store-cart";
const FREE_SHIPPING_FROM = 250;
const SHIPPING_PRICE = 19.9;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function stockOf(item) {
  return Number.isFinite(item.stock) && item.stock > 0 ? item.stock : Infinity;
}

function clampQty(qty, stock) {
  return Math.min(qty, stock);
}

export function useCart() {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Armazenamento indisponível (modo privado/quota): o carrinho segue em memória.
    }
  }, [items]);

  const add = (product) => {
    setItems((current) => {
      const exists = current.find((item) => item.id === product.id);

      if (exists) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, qty: clampQty(item.qty + 1, stockOf(item)) }
            : item
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          emoji: product.emoji,
          stock: Number.isFinite(product.stock) ? product.stock : undefined,
          qty: 1,
        },
      ];
    });
  };

  const increase = (id) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, qty: clampQty(item.qty + 1, stockOf(item)) } : item
      )
    );

  const decrease = (id) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
    );

  const remove = (id) => setItems((current) => current.filter((item) => item.id !== id));

  const clear = () => setItems([]);

  const summary = useMemo(() => {
    const count = items.reduce((total, item) => total + item.qty, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
    const shipping =
      items.length === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_PRICE;

    return {
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      freeShippingFrom: FREE_SHIPPING_FROM,
      missingForFreeShipping: Math.max(0, FREE_SHIPPING_FROM - subtotal),
    };
  }, [items]);

  return { items, add, increase, decrease, remove, clear, ...summary };
}
