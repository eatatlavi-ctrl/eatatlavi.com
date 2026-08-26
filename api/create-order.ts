// @ts-nocheck
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SquareClient as Client, SquareEnvironment as Environment } from 'square';
import { randomUUID } from 'crypto';
import { MINIMUM_DELIVERY_SUBTOTAL } from '../src/config';

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

  try {
    const client = new Client({
      token: process.env.SQUARE_ACCESS_TOKEN || '',
      environment: process.env.SQUARE_ACCESS_TOKEN?.startsWith('sandbox')
        ? Environment.Sandbox
        : Environment.Production,
    });
    const LOCATION_ID = process.env.SQUARE_LOCATION_ID || 'L1P9ANWYC0THW';

    const {
      cartItems,
      cardToken,
      customerName,
      customerPhone,
      fulfillment,
      deliveryAddress,
    } = req.body as OrderRequest;

    // Basic validation
    if (!cartItems?.length || !cardToken || !customerName || !customerPhone) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // ── STEP 1: Create Order via Square Orders API ──────────────────
    const subtotalCents = cartItems.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);

    // Enforce delivery minimum
    if (fulfillment === 'delivery' && subtotalCents < MINIMUM_DELIVERY_SUBTOTAL * 100) {
      return res.status(400).json({ error: `Delivery orders require a $${MINIMUM_DELIVERY_SUBTOTAL.toFixed(2)} minimum.` });
    }

    const hasDeliveryFee = fulfillment === 'delivery' && subtotalCents < 4500;

    const lineItems = cartItems.map((item) => ({
      name: item.name,
      quantity: String(item.quantity),
      basePriceMoney: {
        amount: BigInt(Math.round(item.price * 100)),
        currency: 'USD' as const,
      },
      ...(item.options ? { note: item.options } : {}),
    }));

    const { order } = await client.orders.create({
      order: {
        locationId: LOCATION_ID,
        lineItems,
        taxes: [
          {
            name: 'NYC Sales Tax',
            percentage: '8.875',
            scope: 'ORDER',
          },
        ],
        serviceCharges: hasDeliveryFee ? [
          {
            name: 'Delivery Fee',
            amountMoney: {
              amount: BigInt(500),
              currency: 'USD',
            },
            calculationPhase: 'TOTAL_PHASE',
          },
        ] : [],
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

    const orderId = order?.id;
    if (!orderId) throw new Error('Failed to create order.');

    // ── STEP 2: Process Payment via Square Payments API ─────────────
    const finalAmount = order?.totalMoney?.amount;
    if (!finalAmount) throw new Error('Order total could not be determined.');

    const { payment } = await client.payments.create({
      sourceId: cardToken,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: finalAmount,
        currency: 'USD',
      },
      orderId,
      locationId: LOCATION_ID,
      buyerEmailAddress: undefined, // optional — add if collected
      note: `LaVi Order — ${fulfillment} — ${customerName}`,
    });

    if (!payment) throw new Error('Payment failed.');

    return res.status(200).json({
      orderId,
      paymentId: payment.id,
      receiptUrl: payment.receiptUrl ?? null,
      status: payment.status,
    });
  } catch (error: any) {
    console.error('Square API error or syntax crash:', error);
    
    // Check if it's a Square API error
    if (error && typeof error === 'object' && 'errors' in error) {
      const msg = error.errors?.[0]?.detail || error.message;
      return res.status(400).json({ error: msg });
    }
    
    // Handle BigInt serialization crash issue natively just in case error message has BigInt
    return res.status(500).json({ 
      error: 'Order could not be processed. Please try again.',
      details: error?.message || String(error)
    });
  }
}
