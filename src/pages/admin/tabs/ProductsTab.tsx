import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Pencil, X, Check, Upload, Image as ImageIcon, Star, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Product, Category } from '../../../types';

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: string;
  sale_price: string;
  stock: string;
  category_id: string;
  images: string[];
  highlight: string;
  featured: boolean;
  active: boolean;
}

const emptyForm: ProductForm = {
  name: '',
  slug: '',
  description: '',
  price: '',
  sale_price: '',
  stock: '0',
  category_id: '',
  images: [],
  highlight: '',
  featured: false,
  active: true,
};

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<ProductForm>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState<ProductForm | null>(null);

  async function load() {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);
    setProducts((prods as Product[]) ?? []);
    setCategories(cats ?? []);
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

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(filename, file);
    if (error) { alert('Erro ao fazer upload: ' + error.message); return null; }
    const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
    return data.publicUrl;
  }

  async function handleUpload(files: FileList | null, target: 'new' | 'edit') {
    if (!files || files.length === 0) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }
    setUploading(false);
    if (target === 'new') {
      setForm(p => ({ ...p, images: [...p.images, ...urls] }));
    } else {
      setEditForm(p => p ? { ...p, images: [...p.images, ...urls] } : p);
    }
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    const slug = form.slug || slugify(form.name);
    const specs: Record<string, string> = {};
    if (form.highlight) specs['destaque'] = form.highlight;
    await supabase.from('products').insert({
      name: form.name,
      slug,
      description: form.description || null,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      stock: parseInt(form.stock) || 0,
      category_id: form.category_id || null,
      images: form.images,
      specs,
      featured: form.featured,
      active: form.active,
    });
    setForm({ ...emptyForm });
    setShowNew(false);
    setSaving(false);
    load();
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      price: String(product.price),
      sale_price: product.sale_price != null ? String(product.sale_price) : '',
      stock: String(product.stock),
      category_id: product.category_id ?? '',
      images: product.images ?? [],
      highlight: (product.specs as Record<string, string>)?.destaque ?? '',
      featured: product.featured,
      active: product.active,
    });
  }

  async function handleUpdate() {
    if (!editForm || !editingId) return;
    setSaving(true);
    const specs: Record<string, string> = {};
    if (editForm.highlight) specs['destaque'] = editForm.highlight;
    await supabase.from('products').update({
      name: editForm.name,
      slug: editForm.slug,
      description: editForm.description || null,
      price: parseFloat(editForm.price),
      sale_price: editForm.sale_price ? parseFloat(editForm.sale_price) : null,
      stock: parseInt(editForm.stock) || 0,
      category_id: editForm.category_id || null,
      images: editForm.images,
      specs,
      featured: editForm.featured,
      active: editForm.active,
    }).eq('id', editingId);
    setEditingId(null);
    setEditForm(null);
    setSaving(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este produto?')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  }

  function removeImage(idx: number, target: 'new' | 'edit') {
    if (target === 'new') {
      setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
    } else {
      setEditForm(p => p ? { ...p, images: p.images.filter((_, i) => i !== idx) } : p);
    }
  }

  function ImageUploadArea({ target }: { target: 'new' | 'edit' }) {
    const ref = target === 'new' ? fileRef : editFileRef;
    const images = target === 'new' ? form.images : editForm?.images ?? [];
    return (
      <div>
        <label className="block text-xs text-gray-400 mb-1">Fotos do produto</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#222] group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i, target)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
          <button
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-xl border border-dashed border-[#333] flex flex-col items-center justify-center gap-1 text-gray-500 hover:border-[#00ff88]/40 hover:text-[#00ff88] transition-all"
          >
            {uploading ? <Upload className="w-5 h-5 animate-bounce" /> : <ImageIcon className="w-5 h-5" />}
            <span className="text-[10px]">{uploading ? 'Enviando' : 'Upload'}</span>
          </button>
        </div>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleUpload(e.target.files, target)}
        />
        <p className="text-xs text-gray-600">Também pode colar uma URL diretamente nos campos abaixo</p>
        {images.length === 0 && (
          <input
            type="text"
            placeholder="https://... (URL da imagem)"
            className="mt-2 w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00ff88]/50"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) {
                  if (target === 'new') setForm(p => ({ ...p, images: [...p.images, val] }));
                  else setEditForm(p => p ? { ...p, images: [...p.images, val] } : p);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        )}
      </div>
    );
  }

  function FormFields({ f, setF }: { f: ProductForm; setF: (fn: (p: ProductForm) => ProductForm) => void }) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nome *</label>
            <input value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value, slug: slugify(e.target.value) }))}
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50" placeholder="ex: iPhone 16 Pro 256GB" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Slug (URL)</label>
            <input value={f.slug} onChange={e => setF(p => ({ ...p, slug: e.target.value }))}
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Descrição</label>
          <textarea rows={2} value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))}
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50 resize-none" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Texto destaque (aparece abaixo do produto)</label>
          <input value={f.highlight} onChange={e => setF(p => ({ ...p, highlight: e.target.value }))}
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50" placeholder="ex: Frete grátis • Parcelamento em 12x" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Preço (R$) *</label>
            <input type="number" step="0.01" value={f.price} onChange={e => setF(p => ({ ...p, price: e.target.value }))}
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Preço promo (R$)</label>
            <input type="number" step="0.01" value={f.sale_price} onChange={e => setF(p => ({ ...p, sale_price: e.target.value }))}
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Estoque</label>
            <input type="number" value={f.stock} onChange={e => setF(p => ({ ...p, stock: e.target.value }))}
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Categoria</label>
            <select value={f.category_id} onChange={e => setF(p => ({ ...p, category_id: e.target.value }))}
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50">
              <option value="">Sem categoria</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={f.featured} onChange={e => setF(p => ({ ...p, featured: e.target.checked }))}
              className="w-4 h-4 accent-[#00ff88]" />
            <span className="text-sm text-gray-300">Destaque</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={f.active} onChange={e => setF(p => ({ ...p, active: e.target.checked }))}
              className="w-4 h-4 accent-[#00ff88]" />
            <span className="text-sm text-gray-300">Ativo (visível na loja)</span>
          </label>
        </div>
      </div>
    );
  }

  if (loading) return <p className="text-gray-500 text-sm">Carregando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{products.length} produto(s) cadastrado(s)</p>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-black font-semibold text-sm rounded-xl hover:bg-[#00e67a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      {showNew && (
        <div className="bg-[#0d0d0d] border border-[#00ff88]/30 rounded-2xl p-5 space-y-4">
          <p className="text-white font-semibold text-sm">Novo Produto</p>
          <FormFields f={form} setF={setForm} />
          <ImageUploadArea target="new" />
          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={saving || uploading}
              className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-black font-semibold text-sm rounded-xl hover:bg-[#00e67a] transition-colors disabled:opacity-50">
              <Check className="w-4 h-4" /> {saving ? 'Salvando...' : 'Criar Produto'}
            </button>
            <button onClick={() => { setShowNew(false); setForm({ ...emptyForm }); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#222] text-gray-400 text-sm rounded-xl hover:text-white transition-colors">
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {products.map(product => (
          <div key={product.id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
            {editingId === product.id && editForm ? (
              <div className="space-y-4">
                <p className="text-white font-semibold text-sm">Editando: {product.name}</p>
                <FormFields f={editForm} setF={fn => setEditForm(p => p ? fn(p) : p)} />
                <ImageUploadArea target="edit" />
                <div className="flex gap-3">
                  <button onClick={handleUpdate} disabled={saving || uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] text-black font-semibold text-sm rounded-xl hover:bg-[#00e67a] transition-colors disabled:opacity-50">
                    <Check className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={() => { setEditingId(null); setEditForm(null); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#222] text-gray-400 text-sm rounded-xl hover:text-white transition-colors">
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#111] border border-[#222]">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-600" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                    {product.featured && <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
                    {!product.active && <EyeOff className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">
                    R$ {product.price.toFixed(2)}
                    {product.sale_price ? ` → R$ ${product.sale_price.toFixed(2)}` : ''}
                    {' · '}estoque: {product.stock}
                    {product.category ? ` · ${product.category.name}` : ''}
                  </p>
                  {(product.specs as Record<string, string>)?.destaque && (
                    <p className="text-[#00ff88] text-xs mt-0.5">{(product.specs as Record<string, string>).destaque}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(product)}
                    className="p-2 rounded-lg bg-[#111] border border-[#222] text-gray-400 hover:text-[#00ff88] hover:border-[#00ff88]/40 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg bg-[#111] border border-[#222] text-gray-400 hover:text-red-400 hover:border-red-500/40 transition-all">
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
