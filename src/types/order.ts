export interface OrderItem {
  catalogueItemId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  total: number;
}

export interface Order {
  id?: string;
  items: Record<string, number>; // catalogueItemId -> quantity
  customer: CustomerInfo;
  orderSummary: OrderSummary;
  createdAt: number;
  status: 'draft' | 'confirmed';
}

export interface OrderContextType {
  currentStep: number;
  cart: Record<string, number>;
  customerInfo: CustomerInfo | null;
  orderSummary: OrderSummary | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  addToCart: (catalogueItemId: string, quantity: number) => void;
  removeFromCart: (catalogueItemId: string) => void;
  updateCartQuantity: (catalogueItemId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  calculateSummary: (items: any[], prices: Record<string, number>) => void;
  saveOrder: (order: Order) => void;
  loadOrder: () => Order | null;
}
