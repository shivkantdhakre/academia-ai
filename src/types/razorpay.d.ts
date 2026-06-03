declare module 'razorpay' {
  const Razorpay: any;
  export default Razorpay;
}

interface RazorpayOptions {
  key: string | undefined;
  amount?: number;
  currency?: string;
  name: string;
  description: string;
  order_id?: string;
  subscription_id?: string;
  prefill?: { email: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color: string };
  handler?: (response: any) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: any) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export {};
