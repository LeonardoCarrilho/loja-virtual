// Catálogo de demonstração. Troque por uma API quando quiser dados reais.
// As imagens vêm do Unsplash; se falharem, o card mostra um fundo com emoji.

export const products = [
  {
    id: 1,
    name: "Fone Bluetooth Studio",
    category: "Áudio",
    price: 349.9,
    oldPrice: 429.9,
    emoji: "🎧",
    tag: "Mais vendido",
    rating: 4.9,
    stock: 12,
    description: "Cancelamento de ruído e até 30h de bateria.",
    image:
      `${import.meta.env.BASE_URL}products/1.jpg`,
  },
  {
    id: 2,
    name: "Smartwatch Pulse",
    category: "Tecnologia",
    price: 499.0,
    emoji: "⌚",
    tag: "Novo",
    rating: 4.8,
    stock: 8,
    description: "Monitor de sono, treinos e notificações no pulso.",
    image:
      `${import.meta.env.BASE_URL}products/2.jpg`,
  },
  {
    id: 3,
    name: "Teclado Mecânico 65%",
    category: "Setup",
    price: 489.0,
    oldPrice: 549.0,
    emoji: "⌨️",
    rating: 4.7,
    stock: 6,
    description: "Switches lineares, hot-swap e cabo USB-C.",
    image:
      `${import.meta.env.BASE_URL}products/3.jpg`,
  },
  {
    id: 4,
    name: "Mouse Sem Fio Slim",
    category: "Setup",
    price: 189.9,
    emoji: "🖱️",
    tag: "Oferta",
    rating: 4.6,
    stock: 20,
    description: "Design ergonômico, silencioso e recarregável.",
    image:
      `${import.meta.env.BASE_URL}products/4.jpg`,
  },
  {
    id: 5,
    name: "Mochila Urbana 20L",
    category: "Acessórios",
    price: 259.9,
    emoji: "🎒",
    rating: 4.8,
    stock: 9,
    description: "Compartimento para notebook de até 15,6\".",
    image:
      `${import.meta.env.BASE_URL}products/5.jpg`,
  },
  {
    id: 6,
    name: "Caixa de Som Mini",
    category: "Áudio",
    price: 229.0,
    emoji: "🔊",
    rating: 4.5,
    stock: 14,
    description: "Som 360°, resistente à água e 12h de bateria.",
    image:
      `${import.meta.env.BASE_URL}products/6.jpg`,
  },
  {
    id: 7,
    name: "Luminária de Mesa",
    category: "Casa",
    price: 179.9,
    emoji: "💡",
    tag: "Novo",
    rating: 4.7,
    stock: 10,
    description: "Luz quente regulável e base minimalista.",
    image:
      `${import.meta.env.BASE_URL}products/7.jpg`,
  },
  {
    id: 8,
    name: "Óculos de Sol Norte",
    category: "Acessórios",
    price: 149.9,
    oldPrice: 199.9,
    emoji: "🕶️",
    rating: 4.4,
    stock: 16,
    description: "Proteção UV400 com armação leve.",
    image:
      `${import.meta.env.BASE_URL}products/8.jpg`,
  },
];

export const categories = ["Todos", ...new Set(products.map((item) => item.category))];

export { formatBRL } from "../utils/format";
