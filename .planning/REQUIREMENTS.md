# Requirements: E-commerce SaaS Platform

**Defined:** 2025-05-01
**Core Value:** Plataforma de e-commerce que permite lojistas brasileiros iniciarem sua loja virtual rapidamente com total conformidade legal (LGPD, CDC), sem necessidade de conhecimento técnico.

## v1 Requirements

### Autenticação (AUTH)

- [ ] **AUTH-01**: Usuário pode se cadastrar com email e senha
- [ ] **AUTH-02**: Usuário pode fazer login
- [ ] **AUTH-03**: Usuário pode recuperar senha via email
- [ ] **AUTH-04**: Sessão persiste entre refreshes
- [ ] **AUTH-05**: Lojista pode criar conta multi-tenant

### Catálogo (CATG)

- [ ] **CATG-01**: Usuário pode ver lista de produtos
- [ ] **CATG-02**: Usuário pode buscar produtos por nome
- [ ] **CATG-03**: Usuário pode filtrar por categoria
- [ ] **CATG-04**: Usuário pode ver detalhe do produto
- [ ] **CATG-05**: Produto pode ter múltiplas imagens
- [ ] **CATG-06**: Produto pode ter variantes (cor, tamanho)
- [ ] **CATG-07**: Usuário pode ver avaliações do produto

### Carrinho (CART)

- [ ] **CART-01**: Usuário pode adicionar produto ao carrinho
- [ ] **CART-02**: Usuário pode remover produto do carrinho
- [ ] **CART-03**: Usuário pode alterar quantidade
- [ ] **CART-04**: Carrinho persiste entre sessões
- [ ] **CART-05**: Usuário pode aplicar cupom de desconto

### Checkout (CHKT)

- [ ] **CHKT-01**: Usuário pode inserir endereço de entrega
- [ ] **CHKT-02**: Sistema calcula frete automaticamente
- [ ] **CHKT-03**: Usuário pode selecionar forma de entrega
- [ ] **CHKT-04**: Usuário pode revisar pedido antes de pagar
- [ ] **CHKT-05**: Checkout em uma página (one-page checkout)
- [ ] **CHKT-06**: Página de sucesso após pagamento
- [ ] **CHKT-07**: Página de cancelamento/erro

### Pagamentos (PYMT)

- [ ] **PYMT-01**: Usuário pode pagar via Pix (obrigatório BR)
- [ ] **PYMT-02**: Usuário pode pagar via cartão de crédito
- [ ] **PYMT-03**: Usuário pode pagar via boleto bancário
- [ ] **PYMT-04**: Parcelamento em até 12x no cartão
- [ ] **PYMT-05**: Webhook processa confirmação de pagamento
- [ ] **PYMT-06**: Pagamento divide entre lojista e plataforma (marketplace)

### Área do Cliente (CLNT)

- [ ] **CLNT-01**: Cliente pode visualizar perfil
- [ ] **CLNT-02**: Cliente pode editar dados pessoais
- [ ] **CLNT-03**: Cliente pode ver histórico de pedidos
- [ ] **CLNT-04**: Cliente pode ver status de cada pedido
- [ ] **CLNT-05**: Cliente pode salvar múltiplos endereços
- [ ] **CLNT-06**: Cliente pode gerenciar endereços

### Painel Admin (ADMIN)

- [ ] **ADMIN-01**: Lojista pode cadastrar produtos
- [ ] **ADMIN-02**: Lojista pode editar produtos
- [ ] **ADMIN-03**: Lojista pode excluir produtos
- [ ] **ADMIN-04**: Lojista pode gestionar categorias
- [ ] **ADMIN-05**: Lojista pode ver lista de pedidos
- [ ] **ADMIN-06**: Lojista pode alterar status de pedido
- [ ] **ADMIN-07**: Lojista pode gestionar estoque
- [ ] **ADMIN-08**: Lojista pode criar cupons de desconto
- [ ] **ADMIN-09**: Lojista pode configurar dados da loja (logo, cores)
- [ ] **ADMIN-10**: Lojista pode ver relatórios básicos de vendas

### Legal/LGPD (LGPD)

- [ ] **LGPD-01**: Banner de cookies no primeiro acesso
- [ ] **LGPD-02**: Checkbox de aceite de termos no cadastro
- [ ] **LGPD-03**: Política de privacidade completa
- [ ] **LGPD-04**: Termos de uso completos
- [ ] **LGPD-05**: Política de trocas e devoluções
- [ ] **LGPD-06**: Cliente pode solicitar exclusão de dados
- [ ] **LGPD-07**: CPF/CNPJ do lojista visível na loja

