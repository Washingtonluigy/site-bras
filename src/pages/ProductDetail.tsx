import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Plus, Minus, Check, ChevronRight, Zap, Shield } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { Page } from '../types';

interface ProductDetailProps {
  slug: string;
  onNavigate: (page: Page, slug?: string) => void;
  onCartOpen: () => void;
}

export default function ProductDetail({ slug, onNavigate, onCartOpen }: ProductDetailProps) {
  const { product, loading } = useProduct(slug);
  const { addToCart, items } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const inCart = items.some(i => i.product.id === product?.id);
  const hasDiscount = product?.sale_price && product.sale_price < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product!.price - product!.sale_price!) / product!.price) * 100)
    : 0;

  const handleAdd = () => {
    if (!product) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#00ff88]/30 border-t-[#00ff88] animate-spin" />
          <p className="text-gray-500 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Produto não encontrado</p>
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center gap-2 text-[#00ff88] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos produtos
        </button>
      </div>
    );
  }

  const displayPrice = product.sale_price ?? product.price;

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-600 mb-8">
          <button onClick={() => onNavigate('home')} className="hover:text-[#00ff88] transition-colors">Início</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => onNavigate('products')} className="hover:text-[#00ff88] transition-colors">Produtos</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-400 line-clamp-1">{product.name}</span>
        </nav>

        <button
          onClick={() => onNavigate('products')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#00ff88] text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#0e0e0e] rounded-3xl overflow-hidden border border-[#1a1a1a]">
              {hasDiscount && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl">
                  -{discountPct}% OFF
                </div>
              )}
              {product.images[activeImage] ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">📱</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === i ? 'border-[#00ff88]' : 'border-[#1a1a1a] hover:border-[#00ff88]/40'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-4">
            {product.category && (
              <span className="text-[#00ff88] text-sm font-medium tracking-wide uppercase mb-2 block">
                {product.category.name}
              </span>
            )}
            <h1 className="text-white text-3xl sm:text-4xl font-black mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-end gap-3 mb-2">
              <span className="text-[#00ff88] font-black text-4xl sm:text-5xl">
                {displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-gray-500 text-lg line-through">
                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg">
                  Economize {(product.price - product.sale_price!).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            )}

            {product.description && (
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-[#111] border border-[#1a1a1a] rounded-xl p-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-bold text-base w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className={`text-sm font-medium ${product.stock > 5 ? 'text-gray-500' : product.stock > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold text-base rounded-2xl transition-all duration-200 ${
                  added
                    ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : 'bg-[#00ff88] text-black hover:bg-[#00e67a] shadow-[0_0_20px_rgba(0,255,136,0.25)] hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
              </button>
              {inCart && (
                <button
                  onClick={onCartOpen}
                  className="flex items-center justify-center gap-2 px-5 py-4 bg-[#111] text-white font-medium text-base rounded-2xl border border-[#1a1a1a] hover:border-[#00ff88]/30 transition-all duration-200"
                >
                  Ver carrinho
                </button>
              )}
            </div>

            <div className="flex items-center gap-6 p-4 bg-[#0e0e0e] rounded-2xl border border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00ff88]" />
                <span className="text-gray-400 text-xs">Garantia Apple</span>
              </div>
              <div className="w-px h-6 bg-[#1a1a1a]" />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00ff88]" />
                <span className="text-gray-400 text-xs">100% Original</span>
              </div>
            </div>

            {Object.keys(product.specs).length > 0 && (
              <div className="mt-8">
                <h3 className="text-white font-bold text-lg mb-4">Especificações</h3>
                <div className="space-y-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between py-2.5 border-b border-[#1a1a1a] last:border-0">
                      <span className="text-gray-500 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-white text-sm font-medium text-right max-w-[55%]">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
