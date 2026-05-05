import React, { createContext, useContext, useState } from 'react';

export interface Medicine {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (medicine: Medicine) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (medicine: Medicine) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === medicine.id);
      if (existing) {
        return prev.map((i) => i.id === medicine.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
