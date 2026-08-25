import { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    Square: {
      payments: (appId: string, locationId: string) => Promise<SquarePayments>;
    };
  }
}

interface SquarePayments {
  card: (options?: object) => Promise<SquareCard>;
}

interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: { message: string }[] }>;
  destroy: () => Promise<void>;
}

interface UseSquarePaymentReturn {
  isLoaded: boolean;
  isProcessing: boolean;
  error: string | null;
  initCard: () => Promise<void>;
  processPayment: () => Promise<string | null>;
  destroyCard: () => Promise<void>;
}

const APP_ID = (import.meta.env.VITE_SQUARE_APP_ID as string) || 'sq0idp-xjhiVAQmz57KPGdn7CQGMw';
const LOCATION_ID = (import.meta.env.VITE_SQUARE_LOCATION_ID as string) || 'L1P9ANWYC0THW';

export function useSquarePayment(): UseSquarePaymentReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentsRef = useRef<SquarePayments | null>(null);
  const cardRef = useRef<SquareCard | null>(null);

  useEffect(() => {
    // Poll until Square SDK is available from the <script> tag
    const interval = setInterval(() => {
      if (window.Square) {
        clearInterval(interval);
        setIsLoaded(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const initCard = useCallback(async () => {
    if (!window.Square) return;
    setError(null);
    try {
      paymentsRef.current = await window.Square.payments(APP_ID, LOCATION_ID);
      cardRef.current = await paymentsRef.current.card({
        style: {
          '.input-container': { borderColor: '#27272A', borderRadius: '0px' },
          '.input-container.is-focus': { borderColor: '#D4AF37' },
          '.input-container.is-error': { borderColor: '#ef4444' },
          input: { backgroundColor: 'transparent', color: '#FFFFFF', fontSize: '14px' },
          'input::placeholder': { color: '#71717A' },
          '.message-icon': { color: '#D4AF37' },
          '.message-text': { color: '#A1A1AA' },
        },
      });
      await cardRef.current.attach('#square-card-container');
    } catch (err) {
      setError('Could not load payment form. Please try refreshing.');
      console.error('Square card init error:', err);
    }
  }, []);

  const processPayment = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await cardRef.current.tokenize();
      if (result.status === 'OK' && result.token) {
        return result.token;
      }
      const msg = result.errors?.map((e) => e.message).join(', ') || 'Card verification failed.';
      setError(msg);
      return null;
    } catch (err) {
      setError('Payment processing error. Please try again.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const destroyCard = useCallback(async () => {
    if (cardRef.current) {
      try {
        await cardRef.current.destroy();
      } catch (_) { /* ignore */ }
      cardRef.current = null;
    }
  }, []);

  return { isLoaded, isProcessing, error, initCard, processPayment, destroyCard };
}
