# Research Summary: E-commerce SaaS Platform

## Stack Recomendada

- **Frontend:** Next.js 14+ + TypeScript + Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Payments:** Stripe (card) + Mercado Pago (Pix, card, boleto)
- **Hosting:** Vercel (gratuito) + Supabase Free Tier

---

## Table Stakes (v1 Obrigatório)

| Categoria | Features |
|-----------|----------|
| Auth | Login, cadastro, recuperação senha |
| Catálogo | Listagem, busca, detalhes, imagens |
| Carrinho | Add, remover, cupons |
| Checkout | Endereço, cálculo frete, pagamento |
| Pagamentos | Pix, cartão, boleto (Mercado Pago) |
| Admin | Gestão produtos, pedidos, estoque |
| Cliente | Perfil, histórico pedidos, endereços |

---

## Watch Out For

### CRÍTICO - Multi-tenant
- Row Level Security (RLS) em TODAS tabelas
- Middleware de isolamento por tenant_id
- Testar que dado de um tenant não vaza para outro

### Payments BR
- Pix é obrigatório (70%+ transações)
- Mercado Pago SDK tem melhor aceitação que Stripe local
- Webhook precisa retry logic (pagamento async)

### LGPD
- Banner cookies + consentimento explícito
- Política de privacidade completa
- Delete = anonymization (não delete físico)
- Sem consentimento = multa 2% faturamento

### Estoque
- atomic decrement para evitar overselling
- reservation durante checkout (15 min)
- alerta reposição automática

---

## Arquitetura Highlights

- Frontend/Backend separados mas no mesmo repo (Next.js)
- Supabase para tudo: DB + Auth + Storage + Edge Functions
- Multi-tenant via tenant_id em todas tabelas + RLS
- Checkout em uma página (reduce abandonment)
- Fases de build: Foundation → Core → Payments → Admin → Client → Legal

---

## Prox Passos

1. Setup Next.js + Supabase schema + RLS
2. Auth com tenant_id
3. Catálogo + Carrinho
4. Checkout com Pix
5. Checkout cartão/boleto
6. Painel Admin
7. Área Cliente
8. LGPD + Legal

---

*Pesquisa gerada: 2025-05-01*