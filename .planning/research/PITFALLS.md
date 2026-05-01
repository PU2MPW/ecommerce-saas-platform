# Pitfalls: E-commerce SaaS Platform

## Erros Comuns em E-commerce BR

### 1. Multi-Tenant Data Leak (CRÍTICO)

**Sintoma:** Cliente A vê dados do Cliente B

**Prevenção:**
```sql
-- RLS OBRIGATÓRIO em todas tabelas
CREATE POLICY "Tenant isolation" ON products
  USING (tenant_id = current_tenant_id());

-- Função helper
CREATE FUNCTION current_tenant_id() RETURNS UUID
  AS $$
    SELECT auth.jwt() ->> 'tenant_id'
  $$ LANGUAGE SQL SECURITY DEFINER;
```

**Quando verificar:** Phase 1

---

### 2. Estoque Racing Condition

**Sintoma:** Dois clientes compram último produto simultaneamente

**Prevenção:**
```sql
-- atomic decrement
UPDATE products SET stock = stock - 1
WHERE id = product_id AND stock >= 1
RETURNING *;

-- Se não retornar, falhou (sem estoque)
```

**Quando verificar:** Checkout implementation

---

### 3. Webhook não processado

**Sintoma:** Cliente pagou mas pedido continua "pending"

**Prevenção:**
- Implementar retry logic (3 tentativas)
- Salvar webhook payload para debug
- Monitoramento (Sentry/Datadog)
- Endpoint health check

**Quando verificar:** After checkout

---

### 4. LGPD sem consentimento

**Sintoma:** Multa LGPD (até 2% faturamento)

**Prevenção:**
```javascript
// Banner de cookies
const consent = await db.consents.create({
  user_id: user.id,
  marketing: true,
  analytics: false,
  timestamp: new Date()
});
```

- Política privacidade completa
- Termos de uso
- Modal aceite no cadastro
- Direito de delete (anonymization)

**Quando verificar:** Phase legal

---

### 5. Dados errados no Pix

**Sintoma:** Pix gerado mas não reconhecido pelo banco

**Prevenção:**
```javascript
// Formato correto para QR Code Pix
const pixPayload = {
  chave: tenant.pix_key, // email, CNPJ ou telefone
  valor: order.total,
  nome: tenant.legal_name,
  city: tenant.city,
  txid: order.id // transaction ID único
};
```

**Quando verificar:** Pix integration

---

### 6. Checkout abandonment

**Sintoma:** Usuário entra no checkout mas não completa

**Prevenção:**
-一步one-page checkout
- Progress indicator
- Save cart (localStorage)
- Email recovery (abandoned cart)
-PIX是关键- mais rápido que cartão

**Quando verificar:** UX testing

---

### 7. Imagens não otimizadas

**Sintoma:** Lighthouse < 50, usuário desiste

**Prevenção:**
```typescript
// Next.js automatic optimization
<Image
  src={product.image}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={product.blurHash}
/>
```

**Quando verificar:** Prod listing

---

## Phase Mapping

| Pitfall | Phase addresses |
|---------|----------------|
| Multi-tenant leak | Phase 1 (Foundation) |
| Estoque race | Phase 2 (Checkout) |
| Webhook failure | Phase 3 (Payments) |
| LGPD compliance | Phase 5 (Legal) |
| Pix errors | Phase 2-3 (Payments) |
| Checkout UX | Phase 2-3 |
| Image optimization | Phase 1-2 |

---

## Warnings signs (detectar cedo)

- Sem RLS definido → ⚠️ Erro 1
- Sem testes concurrentes → ⚠️ Erro 2
- Webhook sem logs → ⚠️ Erro 3
- Sem policy page → ⚠️ Erro 4
- Pixkey hardcoded → ⚠️ Erro 5
- Multi-page checkout → ⚠️ Erro 6
- Images > 500KB → ⚠️ Erro 7