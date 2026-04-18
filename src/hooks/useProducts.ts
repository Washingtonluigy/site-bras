import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('active', true)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (categorySlug && categorySlug !== 'todos') {
          const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .maybeSingle();
          if (cat) {
            query = query.eq('category_id', cat.id);
          }
        }

        const { data, error: err } = await query;
        if (err) throw err;
        setProducts((data as Product[]) ?? []);
      } catch (e) {
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [categorySlug]);

  return { products, loading, error };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function fetch() {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();
      setProduct(data as Product);
      setLoading(false);
    }
    fetch();
  }, [slug]);

  return { product, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { categories, loading };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('active', true)
        .eq('featured', true)
        .order('created_at', { ascending: false });
      setProducts((data as Product[]) ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { products, loading };
}
