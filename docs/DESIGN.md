# Direção visual

A Norte usa Hanken Grotesk e uma paleta cinza com vinho. Fotografias dos produtos abrem o catálogo; o mesmo sistema aparece nos filtros, favoritos, carrinho e checkout. Nomes, preços, estoque e regras do catálogo permanecem nos dados existentes.

`src/styles.css` reúne os estilos ativos. A antiga camada `editorial.css` não é importada, evitando regras concorrentes. Preserve a largura de conteúdo, controles de pelo menos 44 px, texto legível e foco visível. O catálogo cresce conforme filtros e quantidade de produtos; não use altura fixa que corte cartões.

As oito imagens Unsplash já usadas no projeto estão em `public/products`. São fotografias de referência do catálogo fictício. O checkout continua local e demonstrativo, sem cobrança. Os limites de entrada e a CSP da branch de segurança permanecem ativos.

Antes de publicar, execute lint, cobertura, build e Playwright. Confira busca sem resultados, favoritos, carrinho vazio e preenchido, quantidades, erros de formulário e confirmação, em desktop e celular. Capturas e limitações do gate ficam em `.taste-skill`. O trabalho continua no PR #4 e na issue #6; não foi publicado.
