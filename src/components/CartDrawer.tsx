import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#080808] border-l border-[#1a1a1a] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-[#00ff88]" />
            </div>
            <div>
              <h2 className="text-white font-bold">Carrinho</h2>
              <p className="text-gray-500 text-xs">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1"
              >
                Limpar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-white/20 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
              <div className="w-16 h-16 rounded-2xl bg-[#111] border border-[#1a1a1a] flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-gray-600" />
              </div>
              <div className="text-center">
                <p className="text-gray-400 font-medium">Carrinho vazio</p>
                <p className="text-gray-600 text-sm mt-1">Adicione produtos para continuar</p>
              </div>
            </div>
          ) : (
            items.map(item => {
              const price = item.product.sale_price ?? item.product.price;
              return (
                <div key={item.product.id} className="flex gap-3 p-3 bg-[#111] rounded-2xl border border-[#1a1a1a]">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0e0e0e] flex-shrink-0">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium leading-snug line-clamp-2 mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-[#00ff88] font-bold text-sm">
                      {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-[#0a0a0a] rounded-xl p-1 border border-[#1a1a1a]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-[#1a1a1a] flex items-center justify-center hover:bg-[#00ff88]/10 hover:text-[#00ff88] text-gray-400 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-[#1a1a1a] flex items-center justify-center hover:bg-[#00ff88]/10 hover:text-[#00ff88] text-gray-400 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-[#1a1a1a] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Subtotal</span>
              <span className="text-white font-bold text-lg">
                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#00ff88] text-black font-bold text-base rounded-2xl hover:bg-[#00e67a] transition-all duration-200 shadow-[0_0_20px_rgba(0,255,136,0.25)]">
              Finalizar compra
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-gray-600 text-xs text-center">
              Entre em contato via WhatsApp para finalizar
            </p>
          </div>
        )}
      </div>
    </>
  );
}
