import { ShoppingCart, Eye } from 'lucide-react';
import { Product, Page } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: Page, slug?: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { addToCart } = useCart();
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;
  const displayPrice = product.sale_price ?? product.price;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={() => onNavigate('product-detail', product.slug)}
      className="group relative bg-[#0e0e0e] border border-[#1a1a1a] hover:border-[#00ff88]/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.08)] hover:-translate-y-1"
    >
      {product.featured && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#00ff88] text-black text-xs font-bold rounded-lg">
          Destaque
        </div>
      )}
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
          -{discountPct}%
        </div>
      )}

      <div className="aspect-square bg-[#111] overflow-hidden relative">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[#1a1a1a] flex items-center justify-center">
              <span className="text-4xl"></span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate('product-detail', product.slug); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-xl border border-white/20 hover:border-white/40 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver detalhes
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1">
          {product.category && (
            <span className="text-[#00ff88] text-xs font-medium tracking-wide uppercase">
              {product.category.name}
            </span>
          )}
        </div>
        <h3 className="text-white font-semibold text-sm leading-snug mb-3 line-clamp-2 group-hover:text-[#00ff88] transition-colors duration-200">
          {product.name}
        </h3>

        <div className="flex items-end gap-2 mb-4">
          <span className="text-[#00ff88] font-black text-xl">
            {displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          {hasDiscount && (
            <span className="text-gray-500 text-sm line-through">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${product.stock > 5 ? 'text-gray-500' : product.stock > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
            {product.stock > 5 ? 'Em estoque' : product.stock > 0 ? `Apenas ${product.stock} restantes` : 'Esgotado'}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#00ff88]/10 hover:bg-[#00ff88] text-[#00ff88] hover:text-black text-xs font-bold rounded-xl border border-[#00ff88]/20 hover:border-[#00ff88] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
