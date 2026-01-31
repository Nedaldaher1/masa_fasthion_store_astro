import React, { useState, useEffect } from "react";
import { CartProvider, useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";
import CartOrderModal from "./CartOrderModal";

type Props = {
  children: React.ReactNode;
  whatsappPhone: string;
};

function CartManager({ whatsappPhone }: { whatsappPhone: string }) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { setIsCartOpen, items } = useCart();

  // استمع لأحداث فتح السلة
  useEffect(() => {
    const handleOpenCart = () => {
      setIsCartOpen(true);
    };

    const handleCartUpdated = () => {
      // تحديث السلة من localStorage
      const saved = localStorage.getItem("masa_fashion_cart");
      if (saved) {
        // السلة ستُحدث تلقائياً عبر useEffect في CartContext
      }
    };

    window.addEventListener("open-cart", handleOpenCart);
    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("open-cart", handleOpenCart);
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, [setIsCartOpen]);

  return (
    <>
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />
      <CartOrderModal
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        whatsappPhone={whatsappPhone}
      />
    </>
  );
}

export default function CartWrapper({ children, whatsappPhone }: Props) {
  return (
    <CartProvider>
      {children}
      <CartManager whatsappPhone={whatsappPhone} />
    </CartProvider>
  );
}
