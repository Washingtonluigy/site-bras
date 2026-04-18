import { Category } from '../types';
import { Grid3x3, Smartphone, Package } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onChange: (slug: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  iphones: <Smartphone className="w-3.5 h-3.5" />,
  capinhas: <Package className="w-3.5 h-3.5" />,
  carregadores: <Package className="w-3.5 h-3.5" />,
  acessorios: <Package className="w-3.5 h-3.5" />,
};

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('todos')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          selected === 'todos'
            ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]'
            : 'bg-[#111] text-gray-400 border border-[#1a1a1a] hover:border-[#00ff88]/30 hover:text-white'
        }`}
      >
        <Grid3x3 className="w-3.5 h-3.5" />
        Todos
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.slug)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            selected === cat.slug
              ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]'
              : 'bg-[#111] text-gray-400 border border-[#1a1a1a] hover:border-[#00ff88]/30 hover:text-white'
          }`}
        >
          {categoryIcons[cat.slug] ?? <Package className="w-3.5 h-3.5" />}
          {cat.name}
        </button>
      ))}
    </div>
  );
}
