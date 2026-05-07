export interface QrData {
    raw: string;
    route?: string;
    timestamp?: number;
}

export type PaymentStep = 'scaneando' | 'pagando' | 'exito' | 'error';

export interface PaymentIntentResponse {
    clientSecret: string;
}