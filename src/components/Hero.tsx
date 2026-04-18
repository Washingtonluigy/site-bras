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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
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

        <div className="flex justify-center mb-20">
          <a
            href="https://wa.me/5566999337454?text=Ol%C3%A1%21+Preciso+de+assist%C3%AAncia+t%C3%A9cnica+para+meu+iPhone."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] font-semibold text-sm hover:bg-[#25D366]/20 hover:border-[#25D366]/70 transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Assistencia Tecnica Especializada
          </a>
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
