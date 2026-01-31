import React, { useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { Close } from "../../icons/react/close";
import { trackInitiateCheckout } from "../../utils/metaPixel";

type Props = {
  onCheckout: () => void;
};

export default function CartDrawer({ onCheckout }: Props) {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  // تتبع فتح السلة مرة واحدة فقط
  const hasTrackedCheckout = useRef(false);
  
  useEffect(() => {
    if (isCartOpen && items.length > 0 && !hasTrackedCheckout.current) {
      trackInitiateCheckout({
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          price: parseFloat(item.price.replace(/[^\d.]/g, "")) || 0,
          quantity: item.quantity,
        })),
        totalValue: totalPrice,
        numItems: totalItems,
      });
      hasTrackedCheckout.current = true;
    }
    if (!isCartOpen) {
      hasTrackedCheckout.current = false;
    }
  }, [isCartOpen, items, totalPrice, totalItems]);

  // منع السكرول عند فتح السلة
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-[100] flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-textDark">
            سلة التسوق ({totalItems})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-shopping-bag text-6xl text-gray-200 mb-4"></i>
              <p className="text-textLight">السلة فارغة</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-black underline hover:no-underline"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            items.map((item, index) => {
              // حساب السعر المخفض
              const originalPrice = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
              const discountedPrice = totalItems > 1 ? originalPrice - 2 : originalPrice;
              
              return (
              <div
                key={`${item.productId}-${item.colorName}-${item.size}-${index}`}
                className="flex gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100"
              >
                {/* صورة المنتج */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* تفاصيل المنتج */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-textDark text-sm truncate">
                    {item.productName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <span className="text-xs text-textLight">{item.colorName}</span>
                    {item.size && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-textLight">مقاس {item.size}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black">{discountedPrice.toFixed(2)} د.أ</span>
                      {totalItems > 1 && (
                        <span className="text-xs text-gray-400 line-through">{originalPrice.toFixed(2)} د.أ</span>
                      )}
                    </div>
                    
                    {/* تحكم بالكمية */}
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.colorName, item.size, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-lg transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.colorName, item.size, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-lg transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* زر الحذف */}
                <button
                  onClick={() => removeItem(item.productId, item.colorName, item.size)}
                  className="text-red-500 hover:text-red-700 transition self-start"
                >
                  <i className="fas fa-trash-alt text-sm"></i>
                </button>
              </div>
            );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            {totalItems > 1 && (
              <div className="flex items-center justify-between text-sm text-textLight">
                <span>أجور التوصيل:</span>
                <span>2.00 د.أ</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-textLight">المجموع:</span>
              <span className="text-2xl font-bold text-black">
                {totalPrice.toFixed(2)} د.أ
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-xl flex items-center justify-center gap-2"
            >
              <span>إتمام الطلب</span>
              <i className="fas fa-arrow-left text-sm"></i>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
