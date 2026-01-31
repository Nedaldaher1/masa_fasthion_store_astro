import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  productName: string;
  nameItemInStorage: string;
  colorName: string;
  colorHex: string;
  size: string;
  sizeDimensions?: string;
  price: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, colorName: string, size: string) => void;
  updateQuantity: (productId: string, colorName: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "masa_fashion_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // تحميل السلة من localStorage عند البدء
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadCart = () => {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          try {
            setItems(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse cart from localStorage");
          }
        }
      };

      loadCart();

      // استمع للتحديثات من المكونات الأخرى
      const handleCartUpdated = () => {
        loadCart();
      };

      window.addEventListener("cart-updated", handleCartUpdated);
      window.addEventListener("storage", handleCartUpdated);

      return () => {
        window.removeEventListener("cart-updated", handleCartUpdated);
        window.removeEventListener("storage", handleCartUpdated);
      };
    }
  }, []);

  // حفظ السلة في localStorage عند التغيير
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.colorName === newItem.colorName &&
          item.size === newItem.size
      );

      if (existingIndex > -1) {
        // زيادة الكمية إذا كان المنتج موجود
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      // إضافة منتج جديد
      return [...prev, { ...newItem, quantity: 1 }];
    });
    
    // فتح السلة تلقائياً عند الإضافة
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, colorName: string, size: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.colorName === colorName && item.size === size)
      )
    );
  };

  const updateQuantity = (productId: string, colorName: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId, colorName, size);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.colorName === colorName && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = (() => {
    const itemsTotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
      // إذا كان إجمالي المنتجات أكبر من 1، ينقص من كل منتج 2 دينار
      const discountedPrice = totalItems > 1 ? price - 2 : price;
      return sum + discountedPrice * item.quantity;
    }, 0);
    // إضافة 2 دينار أجور توصيل إذا كان هناك أكثر من منتج
    const deliveryFee = totalItems > 1 ? 2 : 0;
    return itemsTotal + deliveryFee;
  })();

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
