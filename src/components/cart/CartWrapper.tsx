import React, { useEffect } from "react";
import { CartProvider, useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";

type Props = {
  children: React.ReactNode;
  whatsappPhone: string;
};

function CartManager() {
  const { setIsCartOpen } = useCart();

  // استمع لأحداث فتح السلة
  useEffect(() => {
    const handleOpenCart = () => {
      setIsCartOpen(true);
    };

    const handleCartUpdated = () => {
      // السلة ستُحدث تلقائياً عبر useEffect في CartContext
    };

    window.addEventListener("open-cart", handleOpenCart);
    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("open-cart", handleOpenCart);
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, [setIsCartOpen]);

  return <CartDrawer />;
}

export default function CartWrapper({ children }: Props) {
  return (
    <CartProvider>
      {children}
      <CartManager />
    </CartProvider>
  );
}
