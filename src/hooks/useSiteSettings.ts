import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Settings = Record<string, string>;

const defaults: Settings = {
  admin_password: 'brazcell2025',
  hero_badge_text: 'Novos iPhones disponíveis',
  hero_title_line1: 'O futuro está',
  hero_title_line2: 'na sua mão',
  hero_subtitle: 'iPhones originais com garantia, procedência e o melhor preço. Tecnologia de ponta para quem exige o melhor.',
  hero_btn_primary: 'Ver iPhones',
  hero_btn_secondary: 'Ver promoções',
  hero_btn_whatsapp: 'Assistencia Tecnica Especializada',
  hero_feature_1_title: 'Garantia Oficial',
  hero_feature_1_desc: 'Todos os produtos com garantia Apple',
  hero_feature_2_title: 'Entrega Rápida',
  hero_feature_2_desc: 'Envio para todo o Brasil',
  hero_feature_3_title: 'Produto Original',
  hero_feature_3_desc: '100% originais com nota fiscal',
  whatsapp_number: '5566999337454',
  whatsapp_tech_message: 'Olá! Preciso de assistência técnica para meu iPhone.',
  footer_company_name: 'Braz Cell',
  footer_tagline: 'tecnologia',
  footer_description: 'Sua loja especializada em iPhones e acessórios de tecnologia. Produtos originais, garantia Apple e o melhor atendimento do Brasil.',
  footer_phone: '(66) 99933-7454',
  footer_phone_number: '5566999337454',
  footer_email: 'contato@brazcell.com.br',
  footer_location: 'Brasil',
  footer_instagram_url: '#',
  footer_copyright: '© 2025 Braz Cell Tecnologia. Todos os direitos reservados.',
  footer_tagline_bottom: 'Produtos originais com garantia Apple',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('key, value');
      if (data && data.length > 0) {
        const map: Settings = { ...defaults };
        data.forEach((row: { key: string; value: string }) => {
          map[row.key] = row.value;
        });
        setSettings(map);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function saveSetting(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }));
    await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  }

  async function saveSettings(entries: Settings) {
    const rows = Object.entries(entries).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));
    setSettings(prev => ({ ...prev, ...entries }));
    await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
  }

  return { settings, loading, saveSetting, saveSettings };
}
