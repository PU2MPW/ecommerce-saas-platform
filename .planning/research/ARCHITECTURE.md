# Architecture: E-commerce SaaS Platform

## Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│   │  Store  │  │  Admin  │  │  Auth   │  │  Client │  │
│   │  Pages  │  │  Panel  │  │  Flow   │  │  Area   │  │
│   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  │
└────────┼────────────┼────────────┼────────────┼────────┘
         │            │            │            │
         ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────┐
│                   API LAYER (Next.js API)               │
│   ┌─────────────────────────────────────────────────┐  │
│   │  Middleware: Auth, Tenant, Rate Limit          │  │
│   └─────────────────────────────────────────────────┘  │
└────────┬─────────────────┬──────────────────┬─────────┘
         │                 │                  │
         ▼                 ▼                  ▼
┌────────────────┐ ┌────────────────┐ ┌──────────────────┐
│   SUPABASE     │ │  EXTERNAL APIs │ │   EDGE FN        │
│   Database     │ │                │ │   (webhooks)     │
│   - tenants    │ │  - Stripe      │ │                  │
│   - products   │ │  - MP          │ │  - payment       │
│   - orders     │ │  - Shipping    │ │    callbacks     │
│   - users      │ │                 │ │                  │
└────────────────┘ └────────────────┘ └──────────────────┘
```

---

## Component Boundaries

### Multi-Tenant Isolation (CRÍTICO)

```sql
-- Todas tabelas precisam de tenant_id
CREATE TABLE products (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  name TEXT,
  price DECIMAL,
  ...
);

-- RLS: Row Level Security
CREATE POLICY "Tenant isolation" ON products
  USING (tenant_id = current_tenant_id());
```

### Frontend Components

| Área | Componentes |
|------|-------------|
| **Store** | ProductCard, ProductList, ProductDetail, SearchBar, FilterBar |
| **Cart** | CartItem, CartSummary, CouponInput, ShippingCalc |
| **Checkout** | AddressForm, PaymentSelect, OrderSummary, SuccessPage |
| **Admin** | ProductForm, OrderTable, StatsCard, SettingsPanel |
| **Client** | ProfileForm, OrderHistory, AddressBook |

---

## Data Flow

### Compra

```
1. Usuário acessa loja.com/loja1
   → Middleware identifica tenant=loja1
   → Carrega config (logo, cores, produtos)

2. Usuário adiciona produto
   → Carrinho store (Zustand)
   → Persiste no localStorage

3. Checkout → POST /api/orders
   → Valida produtos/estoque
   → Cria pedido com tenant_id
   → Chama Payment Gateway
   → Retorna redirect (Pix) ou iframe (card)

4. Pagamento confirmado
   → Webhook atualiza pedido status=paid
   → Decrementa estoque
   → Email confirmação (Resend/SendGrid)
```

### Pedido Status

```
pending → processing → paid → shipped → delivered
                   ↘→ failed → pending (retry)
```

---

## Build Order (Dependências)

### Fase 1: Foundation
1. Supabase schema + RLS
2. Next.js setup + Tailwind
3. Auth (Supabase Auth)
4. Tenant middleware

### Fase 2: Core Commerce
5. Catálogo CRUD
6. Carrinho (Zustand)
7. Checkout Pix ( Stripe + MP)

### Fase 3: Payments Full
8. Checkout cartão (MP split)
9. Checkout boleto
10. Webhooks handling

### Fase 4: Admin
11. Dashboard stats
12. Gestão pedidos
13. Gestão produtos
14. Configurações loja

### Fase 5: Client Area
15. Perfil usuário
16. Histórico pedidos
17. Endereços

### Fase 6: Legal
18. LGPD consentimento
19. Política privacidade
20. Termos uso
21. Banner cookies

### Fase 7: Frete + NF (opcional)
22. Integração shipping
23. Emissão NF-e