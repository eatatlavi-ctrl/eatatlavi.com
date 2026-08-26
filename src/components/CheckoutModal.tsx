import React, { useState, useEffect, useCallback } from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, CheckCircle, Loader2, AlertCircle, ShieldCheck, Lock } from 'lucide-react';
import type { CartItem } from '../types';
import { useSquarePayment } from '../hooks/useSquarePayment';
import { MINIMUM_DELIVERY_SUBTOTAL } from '../config';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

type CheckoutStep = 'cart' | 'details' | 'payment' | 'confirmed';

interface OrderResult {
  orderId: string;
  receiptUrl?: string;
  estimatedTime: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { isLoaded, isProcessing, error: paymentError, initCard, processPayment, destroyCard } = useSquarePayment();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08875; // NYC tax rate
  const deliveryFee = fulfillment === 'delivery' && subtotal < 45 ? 5 : 0;
  const total = subtotal + tax + deliveryFee;

  const remainingForDelivery = MINIMUM_DELIVERY_SUBTOTAL - subtotal;
  const isDeliveryMinimumMet = fulfillment !== 'delivery' || remainingForDelivery <= 0;

  // Mount card form when entering payment step
  useEffect(() => {
    if (step === 'payment' && isLoaded) {
      const timer = setTimeout(() => { initCard(); }, 150);
      return () => clearTimeout(timer);
    }
    if (step !== 'payment') {
      destroyCard();
    }
  }, [step, isLoaded, initCard, destroyCard]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep('cart');
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
      setOrderResult(null);
      setSubmitError(null);
      destroyCard();
    }
  }, [isOpen, destroyCard]);

  const handlePlaceOrder = useCallback(async () => {
    setSubmitError(null);
    const cardToken = await processPayment();
    if (!cardToken) return;

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          cardToken,
          customerName,
          customerPhone,
          fulfillment,
          deliveryAddress: fulfillment === 'delivery' ? deliveryAddress : undefined,
          amountCents: Math.round(total * 100),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Order failed');

      setOrderResult({
        orderId: data.orderId,
        receiptUrl: data.receiptUrl,
        estimatedTime: fulfillment === 'pickup' ? '15–20 min' : '35–50 min',
      });
      setStep('confirmed');
      onClearCart();
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    }
  }, [cartItems, customerName, customerPhone, fulfillment, deliveryAddress, total, processPayment, onClearCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full sm:max-w-lg bg-[#09090B] border border-[#27272A] sm:rounded-none max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] shrink-0">
          <div>
            <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#A1A1AA]">LaVi Restaurant</p>
            <h2 className="font-serif text-lg font-light text-white uppercase tracking-wide">
              {step === 'cart' && 'Your Order'}
              {step === 'details' && 'Your Details'}
              {step === 'payment' && 'Secure Payment'}
              {step === 'confirmed' && 'Order Confirmed!'}
            </h2>
          </div>
          <button onClick={onClose} className="text-[#A1A1AA] hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP INDICATORS */}
        {step !== 'confirmed' && (
          <div className="flex items-center px-6 py-3 border-b border-[#27272A] space-x-2 shrink-0">
            {(['cart', 'details', 'payment'] as const).map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center space-x-1.5 ${step === s ? 'opacity-100' : ['cart', 'details', 'payment'].indexOf(step) > i ? 'opacity-60' : 'opacity-30'}`}>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${step === s ? 'border-[#D4AF37] text-[#D4AF37]' : ['cart','details','payment'].indexOf(step) > i ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-[#27272A] text-[#A1A1AA]'}`}>
                    {['cart','details','payment'].indexOf(step) > i ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider hidden sm:block ${step === s ? 'text-white' : 'text-[#A1A1AA]'}`}>
                    {s === 'cart' ? 'Order' : s === 'details' ? 'Details' : 'Payment'}
                  </span>
                </div>
                {i < 2 && <div className="flex-1 h-px bg-[#27272A]" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* STEP 1: CART */}
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-16 text-[#A1A1AA]">
                  <p className="font-serif text-lg">Your cart is empty.</p>
                  <p className="text-xs mt-1 font-mono tracking-wider">Browse the menu and add items.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border border-[#27272A] p-3.5">
                        <div className="flex-1 mr-3">
                          <p className="font-serif text-sm text-white">{item.name}</p>
                          {item.options && <p className="text-[11px] text-[#A1A1AA]">{item.options}</p>}
                          <p className="text-xs font-mono text-[#D4AF37] mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center border border-[#27272A]">
                            <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-2 py-1.5 text-[#A1A1AA] hover:text-white transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono text-white">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-2 py-1.5 text-[#A1A1AA] hover:text-white transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => onRemoveItem(item.id)} className="text-red-400/60 hover:text-red-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FULFILLMENT TOGGLE */}
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#A1A1AA] mb-2">Fulfillment</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(['pickup', 'delivery'] as const).map((f) => (
                        <button key={f} onClick={() => setFulfillment(f)}
                          className={`py-3 text-xs font-mono uppercase tracking-wider transition-all border ${fulfillment === f ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#27272A] text-[#A1A1AA] hover:border-white hover:text-white'}`}>
                          {f === 'pickup' ? '🏪 Pickup' : '🚚 Delivery'}
                        </button>
                      ))}
                    </div>
                    {fulfillment === 'delivery' && subtotal < 45 && (
                      <p className="text-[10px] text-[#A1A1AA] mt-1.5 font-mono">+$5.00 delivery fee (free over $45)</p>
                    )}
                    {fulfillment === 'delivery' && subtotal >= 45 && (
                      <p className="text-[10px] text-[#D4AF37] mt-1.5 font-mono">✓ Free local delivery unlocked!</p>
                    )}
                  </div>

                  {/* ORDER SUMMARY */}
                  <div className="border-t border-[#27272A] pt-4 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-[#A1A1AA]">
                      <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#A1A1AA]">
                      <span>Tax (8.875%)</span><span>${tax.toFixed(2)}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <div className="flex justify-between text-[#A1A1AA]">
                        <span>Delivery</span><span>${deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-bold pt-1 border-t border-[#27272A]">
                      <span>Total</span><span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* STEP 2: DETAILS */}
          {step === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-[0.25em] uppercase text-[#A1A1AA] mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full bg-transparent border border-[#27272A] focus:border-[#D4AF37] text-white text-sm px-4 py-3 outline-none transition-colors placeholder:text-[#3F3F46] font-sans"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-[0.25em] uppercase text-[#A1A1AA] mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(347) 000-0000"
                  className="w-full bg-transparent border border-[#27272A] focus:border-[#D4AF37] text-white text-sm px-4 py-3 outline-none transition-colors placeholder:text-[#3F3F46] font-sans"
                />
              </div>
              {fulfillment === 'delivery' && (
                <div>
                  <label className="block text-[10px] font-mono tracking-[0.25em] uppercase text-[#A1A1AA] mb-1.5">Delivery Address *</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="123 Main St, Staten Island, NY"
                    className="w-full bg-transparent border border-[#27272A] focus:border-[#D4AF37] text-white text-sm px-4 py-3 outline-none transition-colors placeholder:text-[#3F3F46] font-sans"
                  />
                </div>
              )}

              {/* Order recap */}
              <div className="border border-[#27272A] p-4 space-y-1">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#A1A1AA] mb-2">Order Recap</p>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs font-mono text-[#A1A1AA]">
                    <span>{item.name} ×{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-mono text-white font-bold pt-2 border-t border-[#27272A] mt-2">
                  <span>Total</span><span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <Lock className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase">256-bit SSL Encrypted · Powered by Square</span>
              </div>

              {/* Square card form mounts here */}
              <div>
                <label className="block text-[10px] font-mono tracking-[0.25em] uppercase text-[#A1A1AA] mb-2">Card Details</label>
                <div id="square-card-container" className="min-h-[90px]" />
                {!isLoaded && (
                  <div className="flex items-center space-x-2 text-[#A1A1AA] mt-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-mono">Loading secure payment form…</span>
                  </div>
                )}
              </div>

              {(paymentError || submitError) && (
                <div className="flex items-start space-x-2 border border-red-500/40 bg-red-500/10 p-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400 font-mono">{paymentError || submitError}</p>
                </div>
              )}

              {/* Final total */}
              <div className="border border-[#27272A] p-4 space-y-1">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#A1A1AA] mb-2">Charging Today</p>
                <div className="flex justify-between text-sm font-mono text-white font-bold">
                  <span>Total</span><span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-[#A1A1AA] mt-1">
                  {fulfillment === 'pickup' ? '🏪 Pickup @ 500 Henderson Ave · ~15–20 min' : '🚚 Local Delivery · ~35–50 min'}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-[#3F3F46]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[10px] font-mono">Your card info is never stored on our servers.</span>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMED */}
          {step === 'confirmed' && orderResult && (
            <div className="text-center py-8 space-y-5">
              <CheckCircle className="w-14 h-14 text-[#D4AF37] mx-auto" />
              <div>
                <h3 className="font-serif text-2xl font-light text-white">Thank You!</h3>
                <p className="text-sm text-[#A1A1AA] mt-1">Your order has been placed successfully.</p>
              </div>
              <div className="border border-[#D4AF37]/30 p-5 text-left space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#A1A1AA] uppercase tracking-wider">Order #</span>
                  <span className="text-white">{orderResult.orderId.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#A1A1AA] uppercase tracking-wider">Est. Time</span>
                  <span className="text-[#D4AF37]">{orderResult.estimatedTime}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#A1A1AA] uppercase tracking-wider">Fulfillment</span>
                  <span className="text-white capitalize">{fulfillment}</span>
                </div>
              </div>
              {orderResult.receiptUrl && (
                <a href={orderResult.receiptUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-block text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] underline">
                  View Receipt →
                </a>
              )}
              <p className="text-[11px] text-[#A1A1AA] font-mono">
                Questions? Call us: <a href="tel:3479343040" className="text-white">(347) 934-3040</a>
              </p>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        {step !== 'confirmed' && cartItems.length > 0 && (
          <div className="px-6 py-4 border-t border-[#27272A] shrink-0 space-y-2">
            {step === 'cart' && (
              <button onClick={() => setStep('details')}
                className="w-full bg-white text-black font-bold text-xs tracking-[0.2em] uppercase py-4 flex items-center justify-center space-x-2 hover:bg-[#D4AF37] transition-colors">
                <span>Continue to Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {step === 'details' && (
              <button
                onClick={() => setStep('payment')}
                disabled={!customerName.trim() || !customerPhone.trim() || (fulfillment === 'delivery' && !deliveryAddress.trim())}
                className="w-full bg-white text-black font-bold text-xs tracking-[0.2em] uppercase py-4 flex items-center justify-center space-x-2 hover:bg-[#D4AF37] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {step === 'payment' && (
              <>
                {fulfillment === 'delivery' && remainingForDelivery > 0 && (
                  <div className="text-center mb-2">
                    <p className="text-[10px] text-red-400 font-mono bg-red-500/10 border border-red-500/40 p-2">
                      Delivery orders require a ${MINIMUM_DELIVERY_SUBTOTAL} minimum — add ${remainingForDelivery.toFixed(2)} more to checkout.
                    </p>
                  </div>
                )}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !isLoaded || !isDeliveryMinimumMet}
                  className="w-full bg-[#D4AF37] text-black font-bold text-xs tracking-[0.2em] uppercase py-4 flex items-center justify-center space-x-2 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Processing…</span></>
                  ) : (
                    <><Lock className="w-3.5 h-3.5" /><span>Place Order · ${total.toFixed(2)}</span></>
                  )}
                </button>
              </>
            )}
            {step !== 'cart' && (
              <button onClick={() => setStep(step === 'payment' ? 'details' : 'cart')}
                className="w-full text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] hover:text-white py-1 transition-colors">
                ← Back
              </button>
            )}
          </div>
        )}
        {step === 'confirmed' && (
          <div className="px-6 py-4 border-t border-[#27272A] shrink-0">
            <button onClick={onClose}
              className="w-full border border-[#27272A] text-white font-bold text-xs tracking-[0.2em] uppercase py-4 hover:border-white transition-colors">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
