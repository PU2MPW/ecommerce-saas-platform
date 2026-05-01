'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface CategoryFilterProps {
  categories: Category[];
  tenantSlug: string;
}

export function CategoryFilter({ categories, tenantSlug }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category_id');

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Categorias</h3>
      <ul className="space-y-1">
        <li>
          <Link
            href={`/${tenantSlug}/produtos`}
            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
              !currentCategory 
                ? 'bg-blue-50 text-blue-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todas
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/${tenantSlug}/produtos?category_id=${category.id}`}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                currentCategory === category.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </Link>
            {category.children && category.children.length > 0 && (
              <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
                {category.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/${tenantSlug}/produtos?category_id=${child.id}`}
                      className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}