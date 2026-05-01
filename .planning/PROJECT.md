# E-commerce SaaS Platform

## What This Is

Plataforma de e-commerce multi-tenant completa para o mercado brasileiro. Permite que múltiplos lojistas criem suas próprias lojas virtuais para vender roupas e eletrônicos, com gestão completa de catálogo, pedidos, estoque, pagamentos e clientes.

## Core Value

Plataforma de e-commerce que permite lojistas brasileiros iniciarem sua loja virtual rapidamente com total conformidade legal (LGPD, CDC, legislação tributária), sem necessidade de conhecimento técnico.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Cadastro e autenticação de lojistas (multi-tenant)
- [ ] Gestão de catálogo de produtos (roupas e eletrônicos)
- [ ] Upload de imagens de produtos
- [ ] Categorias e atributos de produtos
- [ ] Controle de estoque
- [ ] Carrinho de compras
- [ ] Checkout com múltiplas formas de pagamento (Pix, cartão, boleto, Mercado Pago)
- [ ] Gestão de pedidos
- [ ] Área do cliente (histórico de pedidos)
- [ ] Painel administrativo do lojista
- [ ] Conformidade LGPD (política de privacidade, termos, consentimento)
- [ ] Conformidade CDC brasileiro (política de trocas, informações legais)
- [ ] Cálculo de frete (Correios/integração)
- [ ] Emissão de notas fiscais

### Out of Scope

- [App móvel nativo] — Prioridade web primeiro
- [Marketplace] — Uma loja por instância
- [ERP externo] — Gestão interna apenas

## Context

- **Mercado:** E-commerce brasileiro em crescimento, demanda por soluções acessíveis
- **Competidores:** Shopify, Tray, VTEX (caros ou Complexos)
- **Diferencial:** Solução open source, hospedagem gratuita, multi-tenant nativo
- **Technical:** Stack gratuita (Next.js + Supabase + Vercel)

## Constraints

- **Hospedagem:** Deve rodar em hosting gratuito (Vercel + Supabase)
- **Multi-tenant:** Cada cliente tem dados isolados (tenant_id)
- **Legal BR:** LGPD, CDC, nota fiscal eletrônica, impostos brasileiros
- **Payments:** Pix, cartão, boleto, Mercado Pago (sdk pública)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js + Supabase | Stack moderna, gratuito até limitesgenerosos, fácil deploy | — Pending |
| Multi-tenant por tenant_id | Isolation de dados por cliente | — Pending |
| Stripe + Mercado Pago | APIs públicas, test mode gratuito | — Pending |
| Conformidade LGPD nativa | Obrigatório para mercado brasileiro | — Pending |

---

*Last updated: 2025-05-01 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state