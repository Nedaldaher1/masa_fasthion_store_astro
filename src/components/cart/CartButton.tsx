import React from "react";
import { useCart } from "./CartContext";
import { Checkout } from "../../icons/react/checkout";

type Props = {
  standalone?: boolean;
};

function CartButtonInner() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition"
      aria-label="فتح السلة"
    >
      <Checkout className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}

// نسخة standalone تستخدم localStorage مباشرة
function CartButtonStandalone() {
  const [totalItems, setTotalItems] = React.useState(0);

  React.useEffect(() => {
    const updateCount = () => {
      const saved = localStorage.getItem("masa_fashion_cart");
      if (saved) {
        try {
          const items = JSON.parse(saved);
          const count = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setTotalItems(count);
        } catch (e) {
          setTotalItems(0);
        }
      }
    };

    updateCount();
    
    // استمع للتغييرات
    window.addEventListener("storage", updateCount);
    window.addEventListener("cart-updated", updateCount);
    
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cart-updated", updateCount);
    };
  }, []);

  const openCart = () => {
    window.dispatchEvent(new CustomEvent("open-cart"));
  };

  return (
    <button
      onClick={openCart}
      className="relative w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition"
      aria-label="فتح السلة"
    >
      <Checkout className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}

export default function CartButton({ standalone = false }: Props) {
  if (standalone) {
    return <CartButtonStandalone />;
  }
  return <CartButtonInner />;
}
