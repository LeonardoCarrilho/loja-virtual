# Norte Store — Loja Virtual

Repositório: [github.com/LeonardoCarrilho/loja-virtual](https://github.com/LeonardoCarrilho/loja-virtual)

Loja virtual responsiva feita com **React + Vite**, com catálogo, busca, filtros, carrinho persistente e checkout de demonstração.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-16a34a)

## Funcionalidades

- Catálogo com 8 produtos e imagens
- Busca por nome, descrição ou categoria
- Filtro por categoria e ordenação por preço/avaliação
- Carrinho lateral com quantidade, remoção e subtotal
- Persistência do carrinho no `localStorage`
- Cálculo de frete grátis acima de R$ 250
- Checkout com validação de nome, e-mail e CEP
- Confirmação de pedido com código gerado
- Layout responsivo (desktop, tablet e celular)

> **Atenção:** este é um projeto de demonstração. Nenhum pagamento é processado e nenhum dado é enviado para um servidor.

## Como rodar

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
├── components/
│   ├── Header.jsx
│   ├── ProductCard.jsx
│   ├── CartDrawer.jsx
│   └── CheckoutModal.jsx
├── data/
│   └── products.js       # catálogo e formatação de preço
├── hooks/
│   └── useCart.js        # carrinho + localStorage
├── App.jsx
├── main.jsx
└── styles.css
```

## Personalizando

- **Produtos:** edite `src/data/products.js` (nome, preço, categoria, imagem, descrição).
- **Frete grátis:** ajuste `FREE_SHIPPING_FROM` e `SHIPPING_PRICE` em `src/hooks/useCart.js`.
- **Cores e fontes:** edite as variáveis no topo de `src/styles.css`.
- **Imagens:** as URLs atuais são do Unsplash. Se uma imagem falhar, o card mostra automaticamente um fundo com emoji.

## Deploy

Projeto estático, pronto para Vercel, Netlify ou GitHub Pages:

- **Build command:** `npm run build`
- **Output directory:** `dist`

## Licença

MIT — use livremente para estudos e portfólio.
