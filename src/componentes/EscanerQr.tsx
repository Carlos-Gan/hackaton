import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';  // 👈 Cambio aquí
import { isMobile, getCameraFacingMode } from '../utils/detectDevice';
import type { QrData } from '../types';

interface EscanerQRProps {
  onQrDetected: (data: QrData) => void;
  onCancel: () => void;
}

function EscanerQR({ onQrDetected, onCancel }: EscanerQRProps) {
  const [error, setError] = useState<string | null>(null);

  const handleScan = (detectedCodes: any[]) => { 
    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue; 
      onQrDetected({
        raw: result,
        route: extractRouteFromQR(result),
        timestamp: Date.now()
      });
    }
  };

  const extractRouteFromQR = (qr: string): string => {
    const match = qr.match(/RUTA:([A-Z0-9-]+)/i);
    return match ? match[1] : 'Ruta no identificada';
  };

  const handleError = (err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'Error con la cámara';
    setError(errorMessage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 p-4">
        <button
          onClick={onCancel}
          className="absolute -top-3 -right-3 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
          aria-label="Cerrar"
        >
          ✕
        </button>
        
        <h3 className="mb-4 text-center text-lg font-semibold text-white">
          Escanea el código QR del camión
        </h3>
        
        <div className="overflow-hidden rounded-xl">
          <Scanner
            onScan={handleScan}          
            onError={handleError}
            constraints={{ 
              facingMode: getCameraFacingMode()
            }}
            scanDelay={500}              
          />
        </div>
        
        {error && (
          <p className="mt-3 text-center text-sm text-red-400">
            ⚠️ {error}
            <br />
            <span className="text-xs text-slate-400">
              Asegúrate de permitir el acceso a la cámara
            </span>
          </p>
        )}
        
        <p className="mt-4 text-center text-xs text-slate-400">
          {isMobile() 
            ? "📱 Apunta al QR que está pegado en el camión"
            : "💻 Muestra el QR frente a tu cámara web"}
        </p>
      </div>
    </div>
  );
}

export default EscanerQR;