export interface QrData {
    raw: string;
    route?: string;
    timestamp?: number;
}

export type PaymentStep = 'escaneando' | 'pagando' | 'exito' | 'error';

export interface PaymentIntentResponse {
    clientSecret: string;
}