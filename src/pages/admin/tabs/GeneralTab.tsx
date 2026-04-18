import { useState } from 'react';
import { Save } from 'lucide-react';
import { Settings } from '../../../hooks/useSiteSettings';

interface Props {
  settings: Settings;
  onSave: (entries: Settings) => Promise<void>;
}

export default function GeneralTab({ settings, onSave }: Props) {
  const [form, setForm] = useState<Settings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function field(key: string, label: string, multiline = false) {
    return (
      <div key={key}>
        <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
        {multiline ? (
          <textarea
            rows={3}
            value={form[key] ?? ''}
            onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50 resize-none"
          />
        ) : (
          <input
            type="text"
            value={form[key] ?? ''}
            onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
            className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00ff88]/50"
          />
        )}
      </div>
    );
  }

  async function handleSave() {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-white font-semibold text-base mb-4 pb-2 border-b border-[#1a1a1a]">Hero — Textos Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('hero_badge_text', 'Badge (topo)')}
          {field('hero_title_line1', 'Título linha 1')}
          {field('hero_title_line2', 'Título linha 2 (gradiente)')}
        </div>
        <div className="mt-4">
          {field('hero_subtitle', 'Subtítulo', true)}
        </div>
      </section>

      <section>
        <h2 className="text-white font-semibold text-base mb-4 pb-2 border-b border-[#1a1a1a]">Hero — Botões</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {field('hero_btn_primary', 'Botão principal (verde)')}
          {field('hero_btn_secondary', 'Botão secundário')}
          {field('hero_btn_whatsapp', 'Botão WhatsApp Assistência')}
        </div>
      </section>

      <section>
        <h2 className="text-white font-semibold text-base mb-4 pb-2 border-b border-[#1a1a1a]">Hero — Cards de Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Card 1</p>
            {field('hero_feature_1_title', 'Título')}
            {field('hero_feature_1_desc', 'Descrição')}
          </div>
          <div className="space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Card 2</p>
            {field('hero_feature_2_title', 'Título')}
            {field('hero_feature_2_desc', 'Descrição')}
          </div>
          <div className="space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Card 3</p>
            {field('hero_feature_3_title', 'Título')}
            {field('hero_feature_3_desc', 'Descrição')}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-white font-semibold text-base mb-4 pb-2 border-b border-[#1a1a1a]">WhatsApp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('whatsapp_number', 'Número (com código do país, ex: 5566999337454)')}
          {field('whatsapp_tech_message', 'Mensagem padrão (assistência técnica)')}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:bg-[#00e67a] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Salvo!' : saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}
