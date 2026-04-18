
/*
  # Admin Panel Support

  ## Overview
  Adds support for the admin panel including:
  - site_settings table for managing all configurable content
  - Write policies for admin operations on products, categories, and settings
  - Storage bucket for product image uploads

  ## New Tables
  - `site_settings`: Key-value store for all editable site content
    - `key` (text, primary key): Setting identifier
    - `value` (text): Setting value
    - `updated_at` (timestamptz): Last modified timestamp

  ## Write Policies Added
  - products: anon INSERT, UPDATE, DELETE (admin panel)
  - categories: anon INSERT, UPDATE, DELETE (admin panel)
  - site_settings: anon SELECT, INSERT, UPDATE

  ## Storage
  - Creates `product-images` bucket (public)
  - Adds storage policies for public read and anon write

  ## Default Settings
  Seeded with all hero, footer, and general configurable values
*/

-- site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (key != 'admin_password');

CREATE POLICY "Admin can insert site settings"
  ON site_settings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update site settings"
  ON site_settings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Write policies for products (admin)
CREATE POLICY "Admin can insert products"
  ON products FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update products"
  ON products FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete products"
  ON products FOR DELETE
  TO anon, authenticated
  USING (true);

-- Also allow admin to read inactive products
CREATE POLICY "Admin can read all products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Write policies for categories (admin)
CREATE POLICY "Admin can insert categories"
  ON categories FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update categories"
  ON categories FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete categories"
  ON categories FOR DELETE
  TO anon, authenticated
  USING (true);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Anon can upload product images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anon can update product images"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anon can delete product images"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Seed default site settings
INSERT INTO site_settings (key, value) VALUES
  ('admin_password', 'brazcell2025'),
  ('hero_badge_text', 'Novos iPhones disponíveis'),
  ('hero_title_line1', 'O futuro está'),
  ('hero_title_line2', 'na sua mão'),
  ('hero_subtitle', 'iPhones originais com garantia, procedência e o melhor preço. Tecnologia de ponta para quem exige o melhor.'),
  ('hero_btn_primary', 'Ver iPhones'),
  ('hero_btn_secondary', 'Ver promoções'),
  ('hero_btn_whatsapp', 'Assistencia Tecnica Especializada'),
  ('hero_feature_1_title', 'Garantia Oficial'),
  ('hero_feature_1_desc', 'Todos os produtos com garantia Apple'),
  ('hero_feature_2_title', 'Entrega Rápida'),
  ('hero_feature_2_desc', 'Envio para todo o Brasil'),
  ('hero_feature_3_title', 'Produto Original'),
  ('hero_feature_3_desc', '100% originais com nota fiscal'),
  ('whatsapp_number', '5566999337454'),
  ('whatsapp_tech_message', 'Olá! Preciso de assistência técnica para meu iPhone.'),
  ('footer_company_name', 'Braz Cell'),
  ('footer_tagline', 'tecnologia'),
  ('footer_description', 'Sua loja especializada em iPhones e acessórios de tecnologia. Produtos originais, garantia Apple e o melhor atendimento do Brasil.'),
  ('footer_phone', '(66) 99933-7454'),
  ('footer_phone_number', '5566999337454'),
  ('footer_email', 'contato@brazcell.com.br'),
  ('footer_location', 'Brasil'),
  ('footer_instagram_url', '#'),
  ('footer_copyright', '© 2025 Braz Cell Tecnologia. Todos os direitos reservados.'),
  ('footer_tagline_bottom', 'Produtos originais com garantia Apple')
ON CONFLICT (key) DO NOTHING;
