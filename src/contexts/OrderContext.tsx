import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { OrderContextType, Order, CustomerInfo, OrderSummary } from '../types/order';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const CART_KEY = 'hydrohub_order_cart';
const ORDER_KEY = 'hydrohub_order_final';

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  const addToCart = (catalogueItemId: string, quantity: number) => {
    const newCart = { ...cart };
    newCart[catalogueItemId] = (newCart[catalogueItemId] || 0) + quantity;
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  const removeFromCart = (catalogueItemId: string) => {
    const newCart = { ...cart };
    delete newCart[catalogueItemId];
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  const updateCartQuantity = (catalogueItemId: string, quantity: number) => {
    const newCart = { ...cart };
    if (quantity <= 0) {
      delete newCart[catalogueItemId];
    } else {
      newCart[catalogueItemId] = quantity;
    }
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem(CART_KEY);
  };

  const calculateSummary = (items: any[], prices: Record<string, number>) => {
    let subtotal = 0;
    items.forEach((item) => {
      const price = prices[item.id] || 0;
      subtotal += price * (cart[item.id] || 0);
    });
    
    const deliveryCharges = subtotal > 0 ? 50 : 0;
    const total = subtotal + deliveryCharges;

    setOrderSummary({
      items: items.map((item) => ({
        catalogueItemId: item.id,
        name: item.name,
        price: prices[item.id] || 0,
        quantity: cart[item.id] || 0,
        totalPrice: (prices[item.id] || 0) * (cart[item.id] || 0),
      })).filter(item => item.quantity > 0),
      subtotal,
      deliveryCharges,
      total,
    });
  };

  const saveOrder = (order: Order) => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  };

  const loadOrder = (): Order | null => {
    try {
      return JSON.parse(localStorage.getItem(ORDER_KEY) || 'null');
    } catch {
      return null;
    }
  };

  const value: OrderContextType = {
    currentStep,
    cart,
    customerInfo,
    orderSummary,
    setCurrentStep,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setCustomerInfo,
    calculateSummary,
    saveOrder,
    loadOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
