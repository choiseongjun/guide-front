interface NicepayPaymentData {
  clientKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail: string;
  customerTel: string;
  returnUrl: string;
  failUrl: string;
  dbProcessUrl: string;
  cardCompany: string;
  cardQuota: string;
  language: string;
  displayMode: string;
}

interface Nicepay {
  requestPayment: (data: NicepayPaymentData) => void;
}

declare global {
  interface Window {
    Nicepay: Nicepay;
    checkNicepayLoaded?: () => void;
  }
}
