import { useState, useEffect } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements} from '@stripe/react-stripe-js';

// Tipos para las props
interface PagoStripeProps {
  amount: number;
  onSuccess: () => void;
  qrData?: string;
}

// Tipos para el formulario interno
interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
}

// Cliente de Stripe (se carga una sola vez)
const stripePromise: Promise<Stripe | null> = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Componente interno del formulario
function PaymentForm({ amount, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Crear el PaymentIntent al cargar el componente
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('http://localhost:5252/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount })
        });
        
        if (!response.ok) {
          throw new Error('Error al crear el pago');
        }
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Error de conexión');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setMessage('Cargando sistema de pagos...');
      return;
    }

    setProcessing(true);
    setMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pago-exitoso`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || 'Error al procesar el pago');
      setProcessing(false);
    } else {
      // Pago exitoso
      onSuccess();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-2 text-slate-400">Preparando pago...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return <p className="text-red-400 text-center">Error al iniciar el pago</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Procesando...
          </span>
        ) : (
          `Pagar $${amount.toFixed(2)} MXN`
        )}
      </button>
      {message && <p className="text-red-400 text-sm text-center">{message}</p>}
    </form>
  );
}

// Componente principal
export default function PagoStripe({ amount, onSuccess }: PagoStripeProps) {
  const [stripeInitialized, setStripeInitialized] = useState(false);

  useEffect(() => {
    stripePromise.then(() => setStripeInitialized(true));
  }, []);

  if (!stripeInitialized) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-3 text-slate-400">Cargando pasarela de pagos...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ locale: 'es' }}>
      <PaymentForm amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}