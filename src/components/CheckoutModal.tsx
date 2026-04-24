import { useState } from 'react';
import { X, CreditCard, Loader2, ChevronRight, User, Mail, Phone, Hash } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface PayerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
}

const emptyForm: PayerForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  cpf: '',
};

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
}

export default function CheckoutModal({ open, onClose }: Props) {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<PayerForm>({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function setField(field: keyof PayerForm, value: string) {
    setForm(p => ({ ...p, [field]: value }));
  }

  function validate() {
    const cpfDigits = form.cpf.replace(/\D/g, '');
    if (!form.firstName.trim()) return 'Informe seu nome';
    if (!form.lastName.trim()) return 'Informe seu sobrenome';
    if (!form.email.includes('@')) return 'E-mail inválido';
    if (form.phone.replace(/\D/g, '').length < 10) return 'Telefone inválido';
    if (cpfDigits.length !== 11) return 'CPF inválido (11 dígitos)';
    return null;
  }

  async function handleCheckout() {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setLoading(true);

    const phoneDigits = form.phone.replace(/\D/g, '');
    const areaCode = phoneDigits.slice(0, 2);
    const phoneNumber = phoneDigits.slice(2);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/mercadopago-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            unit_price: item.product.sale_price ?? item.product.price,
            image_url: item.product.images?.[0] ?? undefined,
          })),
          payer: {
            name: form.firstName.trim(),
            surname: form.lastName.trim(),
            email: form.email.trim(),
            phone: { area_code: areaCode, number: phoneNumber },
            identification: { type: 'CPF', number: form.cpf.replace(/\D/g, '') },
          },
          back_urls: {
            success: window.location.origin,
            failure: window.location.origin,
            pending: window.location.origin,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.init_point) {
        setError(data.error?.message ?? 'Erro ao gerar link de pagamento. Tente novamente.');
        setLoading(false);
        return;
      }

      clearCart();
      onClose();
      window.open(data.init_point, '_blank');
    } catch {
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed inset-0 z-[61] flex items-center justify-center px-4 py-6 pointer-events-none">
        <div
          className="w-full max-w-md bg-[#080808] border border-[#1a1a1a] rounded-2xl shadow-2xl flex flex-col max-h-full pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00b3ff]/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[#00b3ff]" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base">Finalizar Pedido</h2>
                <p className="text-gray-500 text-xs">Pague com PIX ou cartão</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-white/20 text-gray-400 hover:text-white transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Order summary */}
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 space-y-2">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Resumo do pedido</p>
              {items.map(item => (
                <div key={item.product.id} className="flex items-center justify-between gap-2">
                  <span className="text-gray-400 text-sm truncate flex-1">{item.product.name} × {item.quantity}</span>
                  <span className="text-white text-sm font-semibold flex-shrink-0">
                    {((item.product.sale_price ?? item.product.price) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              ))}
              <div className="border-t border-[#1a1a1a] pt-2 mt-2 flex justify-between">
                <span className="text-white font-bold text-sm">Total</span>
                <span className="text-[#00ff88] font-black text-base">
                  {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            {/* Payer form */}
            <div className="space-y-3">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Seus dados</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <User className="w-3 h-3" /> Nome
                  </label>
                  <input
                    value={form.firstName}
                    onChange={e => setField('firstName', e.target.value)}
                    placeholder="João"
                    className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00b3ff]/50 transition-colors placeholder:text-gray-700"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <User className="w-3 h-3" /> Sobrenome
                  </label>
                  <input
                    value={form.lastName}
                    onChange={e => setField('lastName', e.target.value)}
                    placeholder="Silva"
                    className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00b3ff]/50 transition-colors placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Mail className="w-3 h-3" /> E-mail
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  placeholder="joao@email.com"
                  className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00b3ff]/50 transition-colors placeholder:text-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Phone className="w-3 h-3" /> Telefone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setField('phone', formatPhone(e.target.value))}
                    placeholder="(66) 99999-9999"
                    className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00b3ff]/50 transition-colors placeholder:text-gray-700"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Hash className="w-3 h-3" /> CPF
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.cpf}
                    onChange={e => setField('cpf', formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00b3ff]/50 transition-colors placeholder:text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Payment methods info */}
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-3 flex items-center gap-3">
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-[#00b3ff]/10 border border-[#00b3ff]/20 text-[#00b3ff] text-xs font-bold rounded-lg">PIX</span>
                <span className="px-2 py-1 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-bold rounded-lg">Cartão</span>
              </div>
              <p className="text-gray-500 text-xs">Pagamento seguro via Mercado Pago</p>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-[#1a1a1a]">
            <button
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#00ff88] text-black font-bold text-base rounded-2xl hover:bg-[#00e67a] transition-all duration-200 shadow-[0_0_20px_rgba(0,255,136,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando link...
                </>
              ) : (
                <>
                  Ir para pagamento
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-gray-600 text-xs text-center mt-2">Você será redirecionado ao Mercado Pago</p>
          </div>
        </div>
      </div>
    </>
  );
}