### Frete (SHPG)

- [ ] **SHPG-01**: Integração com API de fretes (Correios/Melhor Envio)
- [ ] **SHPG-02**: Cálculo de prazo de entrega
- [ ] **SHPG-03**: Multiple opções de entrega (PAC, SEDEX, etc)

### Multi-Tenant (TENT)

- [ ] **TENT-01**: Isolamento de dados por tenant (RLS)
- [ ] **TENT-02**: Middleware identifica tenant via subdomínio ou path
- [ ] **TENT-03**: Cada lojista tem configurações独立 (logo, cores, pix key)

## v2 Requirements

- **NF-E**: Emissão de nota fiscal eletrônica
- **ERP**: Integração com sistemas contábeis
- **App Móvel**: Aplicativo nativo (iOS/Android)
- **Marketplace**: Múltiplos vendedores na mesma instância
- **Blog**: Conteúdo e SEO
- **Programa Fidelidade**: Pontos e recompensas

## Out of Scope

| Feature | Reason |
|---------|--------|
| App móvel nativo | Custo alto, web responsive suficiente |
| Marketplace multi-vendedor | Complexidade técnica muito alta |
| Integração ERP | Escopo muito amplo para v1 |
| Blog/SEO avançado | Prioridade secundária |
| Programa fidelidade | Manutenção complexa |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| CATG-01 | Phase 2 | Pending |
| CATG-02 | Phase 2 | Pending |
| CATG-03 | Phase 2 | Pending |
| CATG-04 | Phase 2 | Pending |
| CATG-05 | Phase 2 | Pending |
| CATG-06 | Phase 2 | Pending |
| CATG-07 | Phase 2 | Pending |
| CART-01 | Phase 2 | Pending |
| CART-02 | Phase 2 | Pending |
| CART-03 | Phase 2 | Pending |
| CART-04 | Phase 2 | Pending |
| CART-05 | Phase 3 | Pending |
| CHKT-01 | Phase 3 | Pending |
| CHKT-02 | Phase 3 | Pending |
| CHKT-03 | Phase 3 | Pending |
| CHKT-04 | Phase 3 | Pending |
| CHKT-05 | Phase 3 | Pending |
| CHKT-06 | Phase 3 | Pending |
| CHKT-07 | Phase 3 | Pending |
| PYMT-01 | Phase 3 | Pending |
| PYMT-02 | Phase 3 | Pending |
| PYMT-03 | Phase 3 | Pending |
| PYMT-04 | Phase 4 | Pending |
| PYMT-05 | Phase 4 | Pending |
| PYMT-06 | Phase 4 | Pending |
| CLNT-01 | Phase 5 | Pending |
| CLNT-02 | Phase 5 | Pending |
| CLNT-03 | Phase 5 | Pending |
| CLNT-04 | Phase 5 | Pending |
| CLNT-05 | Phase 5 | Pending |
| CLNT-06 | Phase 5 | Pending |
| ADMIN-01 | Phase 6 | Pending |
| ADMIN-02 | Phase 6 | Pending |
| ADMIN-03 | Phase 6 | Pending |
| ADMIN-04 | Phase 6 | Pending |
| ADMIN-05 | Phase 6 | Pending |
| ADMIN-06 | Phase 6 | Pending |
| ADMIN-07 | Phase 6 | Pending |
| ADMIN-08 | Phase 6 | Pending |
| ADMIN-09 | Phase 6 | Pending |
| ADMIN-10 | Phase 7 | Pending |
| LGPD-01 | Phase 8 | Pending |
| LGPD-02 | Phase 8 | Pending |
| LGPD-03 | Phase 8 | Pending |
| LGPD-04 | Phase 8 | Pending |
| LGPD-05 | Phase 8 | Pending |
| LGPD-06 | Phase 8 | Pending |
| LGPD-07 | Phase 8 | Pending |
| SHPG-01 | Phase 3 | Pending |
| SHPG-02 | Phase 3 | Pending |
| SHPG-03 | Phase 3 | Pending |
| TENT-01 | Phase 1 | Pending |
| TENT-02 | Phase 1 | Pending |
| TENT-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 53 total
- Mapped to phases: 53
- Unmapped: 0 ✓

---

*Requirements defined: 2025-05-01*
*Last updated: 2025-05-01 after initial definition*