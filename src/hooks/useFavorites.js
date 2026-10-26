import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "norte-store-favorites";

export function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];

    return [...new Set(saved.filter((id) => typeof id === "number" || typeof id === "string"))];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Armazenamento indisponível (modo privado/quota): favoritos seguem em memória.
    }
  }, [ids]);

  const favoriteIds = useMemo(() => new Set(ids), [ids]);

  const toggle = useCallback((id) => {
    setIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }, []);

  const remove = useCallback((id) => {
    setIds((current) => current.filter((item) => item !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const isFavorite = useCallback((id) => favoriteIds.has(id), [favoriteIds]);

  return {
    ids,
    favoriteIds,
    count: ids.length,
    isFavorite,
    toggle,
    remove,
    clear,
  };
}
