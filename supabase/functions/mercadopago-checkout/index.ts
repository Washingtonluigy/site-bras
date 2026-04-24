import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CartItem {
  name: string;
  quantity: number;
  unit_price: number;
  image_url?: string;
}

interface CheckoutBody {
  items: CartItem[];
  payer: {
    name: string;
    surname: string;
    email: string;
    phone: { area_code: string; number: string };
    identification: { type: string; number: string };
  };
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  external_reference?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    if (!ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: "MP_ACCESS_TOKEN not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: CheckoutBody = await req.json();
    const { items, payer, back_urls, external_reference } = body;

    const preference = {
      items: items.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "BRL",
        ...(item.image_url ? { picture_url: item.image_url } : {}),
      })),
      payer,
      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" },
        ],
        installments: 12,
      },
      back_urls: back_urls ?? {
        success: "https://brazcell.com.br/",
        failure: "https://brazcell.com.br/",
        pending: "https://brazcell.com.br/",
      },
      auto_return: "approved",
      external_reference: external_reference ?? "",
      statement_descriptor: "BRAZCELL",
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ init_point: data.init_point, sandbox_init_point: data.sandbox_init_point, id: data.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
