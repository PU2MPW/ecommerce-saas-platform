# Roadmap: E-commerce SaaS Platform

**Granularity:** Fine (8-12 phases, 5-10 plans each)
**Mode:** YOLO (auto-approve)

## Overview

| Phase | Name | Goal | Requirements | Success Criteria |
|-------|------|------|--------------|------------------|
| 1 | Foundation | Setup infraestrutura, auth, multi-tenant | TENT-01, TENT-02, TENT-03, AUTH-01, AUTH-02, AUTH-03, AUTH-04 | 6 |
| 2 | Catalog & Cart | Catálogo produtos + carrinho | CATG-01, CATG-02, CATG-03, CATG-04, CATG-05, CATG-06, CATG-07, CART-01, CART-02, CART-03, CART-04 | 11 |
| 3 | Checkout & Shipping | Checkout + cálculo de frete | CHKT-01, CHKT-02, CHKT-03, CHKT-04, CHKT-05, CHKT-06, CHKT-07, SHPG-01, SHPG-02, SHPG-03 | 10 |
| 4 | Payments - Pix | Integração Pix | PYMT-01 | 1 |
| 5 | Payments - Card/Boleto | Cartão + Boleto + Webhooks | PYMT-02, PYMT-03, PYMT-04, PYMT-05 | 4 |
| 6 | Admin - Products & Orders | Gestão de produtos e pedidos | ADMIN-01, ADMIN-02, ADMIN-03, ADMIN-04, ADMIN-05, ADMIN-06, ADMIN-07, ADMIN-08 | 8 |
| 7 | Admin - Reports & Settings | Relatórios e configurações | ADMIN-09, ADMIN-10, TENT-03 | 3 |
| 8 | Client Area | Área do cliente | CLNT-01, CLNT-02, CLNT-03, CLNT-04, CLNT-05, CLNT-06 | 6 |
| 9 | Legal & LGPD | Conformidade legal | LGPD-01, LGPD-02, LGPD-03, LGPD-04, LGPD-05, LGPD-06, LGPD-07 | 7 |
| 10 | Polish & Deploy | Ajustes finais e deploy | Todos os requisitos | 3 |

---

## Phase 1: Foundation

**Goal:** Setup infraestrutura base, banco de dados, autenticação e sistema multi-tenant.

**Requirements:** TENT-01, TENT-02, TENT-03, AUTH-01, AUTH-02, AUTH-03, AUTH-04

**Success Criteria:**
1. Supabase project configurado com schema completo
2. Row Level Security (RLS) ativo em todas as tabelas
3. Middleware de tenant isolation funcionando
4. Sistema de autenticação completo (cadastro, login, recovery)
5. Sessão persiste entre refreshes
6. Cadastro de lojistas com tenant isolation

---

## Phase 2: Catalog & Cart

**Goal:** Exibir produtos, buscar, filtrar, e gerenciar carrinho de compras.

**Requirements:** CATG-01, CATG-02, CATG-03, CATG-04, CATG-05, CATG-06, CATG-07, CART-01, CART-02, CART-03, CART-04

**Success Criteria:**
1. Lista de produtos carrega do banco com paginação
2. Busca por nome funciona corretamente
3. Filtro por categoria funciona corretamente
4. Página de detalhe do produto mostra todas as informações
5. Upload e exibição de múltiplas imagens por produto
6. Variantes de produto (cor, tamanho) funcionam
7. Avaliações aparecem na página do produto
8. Adicionar ao carrinho funciona
9. Remover do carrinho funciona
10. Alterar quantidade funciona
11. Carrinho persiste entre sessões (localStorage)

---

## Phase 3: Checkout & Shipping

**Goal:** Checkout completo com cálculo de frete e integração com transportadoras.

**Requirements:** CHKT-01, CHKT-02, CHKT-03, CHKT-04, CHKT-05, CHKT-06, CHKT-07, SHPG-01, SHPG-02, SHPG-03

