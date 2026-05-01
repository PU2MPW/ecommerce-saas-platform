# Research: Phase 2 - Catalog & Cart

**Phase:** 2 - Catalog & Cart
**Researched:** 2025-05-01
**Status:** Ready for planning

---

## Domain Overview

Phase 2 covers two main features:
1. **Product Catalog** - Display, search, filter products
2. **Shopping Cart** - Add/remove items, persist state

These are the core e-commerce features that enable the shopping experience.

---

## Technical Approach

### Database Schema (Supabase)

**Required tables:**
- `categories` - Product categories (hierarchical)
- `products` - Main product data
- `product_images` - Multiple images per product
- `product_variants` - Size, color variants
- `reviews` - Product ratings/reviews
- `cart_items` - Shopping cart (user-specific)
- `cart` - Cart session (guest users)

### API Endpoints Needed

| Endpoint | Purpose |
|----------|---------|
| GET /api/products | List with pagination, search, filters |
| GET /api/products/[id] | Single product detail |
| POST /api/products | Create (admin) |
| PUT /api/products/[id] | Update (admin) |
| DELETE /api/products/[id] | Soft delete (admin) |
| GET /api/categories | List categories |
| GET /api/cart | Get cart items |
| POST /api/cart | Add item |
| PUT /api/cart/[id] | Update quantity |
| DELETE /api/cart/[id] | Remove item |

### Key Technical Decisions

1. **Product Images**: Use Supabase Storage buckets, store URLs in product_images table
2. **Variants**: Separate table with price/inventory per variant combination
3. **Cart Persistence**: localStorage for guests, database for authenticated users
4. **Search**: PostgreSQL full-text search or simple LIKE for MVP
5. **Pagination**: Cursor-based for performance

---

## Requirements Mapping

| Requirement | Feature | Implementation |
|-------------|---------|----------------|
| CATG-01 | Product list | GET /api/products with pagination |
| CATG-02 | Search | SQL LIKE or full-text search |
| CATG-03 | Category filter | WHERE category_id = ? |
| CATG-04 | Product detail | GET /api/products/[id] |
| CATG-05 | Multiple images | product_images table |
| CATG-06 | Variants | product_variants table |
| CATG-07 | Reviews | reviews table |
| CART-01 | Add to cart | POST /api/cart |
| CART-02 | Remove from cart | DELETE /api/cart/[id] |
| CART-03 | Change quantity | PUT /api/cart/[id] |
| CART-04 | Persist cart | localStorage + DB sync |

---

## Multi-Tenant Considerations

All queries must include `tenant_id` filter via RLS:
- Products belong to a tenant
- Categories belong to a tenant
- Cart items belong to a tenant/user

---

## Watch Out For

1. **Image uploads** - Need Supabase Storage setup
2. **Variant inventory** - Atomic decrement to prevent overselling
3. **Cart race conditions** - Optimistic UI with server reconciliation
4. **Search performance** - Index on name, description for LIKE queries

---

## Dependencies from Phase 1

- Supabase client (server.ts)
- RLS policies on tables
- Tenant middleware
- Auth system

---

*Research complete: 2025-05-01*