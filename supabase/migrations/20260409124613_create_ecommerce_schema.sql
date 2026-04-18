
/*
  # Braz Cell E-commerce Schema

  ## Overview
  Full e-commerce schema for Braz Cell tecnologia iPhone store.

  ## Tables

  ### categories
  - Product categories (iPhones, Accessories, etc.)
  - id, name, slug, description, image_url

  ### products
  - Main products table with all iPhone and accessory listings
  - id, name, slug, description, price, sale_price, stock, category_id, images, specs (JSONB), featured, active

  ### product_images
  - Multiple images per product

  ## Security
  - RLS enabled on all tables
  - Public read access for products (store is public)
  - No write access from client (managed via service role / admin)
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  sale_price numeric(10,2),
  stock integer DEFAULT 0,
  category_id uuid REFERENCES categories(id),
  images text[] DEFAULT '{}',
  specs jsonb DEFAULT '{}',
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Seed categories
INSERT INTO categories (name, slug, description) VALUES
  ('iPhones', 'iphones', 'Os melhores iPhones com garantia e procedência'),
  ('Capinhas', 'capinhas', 'Proteção com estilo para o seu iPhone'),
  ('Carregadores', 'carregadores', 'Carregadores originais e compatíveis'),
  ('Acessórios', 'acessorios', 'Fones, cabos, películas e muito mais')
ON CONFLICT (slug) DO NOTHING;

-- Seed products
INSERT INTO products (name, slug, description, price, sale_price, stock, category_id, images, specs, featured) VALUES
(
  'iPhone 16 Pro Max 256GB',
  'iphone-16-pro-max-256gb',
  'O iPhone mais avançado de todos os tempos. Com chip A18 Pro, câmera de 48MP com zoom óptico 5x e tela ProMotion de 6.9".',
  9299.00,
  8999.00,
  15,
  (SELECT id FROM categories WHERE slug = 'iphones'),
  ARRAY[
    'https://images.pexels.com/photos/18525574/pexels-photo-18525574.jpeg',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'
  ],
  '{"chip": "A18 Pro", "tela": "6.9\" Super Retina XDR ProMotion", "camera": "48MP + 48MP + 12MP", "bateria": "Até 33h reprodução de vídeo", "armazenamento": "256GB", "cor_disponivel": ["Titânio Natural", "Titânio Preto", "Titânio Branco", "Titânio Deserto"]}'::jsonb,
  true
),
(
  'iPhone 16 Pro Max 512GB',
  'iphone-16-pro-max-512gb',
  'Máximo desempenho, armazenamento generoso. Chip A18 Pro, câmera profissional e bateria que dura o dia todo.',
  10499.00,
  NULL,
  8,
  (SELECT id FROM categories WHERE slug = 'iphones'),
  ARRAY[
    'https://images.pexels.com/photos/18525574/pexels-photo-18525574.jpeg',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'
  ],
  '{"chip": "A18 Pro", "tela": "6.9\" Super Retina XDR ProMotion", "camera": "48MP + 48MP + 12MP", "bateria": "Até 33h reprodução de vídeo", "armazenamento": "512GB", "cor_disponivel": ["Titânio Natural", "Titânio Preto", "Titânio Branco", "Titânio Deserto"]}'::jsonb,
  true
),
(
  'iPhone 16 Pro 256GB',
  'iphone-16-pro-256gb',
  'Potência profissional em tamanho compacto. Tela de 6.3", chip A18 Pro e câmera com zoom óptico 5x.',
  8299.00,
  7999.00,
  20,
  (SELECT id FROM categories WHERE slug = 'iphones'),
  ARRAY[
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    'https://images.pexels.com/photos/18525574/pexels-photo-18525574.jpeg'
  ],
  '{"chip": "A18 Pro", "tela": "6.3\" Super Retina XDR ProMotion", "camera": "48MP + 48MP + 12MP", "bateria": "Até 27h reprodução de vídeo", "armazenamento": "256GB", "cor_disponivel": ["Titânio Natural", "Titânio Preto", "Titânio Branco", "Titânio Deserto"]}'::jsonb,
  true
),
(
  'iPhone 16 128GB',
  'iphone-16-128gb',
  'A nova geração do iPhone. Chip A16 Bionic, câmera de 48MP e design elegante em várias cores.',
  5999.00,
  5699.00,
  25,
  (SELECT id FROM categories WHERE slug = 'iphones'),
  ARRAY[
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'
  ],
  '{"chip": "A16 Bionic", "tela": "6.1\" Super Retina XDR", "camera": "48MP + 12MP", "bateria": "Até 22h reprodução de vídeo", "armazenamento": "128GB", "cor_disponivel": ["Preto", "Branco", "Rosa", "Azul", "Verde", "Ultramarino"]}'::jsonb,
  true
),
(
  'iPhone 16 256GB',
  'iphone-16-256gb',
  'Mais armazenamento, mais liberdade. iPhone 16 com 256GB para guardar tudo que você ama.',
  6799.00,
  NULL,
  18,
  (SELECT id FROM categories WHERE slug = 'iphones'),
  ARRAY[
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'
  ],
  '{"chip": "A16 Bionic", "tela": "6.1\" Super Retina XDR", "camera": "48MP + 12MP", "bateria": "Até 22h reprodução de vídeo", "armazenamento": "256GB", "cor_disponivel": ["Preto", "Branco", "Rosa", "Azul", "Verde", "Ultramarino"]}'::jsonb,
  false
),
(
  'iPhone 15 Pro Max 256GB',
  'iphone-15-pro-max-256gb',
  'O poder do chip A17 Pro com câmera de 48MP e titanium design. Perfeito para quem exige o melhor.',
  7499.00,
  6999.00,
  12,
  (SELECT id FROM categories WHERE slug = 'iphones'),
  ARRAY[
    'https://images.pexels.com/photos/18525574/pexels-photo-18525574.jpeg',
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'
  ],
  '{"chip": "A17 Pro", "tela": "6.7\" Super Retina XDR ProMotion", "camera": "48MP + 12MP + 12MP", "bateria": "Até 29h reprodução de vídeo", "armazenamento": "256GB", "cor_disponivel": ["Titânio Natural", "Titânio Preto", "Titânio Branco", "Titânio Azul"]}'::jsonb,
  false
),
(
  'iPhone 15 128GB',
  'iphone-15-128gb',
  'Design em alumínio com chip A16, câmera de 48MP e Dynamic Island. Ótimo custo-benefício.',
  4499.00,
  4199.00,
  30,
  (SELECT id FROM categories WHERE slug = 'iphones'),
  ARRAY[
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'
  ],
  '{"chip": "A16 Bionic", "tela": "6.1\" Super Retina XDR", "camera": "48MP + 12MP", "bateria": "Até 20h reprodução de vídeo", "armazenamento": "128GB", "cor_disponivel": ["Preto", "Amarelo", "Rosa", "Verde", "Azul"]}'::jsonb,
  false
),
(
  'iPhone 14 128GB',
  'iphone-14-128gb',
  'Desempenho confiável com chip A15 Bionic. Excelente para quem quer entrar no universo Apple.',
  3299.00,
  2999.00,
  22,
  (SELECT id FROM categories WHERE slug = 'iphones'),
  ARRAY[
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'
  ],
  '{"chip": "A15 Bionic", "tela": "6.1\" Super Retina XDR", "camera": "12MP + 12MP", "bateria": "Até 20h reprodução de vídeo", "armazenamento": "128GB", "cor_disponivel": ["Meia-noite", "Estelar", "Roxo", "Vermelho", "Azul"]}'::jsonb,
  false
),
(
  'Capinha MagSafe iPhone 16 Pro - Transparente',
  'capinha-magsafe-iphone16pro-transparente',
  'Capinha original compatível com MagSafe para iPhone 16 Pro. Proteção sem esconder o design.',
  199.00,
  159.00,
  50,
  (SELECT id FROM categories WHERE slug = 'capinhas'),
  ARRAY[
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'
  ],
  '{"compatibilidade": "iPhone 16 Pro", "material": "Policarbonato", "magsafe": "Sim", "cor": "Transparente"}'::jsonb,
  false
),
(
  'Carregador USB-C 20W Apple',
  'carregador-usbc-20w-apple',
  'Carregador rápido USB-C 20W original Apple. Compatível com todos os iPhones com USB-C.',
  249.00,
  199.00,
  40,
  (SELECT id FROM categories WHERE slug = 'carregadores'),
  ARRAY[
    'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg'
  ],
  '{"potencia": "20W", "porta": "USB-C", "compatibilidade": "iPhone 15, 16 e todos com USB-C", "cabo_incluido": "Não"}'::jsonb,
  false
),
(
  'Cabo USB-C Lightning 1m Apple',
  'cabo-usbc-lightning-1m',
  'Cabo original Apple USB-C para Lightning. Carregamento rápido e transferência de dados.',
  149.00,
  129.00,
  60,
  (SELECT id FROM categories WHERE slug = 'acessorios'),
  ARRAY[
    'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg'
  ],
  '{"comprimento": "1 metro", "porta_1": "USB-C", "porta_2": "Lightning", "compatibilidade": "iPhone 14 e anteriores"}'::jsonb,
  false
),
(
  'Película de Vidro iPhone 16 Pro Max',
  'pelicula-vidro-iphone16promax',
  'Película de vidro temperado 9H para iPhone 16 Pro Max. Proteção máxima sem perder sensibilidade.',
  89.00,
  69.00,
  100,
  (SELECT id FROM categories WHERE slug = 'acessorios'),
  ARRAY[
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'
  ],
  '{"compatibilidade": "iPhone 16 Pro Max", "dureza": "9H", "tipo": "Vidro temperado", "quantidade": "2 unidades"}'::jsonb,
  false
)
ON CONFLICT (slug) DO NOTHING;
