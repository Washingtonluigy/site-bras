import { Phone, Instagram, MessageCircle, MapPin, Mail } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#050505] border-t border-[#1a1a1a] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/469506452_28137142902566488_3890785697829401929_n.jpg"
                alt="Braz Cell"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00ff88]/30"
              />
              <div>
                <span className="text-white font-bold text-xl leading-none block">Braz Cell</span>
                <span className="text-[#00ff88] text-xs tracking-widest uppercase">tecnologia</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
              Sua loja especializada em iPhones e acessórios de tecnologia. Produtos originais,
              garantia Apple e o melhor atendimento do Brasil.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-[#00ff88]/40 flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-[#00ff88]/40 flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Produtos</h3>
            <ul className="space-y-2.5">
              {['iPhones', 'Capinhas', 'Carregadores', 'Acessórios'].map(item => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate('products')}
                    className="text-gray-500 hover:text-[#00ff88] text-sm transition-colors duration-200"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#00ff88] mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">(00) 00000-0000</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#00ff88] mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">WhatsApp disponível</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#00ff88] mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">contato@brazcell.com.br</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00ff88] mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2025 Braz Cell Tecnologia. Todos os direitos reservados.
          </p>
          <p className="text-gray-700 text-xs">
            Produtos originais com garantia Apple
          </p>
        </div>
      </div>
    </footer>
  );
}
