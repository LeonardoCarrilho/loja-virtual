import { act, createElement } from "react";
import { createRoot } from "react-dom/client";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Renderiza um hook sem depender de bibliotecas de teste de UI.
 * Retorna a referência atual do hook e helpers de act/unmount.
 */
export function renderHook(hook) {
  const container = document.createElement("div");
  const root = createRoot(container);
  const result = { current: null };

  function TestComponent() {
    result.current = hook();
    return null;
  }

  act(() => {
    root.render(createElement(TestComponent));
  });

  return {
    result,
    act: (callback) => act(callback),
    rerender: () =>
      act(() => {
        root.render(createElement(TestComponent));
      }),
    unmount: () =>
      act(() => {
        root.unmount();
      }),
  };
}
