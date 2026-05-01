# UI-SPEC.md - Phase 1: Foundation

**Phase:** 1 - Foundation
**Created:** 2025-05-01
**Mode:** YOLO (auto-approved)

---

## 1. Design System Overview

Este UI-SPEC define o Design System completo que será usado em todas as fases do projeto. Como a Fase 1 é Foundation (infraestrutura + auth), este documento estabelece as bases visuais e de interação para as fases subsequentes.

---

## 2. Visual Design

### 2.1 Color Palette

**Cores Primárias:**
```css
--color-primary: #2563eb;        /* Blue 600 - Principal */
--color-primary-hover: #1d4ed8; /* Blue 700 - Hover */
--color-primary-light: #dbeafe; /* Blue 100 - Background light */
```

**Cores Secundárias:**
```css
--color-secondary: #64748b;      /* Slate 500 - Secondary text */
--color-secondary-hover: #475569; /* Slate 600 - Hover */
```

**Cores de Status:**
```css
--color-success: #16a34a;        /* Green 600 - Sucesso */
--color-success-light: #dcfce7; /* Green 100 - BG success */
--color-warning: #d97706;       /* Amber 600 - Alerta */
--color-warning-light: #fef3c7; /* Amber 100 - BG warning */
--color-error: #dc2626;         /* Red 600 - Erro */
--color-error-light: #fee2e2;   /* Red 100 - BG error */
--color-info: #0891b2;          /* Cyan 600 - Info */
--color-info-light: #cffafe;    /* Cyan 100 - BG info */
```

**Cores Neutras:**
```css
--color-white: #ffffff;
--color-gray-50: #f8fafc;
--color-gray-100: #f1f5f9;
--color-gray-200: #e2e8f0;
--color-gray-300: #cbd5e1;
--color-gray-400: #94a3b8;
--color-gray-500: #64748b;
--color-gray-600: #475569;
--color-gray-700: #334155;
--color-gray-800: #1e293b;
--color-gray-900: #0f172a;
--color-black: #000000;
```

**Cores do Tema (Customizável por Tenant):**
```css
--color-brand: var(--color-primary);
--color-brand-hover: var(--color-primary-hover);
--color-brand-light: var(--color-primary-light);
```

---

### 2.2 Typography

**Font Family:**
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Font Sizes (Escala baseada em 4px):**
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

**Font Weights:**
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

**Line Heights:**
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

---

### 2.3 Spacing System

**Escala baseada em 4px:**
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

### 2.4 Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;
```

---

### 2.5 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

---

## 3. Component Library

### 3.1 Buttons

**Primary Button:**
```tsx
<Button variant="primary" size="md">
  Texto do botão
</Button>
// Classes: bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700
```

**Secondary Button:**
```tsx
<Button variant="secondary" size="md">
  Texto do botão
</Button>
// Classes: bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200
```

**Outline Button:**
```tsx
<Button variant="outline" size="md">
  Texto do botão
</Button>
// Classes: border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50
```

**Ghost Button:**
```tsx
<Button variant="ghost" size="md">
  Texto do botão
</Button>
// Classes: text-gray-600 px-4 py-2 font-medium hover:bg-gray-100
```

**Sizes:**
- `sm`: text-sm, px-3, py-1.5
- `md`: text-base, px-4, py-2
- `lg`: text-lg, px-6, py-3

---

### 3.2 Form Inputs

**Text Input:**
```tsx
<Input
  type="text"
  placeholder="Digite algo..."
  label="Label"
  error="Mensagem de erro (opcional)"
/>
// Estrutura: label + input + helper/error text
```

**Select:**
```tsx
<Select
  options={[{ value: '1', label: 'Opção 1' }]}
  placeholder="Selecione..."
  label="Label"
/>
```

**Checkbox:**
```tsx
<Checkbox
  label="Concordo com os termos"
  checked={checked}
  onChange={setChecked}
/>
```

**Radio:**
```tsx
<RadioGroup
  options={[
    { value: 'pix', label: 'Pix' },
    { value: 'card', label: 'Cartão' }
  ]}
  name="payment"
/>
```

---

### 3.3 Cards

**Product Card:**
```tsx
<ProductCard
  image="/product.jpg"
  title="Nome do Produto"
  price={99.90}
  originalPrice={129.90}
  installment="12x de R$ 9,16"
  onAddToCart={() => {}}
/>
```

**Order Card:**
```tsx
<OrderCard
  orderNumber="12345"
  date="12/01/2025"
  status="pending"
  total={299.90}
  items={3}
  onViewDetails={() => {}}
/>
```

---

### 3.4 Modals

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título do Modal"
  size="md" // sm, md, lg, xl, full
>
  Conteúdo do modal
</Modal>
```

---

### 3.5 Tables (Admin)

```tsx
<DataTable
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Ações' }
  ]}
  data={products}
  onEdit={(item) => {}}
  onDelete={(item) => {}}
/>
```

---

## 4. Layout Patterns

### 4.1 Store Layout (Público)

