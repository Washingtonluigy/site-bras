import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useFeaturedProducts } from '../hooks/useProducts';
import { Page } from '../types';
import { Settings } from '../hooks/useSiteSettings';
import { ArrowRight, Zap } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: Page, slug?: string) => void;
  settings: Settings;
}

export default function Home({ onNavigate, settings }: HomeProps) {
  const { products, loading } = useFeaturedProducts();

  return (
    <div>
      <Hero onNavigate={onNavigate} settings={settings} />

      <section className="bg-[#050505] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-[#00ff88]" />
                <span className="text-[#00ff88] text-sm font-medium tracking-wide uppercase">Em destaque</span>
              </div>
              <h2 className="text-white text-3xl sm:text-4xl font-black">
                iPhones em
                <span className="text-[#00ff88]"> destaque</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-[#00ff88] text-sm font-medium transition-colors group"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          )}

          <div className="sm:hidden mt-8 flex justify-center">
            <button
              onClick={() => onNavigate('products')}
              className="flex items-center gap-2 text-gray-400 hover:text-[#00ff88] text-sm font-medium transition-colors"
            >
              Ver todos os produtos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#050505] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1a0f] via-[#050d08] to-[#050505] border border-[#00ff88]/20 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 max-w-xl">
              <span className="text-[#00ff88] text-sm font-medium tracking-wide uppercase mb-4 block">Novidade</span>
              <h2 className="text-white text-3xl sm:text-4xl font-black mb-4">
                iPhone 16 Pro Max chegou com tudo
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                O iPhone mais poderoso da história. Chip A18 Pro, câmera profissional com zoom 5x e tela ProMotion de 6.9 polegadas.
              </p>
              <button
                onClick={() => onNavigate('products')}
                className="flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold text-sm rounded-xl hover:bg-[#00e67a] transition-all duration-200 shadow-[0_0_20px_rgba(0,255,136,0.25)]"
              >
                Quero o meu
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
