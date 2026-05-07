import { useState } from 'react';
import type { QrData, PaymentStep } from '../types';
import EscanerQR from '../componentes/EscanerQr';
import PagoStripe from '../componentes/PagoStripe';

function PagoCamion() {
  const [step, setStep] = useState<PaymentStep>('escaneando');
  const [qrData, setQrData] = useState<QrData | null>(null);

  const handleQrDetected = (data: QrData) => {
    setQrData(data);
    setStep('pagando');
  };

  const handlePagoExitoso = () => {
    setStep('exito');
    // Aquí podrías guardar el boleto en localStorage
    if (qrData) {
      localStorage.setItem('ultimoBoleto', JSON.stringify({
        qr: qrData,
        timestamp: new Date().toISOString(),
        validoHasta: new Date(Date.now() + 3600000).toISOString()
      }));
    }
  };

  const handleVolverInicio = () => {
    window.location.href = '/';
  };

  // Pantalla de escaneo
  if (step === 'escaneando') {
    return (
      <EscanerQR 
        onQrDetected={handleQrDetected} 
        onCancel={handleVolverInicio}
      />
    );
  }

  // Pantalla de pago
  if (step === 'pagando') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">🚍</span>
            <h2 className="text-xl font-semibold text-white">Completa tu pago</h2>
          </div>
          
          <div className="mb-4 rounded-lg bg-slate-800/50 p-3">
            <p className="text-sm text-slate-400">Ruta detectada</p>
            <p className="font-mono text-sm text-emerald-400">{qrData?.route || qrData?.raw}</p>
          </div>
          
          <PagoStripe amount={12} onSuccess={handlePagoExitoso} />
          
          <button 
            onClick={() => setStep('escaneando')}
            className="mt-4 w-full text-center text-sm text-slate-400 transition hover:text-white"
          >
            ← Volver a escanear
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de éxito
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
          <span className="text-5xl">✅</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white">¡Pago exitoso!</h2>
        
        <p className="mt-2 text-slate-300">
          Tu boleto es válido por 1 hora
        </p>
        
        <div className="mt-4 rounded-lg bg-slate-800/50 p-3">
          <p className="text-xs text-slate-400">Código de viaje</p>
          <p className="font-mono text-sm text-emerald-400 break-all">
            {qrData?.raw.substring(0, 40)}...
          </p>
        </div>
        
        <button
          onClick={handleVolverInicio}
          className="mt-6 rounded-full bg-emerald-500 px-6 py-2 font-semibold text-white transition hover:bg-emerald-400"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default PagoCamion;