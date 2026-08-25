import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client, Environment, ApiError } from 'square';
import { randomUUID } from 'crypto';

// Square client — Access Token is ONLY here on the server, never sent to browser
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.SQUARE_ACCESS_TOKEN?.startsWith('sandbox')
      ? Environment.Sandbox
      : Environment.Production,
});

const LOCATION_ID = process.env.SQUARE_LOCATION_ID || 'L1P9ANWYC0THW';

interface CartItem {
  name: string;
  price: number;   // dollars
  quantity: number;
  options?: string;
}

interface OrderRequest {
  cartItems: CartItem[];
  cardToken: string;
  customerName: string;
  customerPhone: string;
  fulfillment: 'pickup' | 'delivery';
  deliveryAddress?: string;
  amountCents: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers (for local dev)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    cartItems,
    cardToken,
    customerName,
    customerPhone,
    fulfillment,
    deliveryAddress,
    amountCents,
  } = req.body as OrderRequest;

  // Basic validation
  if (!cartItems?.length || !cardToken || !customerName || !customerPhone) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // ── STEP 1: Create Order via Square Orders API ──────────────────
    const lineItems = cartItems.map((item) => ({
      name: item.name,
      quantity: String(item.quantity),
      basePriceMoney: {
        amount: BigInt(Math.round(item.price * 100)),
        currency: 'USD' as const,
      },
      ...(item.options ? { note: item.options } : {}),
    }));

    const { result: orderResult } = await client.ordersApi.createOrder({
      order: {
        locationId: LOCATION_ID,
        lineItems,
        fulfillments: [
          {
            type: fulfillment === 'pickup' ? ('PICKUP' as const) : ('DELIVERY' as const),
            ...(fulfillment === 'pickup'
              ? {
                  pickupDetails: {
                    recipient: { displayName: customerName, phoneNumber: customerPhone },
                    pickupAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
                  },
                }
              : {
                  deliveryDetails: {
                    recipient: { displayName: customerName, phoneNumber: customerPhone },
                    ...(deliveryAddress
                      ? { deliverTo: { displayName: deliveryAddress } as any }
                      : {}),
                  },
                }),
          },
        ],
      },
      idempotencyKey: randomUUID(),
    });

    const orderId = orderResult.order?.id;
    if (!orderId) throw new Error('Failed to create order.');

    // ── STEP 2: Process Payment via Square Payments API ─────────────
    const { result: paymentResult } = await client.paymentsApi.createPayment({
      sourceId: cardToken,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(amountCents),
        currency: 'USD',
      },
      orderId,
      locationId: LOCATION_ID,
      buyerEmailAddress: undefined, // optional — add if collected
      note: `LaVi Order — ${fulfillment} — ${customerName}`,
    });

    const payment = paymentResult.payment;
    if (!payment) throw new Error('Payment failed.');

    return res.status(200).json({
      orderId,
      paymentId: payment.id,
      receiptUrl: payment.receiptUrl ?? null,
      status: payment.status,
    });
  } catch (error) {
    console.error('Square API error:', error);
    if (error instanceof ApiError) {
      const msg = error.errors?.[0]?.detail || error.message;
      return res.status(400).json({ error: msg });
    }
    return res.status(500).json({ error: 'Order could not be processed. Please try again.' });
  }
}
