import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Category } from '../../../types';

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleCreate() {
    if (!form.name.trim()) return;
    setSaving(true);
    const slug = form.slug || slugify(form.name);
    await supabase.from('categories').insert({
      name: form.name,
      slug,
      description: form.description || null,
    });
    setForm({ name: '', slug: '', description: '' });
    setShowNew(false);
    setSaving(false);
    load();
  }

  async function handleUpdate(cat: Category) {
    setSaving(true);
    await supabase.from('categories').update({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
    }).eq('id', cat.id);
    setEditingId(null);
    setSaving(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta categoria? Os produtos vinculados ficarão sem categoria.')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  }

  function updateCategory(id: string, field: string, value: string) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  if (loading) return <p className="text-gray-500 text-sm">Carregando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{categories.length} categoria(s) cadastrada(s)</p>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-black font-semibold text-sm rounded-xl hover:bg-[#00e67a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      {showNew && (
        <div className="bg-[#0d0d0d] border border-[#00ff88]/30 rounded-2xl p-5 space-y-4">
          <p className="text-white font-semibold text-sm">Nova Categoria</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nome *</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: slugify(e.target.value) }))}
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50"
                placeholder="ex: iPhones"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50"
                placeholder="ex: iphones"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Descrição</label>
              <input
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50"
                placeholder="Descrição opcional"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-black font-semibold text-sm rounded-xl hover:bg-[#00e67a] transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Criar
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#222] text-gray-400 text-sm rounded-xl hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
            {editingId === cat.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Nome</label>
                    <input
                      value={cat.name}
                      onChange={e => updateCategory(cat.id, 'name', e.target.value)}
                      className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00ff88]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Slug</label>
                    <input
                      value={cat.slug}
                      onChange={e => updateCategory(cat.id, 'slug', e.target.value)}
                      className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00ff88]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Descrição</label>
                    <input
                      value={cat.description ?? ''}
                      onChange={e => updateCategory(cat.id, 'description', e.target.value)}
                      className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00ff88]/50"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(cat)}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff88] text-black font-semibold text-xs rounded-lg hover:bg-[#00e67a] transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Salvar
                  </button>
                  <button
                    onClick={() => { setEditingId(null); load(); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111] border border-[#222] text-gray-400 text-xs rounded-lg hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{cat.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">slug: {cat.slug}{cat.description ? ` · ${cat.description}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(cat.id)}
                    className="p-2 rounded-lg bg-[#111] border border-[#222] text-gray-400 hover:text-[#00ff88] hover:border-[#00ff88]/40 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-lg bg-[#111] border border-[#222] text-gray-400 hover:text-red-400 hover:border-red-500/40 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
