import { useState } from 'react';
import { Save } from 'lucide-react';
import { Settings } from '../../../hooks/useSiteSettings';

interface Props {
  settings: Settings;
  onSave: (entries: Settings) => Promise<void>;
}

export default function FooterTab({ settings, onSave }: Props) {
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
        <h2 className="text-white font-semibold text-base mb-4 pb-2 border-b border-[#1a1a1a]">Identidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('footer_company_name', 'Nome da empresa')}
          {field('footer_tagline', 'Tagline (abaixo do nome)')}
        </div>
        <div className="mt-4">
          {field('footer_description', 'Descrição / Sobre', true)}
        </div>
      </section>

      <section>
        <h2 className="text-white font-semibold text-base mb-4 pb-2 border-b border-[#1a1a1a]">Contato</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('footer_phone', 'Telefone exibido (ex: (66) 99933-7454)')}
          {field('footer_phone_number', 'Número para discagem (ex: 5566999337454)')}
          {field('footer_email', 'E-mail')}
          {field('footer_location', 'Localização')}
          {field('footer_instagram_url', 'Link do Instagram')}
        </div>
      </section>

      <section>
        <h2 className="text-white font-semibold text-base mb-4 pb-2 border-b border-[#1a1a1a]">Rodapé inferior</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('footer_copyright', 'Texto de copyright')}
          {field('footer_tagline_bottom', 'Tagline inferior')}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:bg-[#00e67a] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Salvo!' : saving ? 'Salvando...' : 'Salvar Rodapé'}
        </button>
      </div>
    </div>
  );
}
