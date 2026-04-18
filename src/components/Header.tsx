import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onCartOpen: () => void;
}

export default function Header({ currentPage, onNavigate, onCartOpen }: HeaderProps) {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', page: 'home' as Page },
    { label: 'iPhones', page: 'products' as Page },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-[#00ff88]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <img
              src="/469506452_28137142902566488_3890785697829401929_n.jpg"
              alt="Braz Cell"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00ff88]/40 group-hover:ring-[#00ff88] transition-all duration-300"
            />
            <div className="hidden sm:block">
              <span className="text-white font-bold text-lg leading-none block">Braz Cell</span>
              <span className="text-[#00ff88] text-xs tracking-widest uppercase leading-none">tecnologia</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`text-sm font-medium tracking-wide transition-all duration-200 relative group ${
                  currentPage === link.page ? 'text-[#00ff88]' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 right-0 h-px bg-[#00ff88] transition-all duration-200 ${
                  currentPage === link.page ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                }`} />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onCartOpen}
              className="relative p-2.5 rounded-xl bg-[#111] border border-[#00ff88]/20 hover:border-[#00ff88]/60 hover:bg-[#00ff88]/5 transition-all duration-200 group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-[#00ff88] transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#00ff88] text-black text-xs font-bold flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#111] border border-[#00ff88]/20 hover:border-[#00ff88]/60 transition-all duration-200"
            >
              {menuOpen
                ? <X className="w-5 h-5 text-gray-300" />
                : <Menu className="w-5 h-5 text-gray-300" />
              }
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#080808] border-t border-[#00ff88]/10 px-4 py-4 flex flex-col gap-1">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => { onNavigate(link.page); setMenuOpen(false); }}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === link.page
                  ? 'bg-[#00ff88]/10 text-[#00ff88]'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