**Success Criteria:**
1. Formulário de endereço com validação
2. Frete calculado automaticamente via API
3. Múltiplas opções de entrega exibidas
4. Revisão do pedido antes do pagamento
5. One-page checkout funcionando
6. Página de sucesso após finalização
7. Página de cancelamento/erro
8. Integração com API de fretes (Correios/Melhor Envio)
9. Prazo de entrega calculado corretamente
10. Múltiplas opções de envio disponíveis

---

## Phase 4: Payments - Pix

**Goal:** Integração com Pix - método de pagamento mais usado no Brasil.

**Requirements:** PYMT-01

**Success Criteria:**
1. QR Code Pix gerado corretamente
2. Dados do recebedor (chave Pix) configuráveis por tenant
3. Redirect para página de pagamento Pix
4. Vencimento do Pix (expira em 24h)

---

## Phase 5: Payments - Card & Boleto

**Goal:** Integração com cartão de crédito e boleto via Mercado Pago.

**Requirements:** PYMT-02, PYMT-03, PYMT-04, PYMT-05

**Success Criteria:**
1. Pagamento com cartão de crédito funciona
2. Parcelamento em até 12x disponível
3. Boleto bancário gerado
4. Webhook processa confirmação de pagamento
5. Status do pedido atualizado automaticamente

---

## Phase 6: Admin - Products & Orders

**Goal:** Painel administrativo para gestão de produtos, pedidos e estoque.

**Requirements:** ADMIN-01, ADMIN-02, ADMIN-03, ADMIN-04, ADMIN-05, ADMIN-06, ADMIN-07, ADMIN-08

**Success Criteria:**
1. Formulário de cadastro de produtos completo
2. Edição de produtos funciona
3. Exclusão de produtos (soft delete)
4. Gestão de categorias funciona
5. Lista de pedidos visível
6. Alteração de status de pedido funciona
7. Controle de estoque atualizado automaticamente
8. Criação e gestão de cupons funciona

---

## Phase 7: Admin - Reports & Settings

**Goal:** Relatórios de vendas e configurações da loja.

**Requirements:** ADMIN-09, ADMIN-10, TENT-03

**Success Criteria:**
1. Configuração de logo e cores da loja
2. Configuração de chave Pix do lojista
3. Dashboard com vendas do período
4. Relatório de pedidos por status
5. Métricas básicas (total vendas, pedidos, ticket médio)

---

## Phase 8: Client Area

**Goal:** Área do cliente para gerenciar perfil, pedidos e endereços.

**Requirements:** CLNT-01, CLNT-02, CLNT-03, CLNT-04, CLNT-05, CLNT-06

**Success Criteria:**
1. Cliente visualiza perfil
2. Cliente edita dados pessoais
3. Histórico de pedidos visível
4. Status detalhado de cada pedido
5. Múltiplos endereços salvos
6. Gestão completa de endereços

---

## Phase 9: Legal & LGPD

**Goal:** Conformidade com LGPD e legislação brasileira de e-commerce.

**Requirements:** LGPD-01, LGPD-02, LGPD-03, LGPD-04, LGPD-05, LGPD-06, LGPD-07

**Success Criteria:**
1. Banner de cookies aparece no primeiro acesso
2. Checkbox de termos no cadastro funciona
3. Política de privacidade completa e acessível
4. Termos de uso completos
5. Política de trocas/devoluções visível
6. Cliente pode solicitar exclusão de dados
7. CPF/CNPJ do lojista visível na loja

---

## Phase 10: Polish & Deploy

**Goal:** Ajustes finais, testes e deploy em produção.

**Requirements:** Todos

**Success Criteria:**
1. Testes E2E passando
2. Deploy em Vercel funcionando
3. Domínio configurado

---

## Coverage Summary

| Metric | Value |
|--------|-------|
| Total Phases | 10 |
| Total Requirements | 53 |
| Requirements Mapped | 53 |
| Unmapped | 0 |

---

*Roadmap created: 2025-05-01*