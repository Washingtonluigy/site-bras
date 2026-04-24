import { useState } from 'react';
import { Settings, Tag, Package, LayoutGrid as Layout, Lock, LogOut, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import GeneralTab from './tabs/GeneralTab';
import CategoriesTab from './tabs/CategoriesTab';
import ProductsTab from './tabs/ProductsTab';
import FooterTab from './tabs/FooterTab';
type Tab = 'general' | 'categories' | 'products' | 'footer';

const ADMIN_PASSWORD = '261520';

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [tab, setTab] = useState<Tab>('general');
  const { settings, loading, saveSettings } = useSiteSettings();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setChecking(true);
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      setAuthed(true);
    } else {
      setError('Senha incorreta');
    }
    setChecking(false);
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_auth');
    setAuthed(false);
    setPassword('');
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h1 className="text-white font-bold text-2xl">Painel Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Braz Cell — Área restrita</p>
          </div>
          <form onSubmit={handleLogin} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Senha de acesso</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00ff88]/50 transition-colors"
                placeholder="••••••••••"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={checking || !password}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:bg-[#00e67a] transition-colors disabled:opacity-50"
            >
              {checking ? 'Verificando...' : 'Entrar'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-gray-700 text-xs mt-4">Acesso exclusivo para administradores</p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Settings }[] = [
    { id: 'general', label: 'Geral / Hero', icon: Layout },
    { id: 'categories', label: 'Categorias', icon: Tag },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'footer', label: 'Rodapé', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      <header className="bg-[#080808] border-b border-[#1a1a1a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-[#00ff88]" />
            </div>
            <span className="text-white font-bold text-sm">Admin — Braz Cell</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-gray-500 hover:text-white text-xs transition-colors"
            >
              Ver loja
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#222] text-gray-500 hover:text-white hover:border-[#333] text-xs transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      tab === t.id
                        ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20'
                        : 'text-gray-500 hover:text-white hover:bg-[#0d0d0d]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6">
              {loading ? (
                <p className="text-gray-500 text-sm">Carregando configurações...</p>
              ) : (
                <>
                  {tab === 'general' && (
                    <GeneralTab settings={settings} onSave={saveSettings} />
                  )}
                  {tab === 'categories' && <CategoriesTab />}
                  {tab === 'products' && <ProductsTab />}
                  {tab === 'footer' && (
                    <FooterTab settings={settings} onSave={saveSettings} />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
