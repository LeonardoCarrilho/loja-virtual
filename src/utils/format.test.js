import { describe, expect, it } from "vitest";
import { formatBRL } from "./format";

const plain = (value) => value.replace(/\u00a0/g, " ");

describe("formatBRL", () => {
  it("formata valores com centavos", () => {
    expect(plain(formatBRL(349.9))).toBe("R$ 349,90");
  });

  it("usa ponto como separador de milhar", () => {
    expect(plain(formatBRL(1234.5))).toBe("R$ 1.234,50");
  });

  it("formata zero", () => {
    expect(plain(formatBRL(0))).toBe("R$ 0,00");
  });
});
