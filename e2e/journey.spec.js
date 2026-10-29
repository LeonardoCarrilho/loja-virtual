import {test,expect} from "@playwright/test";
for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test.describe("jornada em " + viewport.width + "px", () => {
    test.use({ viewport });
test("checkout rejeita dados inválidos e conclui demonstração",async({page})=>{
 await page.goto("./");
 await page.getByRole("button",{name:/Adicionar .* ao carrinho/}).first().click();
 await page.getByRole("button",{name:/Abrir carrinho/}).click();
 await page.getByRole("button",{name:"Finalizar compra"}).click();
 await page.getByRole("button",{name:/Confirmar pedido/}).click();
 await expect(page.getByText("Informe seu nome completo.")).toBeVisible();
 await page.getByLabel("Nome completo").fill("Pessoa Teste");
 await page.getByLabel("E-mail",{exact:true}).fill("pessoa@example.com");
 await page.getByLabel("CEP",{exact:true}).fill("01001-000");
 await page.getByRole("button",{name:/Confirmar pedido/}).click();
 await expect(page.getByText("Pedido confirmado!")).toBeVisible();
});

  });
}