```
┌─────────────────────────────────────────────────┐
│ HEADER                                          │
│ Logo | Nav: Home | Shop | About | Contact | Cart│
├─────────────────────────────────────────────────┤
│ HERO (opcional)                                 │
│ Banner com destaque                             │
├─────────────────────────────────────────────────┤
│ MAIN CONTENT                                    │
│ ┌─────────────┐ ┌─────────────────────────────┐│
│ │ SIDEBAR     │ │ PRODUCT GRID               ││
│ │ Categories  │ │ [Card][Card][Card]          ││
│ │ Filters     │ │ [Card][Card][Card]          ││
│ │ Price Range │ │                             ││
│ └─────────────┘ └─────────────────────────────┘│
├─────────────────────────────────────────────────┤
│ FOOTER                                          │
│ Links | Social | Newsletter | Legal             │
└─────────────────────────────────────────────────┘
```

**Breakpoints:**
- Mobile: < 640px (1 coluna)
- Tablet: 640px - 1024px (2 colunas)
- Desktop: > 1024px (3-4 colunas)

---

### 4.2 Admin Layout

```
┌─────────────────────────────────────────────────┐
│ TOPBAR                                          │
│ Logo | Search | Notifications | Profile         │
├────────────┬────────────────────────────────────┤
│ SIDEBAR    │ MAIN                               │
│            │ ┌──────────────────────────────┐ │
│ Dashboard  │ │ PAGE HEADER                    │ │
│ Products  │ │ Title | Breadcrumb | Actions   │ │
│ Orders    │ ├──────────────────────────────┤ │
│ Customers │ │ CONTENT                        │ │
│ Settings  │ │                                │ │
│            │ │                                │ │
│            │ └──────────────────────────────┘ │
└────────────┴────────────────────────────────────┘
```

---

### 4.3 Checkout (One-Page)

```
┌─────────────────────────────────────────────────┐
│ HEADER (minimal)                                 │
│ Logo | Secure Checkout                           │
├───────────────────────┬─────────────────────────┤
│ FORMS                 │ ORDER SUMMARY           │
│                       │                         │
│ 1. Customer Info      │ Order Items (mini)      │
│ 2. Shipping Address  │ Subtotal                │
│ 3. Shipping Method   │ Shipping               │
│ 4. Payment           │ Tax                    │
│                       │ TOTAL                   │
│                       │ [FINALIZE ORDER]        │
└───────────────────────┴─────────────────────────┘
```

---

## 5. Responsive Breakpoints

```css
/* Tailwind default breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

**Grid System:**
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3-4 colunas

---

## 6. Interaction Patterns

### 6.1 Loading States

**Button Loading:**
```tsx
<Button isLoading={true}>
  Processando...
</Button>
// Adiciona spinner e desabilita clique
```

**Page Loading:**
```tsx
<PageSkeleton type="products" count={12} />
// Skeleton loader para conteúdo
```

### 6.2 Toast Notifications

```tsx
// Success
toast.success('Produto adicionado ao carrinho!');

// Error
toast.error('Erro ao processar pagamento.');

// Info
toast.info('Pedido enviado para análise.');
```

### 6.3 Form Validation

- Validação em tempo real (onBlur)
- Mensagens de erro abaixo do campo
- Border vermelho no campo com erro
-focus ring azul no campo válido

---

## 7. Accessibility (WCAG 2.1 AA)

- [x] Contraste mínimo 4.5:1 para texto
- [x] Focus states visíveis em todos os elementos
- [x] Labels em todos os inputs
- [x] ARIA labels em botões sem texto
- [x] Navegação por teclado completa
- [x] Skip links para conteúdo principal

---

## 8. Internationalization (i18n)

**Keys de tradução:**
```json
{
  "common.save": "Salvar",
  "common.cancel": "Cancelar",
  "common.delete": "Excluir",
  "common.edit": "Editar",
  "common.view": "Ver",
  "form.email": "Email",
  "form.password": "Senha",
  "checkout.total": "Total"
}
```

---

## 9. Implementation Notes

### Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (base) + custom components
- **Icons:** Lucide React

### Estrutura de Componentes
```
src/
├── components/
│   ├── ui/          # Componentes base (Button, Input, etc.)
│   ├── store/       # Componentes da loja (ProductCard, etc.)
│   ├── admin/       # Componentes do painel (DataTable, etc.)
│   └── checkout/    # Componentes do checkout
├── hooks/           # Custom hooks
├── lib/             # Utilitários
└── styles/          # CSS global
```

### Convenções
- Componentes em PascalCase
- Arquivos em kebab-case
- Props com TypeScript interfaces
- CSS classes em Tailwind (não CSS modules)

---

## 10. Approval

**Dimensions:** 6/6 evaluated

| Dimension | Status |
|-----------|--------|
| Spacing | ✓ PASS |
| Typography | ✓ PASS |
| Colors | ✓ PASS |
| Components | ✓ PASS |
| Layouts | ✓ PASS |
| Copywriting | ✓ PASS |

---

*UI-SPEC created: 2025-05-01*
*Phase 1: Foundation Design System locked*