# Features: E-commerce SaaS Platform

## Table Stakes (OBRIGATÓRIO para competir)

### Autenticação & Cadastro
- Login/Cadastro com email/senha
- Login social (Google, Facebook)
- Recuperação de senha
- Verificação de email

### Catálogo
- Listagem produtos com filtros
- Busca por nome/categoria
- Detalhe do produto
- Imagens múltiplas
- Avaliações estrelas

### Carrinho & Checkout
- Adicionar ao carrinho
- Cupons desconto
- Cálculo automático frete
- Checkout em uma página
- Success/Cancel pages

### Pagamentos BR
- **Pix** - Obrigatório, imediato
- **Cartão crédito** - Parcelado (Mercado Pago)
- **Boleto** - Vencimento 3-5 dias
- **Mercado Pago** - SDK oficial

### Área do Cliente
- Histórico pedidos
- Status pedido (tracking)
- Endereços saved
- Dados pessoais

### Painel Admin (Lojista)
- Cadastro produtos
- Gestão pedidos
- Controle estoque
- Relatórios vendas
- Configurações loja

---

## Diferenciadores (Venda mais)

### Marketing
- Cupons desconto
- Promoções temporárias
- Newsletter
- Share redes sociais
- Programa fidelidade

### Operación
- Preços por variante (cor/tamanho)
- Estoque por SKU
- Baixa automática estoque
- Alertas reposição

### Experience
- Lista desejos
- Comparar produtos
- Visualização rápida (quick view)
- Chat suporte

---

## Anti-Features (NÃO construir agora)

| Feature | Por quê | Quando |
|---------|---------|--------|
| App móvel nativo | Custo 3x+ web | v2 |
| Marketplace multi-vendedor | Complexidade | v3 |
| ERP/integração contábil | Escopo | v2 |
| Programa fidelidade pontos | Manutenção | v2 |
| Blog/SEO avançado | Prioridade | v2 |

---

## Complexidade por Feature

| Feature | Complexidade | Tempo Estimado |
|---------|--------------|----------------|
| Auth | Baixa | 1-2 dias |
| Catálogo | Média | 3-5 dias |
| Carrinho | Baixa | 1-2 dias |
| Checkout + Pix | Alta | 3-5 dias |
| Checkout + Cartão | Alta | 3-5 dias |
| Checkout + Boleto | Média | 2-3 dias |
| Painel Admin | Alta | 5-7 dias |
| Área Cliente | Média | 2-3 dias |
| LGPD | Média | 2-3 dias |
| NF-e | Alta | 5-7 dias |

---

## Order de Build Sugerido

1. Auth + Básico (cadastro, login)
2. Catálogo (listar, detalhar)
3. Carrinho
4. Checkout Pix (mais simples)
5. Checkout cartão/boleto
6. Painel Admin
7. Área Cliente
8. LGPD/Legal
9. Frete + NF-e (se necessário)