import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/store/ProductGrid';
import { SearchBar } from '@/components/store/SearchBar';
import { CategoryFilter } from '@/components/store/CategoryFilter';

interface ProductsPageProps {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ page?: string; search?: string; category_id?: string }>;
}

async function getProducts(tenantSlug: string, search: string | undefined, categoryId: string | undefined, page: number) {
  const supabase = await createSupabaseServerClient();
  const pageSize = 12;
  
  // Get tenant ID
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', tenantSlug)
    .single();
  
  if (!tenant) {
    return { products: [], total: 0 };
  }
  
  let query = supabase
    .from('products')
    .select('*, category:categories(name, slug), images:product_images(url, position)', { count: 'exact' })
    .eq('tenant_id', tenant.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, count, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
  
  // Sort images by position
  const products = (data || []).map(p => ({
    ...p,
    images: p.images?.sort((a: { position: number }, b: { position: number }) => a.position - b.position) || []
  }));
  
  return { products, total: count || 0 };
}

async function getCategories(tenantSlug: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', tenantSlug)
    .single();
  
  if (!tenant) return [];
  
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('name');
  
  return data || [];
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { tenantSlug } = await params;
  const { page: pageStr, search, category_id } = await searchParams;
  
  const page = parseInt(pageStr || '1');
  const { products, total } = await getProducts(tenantSlug, search, category_id, page);
  const categories = await getCategories(tenantSlug);
  
  const pageSize = 12;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nossos Produtos</h1>
        <p className="text-gray-600 mt-2">
          Encontre os melhores produtos com preços imperdíveis
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24">
            <SearchBar defaultValue={search || ''} tenantSlug={tenantSlug} />
            <div className="mt-6">
              <CategoryFilter categories={categories as any} tenantSlug={tenantSlug} />
            </div>
          </div>
        </aside>
        
        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-4 text-sm text-gray-600">
            {total > 0 && (
              <span>
                {total} produto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <ProductGrid products={products as any} tenantSlug={tenantSlug} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2 flex-wrap">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                const isCurrentPage = p === page;
                return (
                  <a
                    key={p}
                    href={`/${tenantSlug}/produtos?page=${p}${search ? `&search=${search}` : ''}${category_id ? `&category_id=${category_id}` : ''}`}
                    className={`min-w-[40px] px-3 py-2 rounded text-center text-sm font-medium transition-colors ${
                      isCurrentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </a>
                );
              })}
              {totalPages > 5 && page < totalPages - 1 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <a
                    href={`/${tenantSlug}/produtos?page=${totalPages}${search ? `&search=${search}` : ''}${category_id ? `&category_id=${category_id}` : ''}`}
                    className="px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
                  >
                    {totalPages}
                  </a>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}