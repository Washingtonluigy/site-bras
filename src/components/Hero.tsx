import { ArrowRight, Zap, Shield, Star } from 'lucide-react';
import { Page } from '../types';

interface HeroProps {
  onNavigate: (page: Page) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00ff88]/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#00ff88]/3 blur-[100px]" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#00ff88]/3 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 mb-8">
          <Zap className="w-4 h-4 text-[#00ff88]" />
          <span className="text-[#00ff88] text-sm font-medium tracking-wide">Novos iPhones disponíveis</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight">
          O futuro está
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#00ff88] animate-pulse">
            na sua mão
          </span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          iPhones originais com garantia, procedência e o melhor preço.
          Tecnologia de ponta para quem exige o melhor.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => onNavigate('products')}
            className="group flex items-center gap-3 px-8 py-4 bg-[#00ff88] text-black font-bold text-base rounded-2xl hover:bg-[#00e67a] transition-all duration-200 shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_50px_rgba(0,255,136,0.5)]"
          >
            Ver iPhones
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-3 px-8 py-4 bg-transparent text-white font-medium text-base rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200"
          >
            Ver promoções
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Shield, title: 'Garantia Oficial', desc: 'Todos os produtos com garantia Apple' },
            { icon: Zap, title: 'Entrega Rápida', desc: 'Envio para todo o Brasil' },
            { icon: Star, title: 'Produto Original', desc: '100% originais com nota fiscal' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/3 border border-white/8 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#00ff88]" />
              </div>
              <h3 className="text-white font-semibold text-sm">{title}</h3>
              <p className="text-gray-500 text-xs text-center">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-gray-600 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#00ff88]/50 to-transparent" />
      </div>
    </section>
  );
}
