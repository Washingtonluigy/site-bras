import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { useProducts, useCategories } from '../hooks/useProducts';
import { Page } from '../types';

interface ProductsProps {
  onNavigate: (page: Page, slug?: string) => void;
}

export default function Products({ onNavigate }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  const { products, loading } = useProducts(selectedCategory);
  const { categories } = useCategories();

  const filtered = products
    .filter(p =>
      !search || p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const pa = a.sale_price ?? a.price;
      const pb = b.sale_price ?? b.price;
      if (sortBy === 'price-asc') return pa - pb;
      if (sortBy === 'price-desc') return pb - pa;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-white text-4xl sm:text-5xl font-black mb-2">
            Nossos <span className="text-[#00ff88]">produtos</span>
          </h1>
          <p className="text-gray-500">iPhones originais e acessórios de tecnologia</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#111] border border-[#1a1a1a] focus:border-[#00ff88]/40 rounded-xl text-white text-sm placeholder-gray-600 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-[#111] border border-[#1a1a1a] focus:border-[#00ff88]/40 rounded-xl text-gray-300 text-sm px-3 py-3 outline-none transition-colors cursor-pointer"
            >
              <option value="default">Ordenar: Padrão</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome A-Z</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#0e0e0e] rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-[#1a1a1a]" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-[#1a1a1a] rounded w-2/3" />
                  <div className="h-4 bg-[#1a1a1a] rounded" />
                  <div className="h-6 bg-[#1a1a1a] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#111] border border-[#1a1a1a] flex items-center justify-center">
              <Search className="w-7 h-7 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-400 font-medium">Nenhum produto encontrado</p>
              <p className="text-gray-600 text-sm mt-1">Tente outro filtro ou busca</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-sm mb-5">
              {filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
