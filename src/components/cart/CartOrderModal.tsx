import React, { useState } from "react";
import { useCart, type CartItem } from "./CartContext";
import { Close } from "../../icons/react/close";
import { trackPurchase } from "../../utils/metaPixel";
import { productsData } from "../product/productsData";

type Props = {
  open: boolean;
  onClose: () => void;
  whatsappPhone: string;
  onSubmitOrder?: () => void;
};

const GOVERNORATES = [
  "عمان",
  "إربد",
  "الزرقاء",
  "العقبة",
  "السلط",
  "المفرق",
  "الكرك",
  "جرش",
  "مادبا",
  "عجلون",
  "معان",
  "الطفيلة",
];

export default function CartOrderModal({ open, onClose, whatsappPhone, onSubmitOrder }: Props) {
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // حساب إجمالي عدد المنتجات
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const hasDiscount = totalQuantity > 1;

    // بناء رسالة الواتساب
    const itemsText = items
      .map((item, i) => {
        const originalPrice = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
        const discountedPrice = hasDiscount ? originalPrice - 2 : originalPrice;
        const itemTotal = discountedPrice * item.quantity;
        return `${i + 1}. ${item.nameItemInStorage}\n   اللون: ${item.colorName}\n   المقاس: ${item.size || "غير محدد"}\n   الكمية: ${item.quantity}\n   السعر: ${itemTotal.toFixed(2)} د.أ`;
      })
      .join("\n\n");

    // حساب أجور التوصيل
    const deliveryFee = hasDiscount ? 2 : 0;
    const deliveryText = hasDiscount ? `\n\n*أجور التوصيل: 2.00 د.أ*` : "";

    const message = `
*طلب جديد من ماسة فيشن* 🛍️

*بيانات العميل:*
━━━━━━━━━━━━━━
الاسم: ${name}
الهاتف: ${phone}
المحافظة: ${governorate}
العنوان: ${address}
${notes ? `ملاحظات: ${notes}` : ""}

*المنتجات المطلوبة:*
━━━━━━━━━━━━━━
${itemsText}${deliveryText}

━━━━━━━━━━━━━━
*المجموع الكلي: ${totalPrice.toFixed(2)} د.أ*
━━━━━━━━━━━━━━
    `.trim();

    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // تتبع Purchase في Meta Pixel
    trackPurchase({
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        nameItemInStorage: item.nameItemInStorage,
        category: productsData[item.productId]?.category || "عبايات",
        colorName: item.colorName,
        price: parseFloat(item.price.replace(/[^\d.]/g, "")) || 0,
        quantity: item.quantity,
      })),
      totalValue: totalPrice,
      numItems: totalQuantity,
    });

    onSubmitOrder?.();
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-textDark">إتمام الطلب</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        {/* ملخص الطلب */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-bold text-textDark mb-3">ملخص الطلب ({items.length} منتج)</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {items.map((item, index) => {
              const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
              const hasDiscount = totalQuantity > 1;
              const originalPrice = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
              const discountedPrice = hasDiscount ? originalPrice - 2 : originalPrice;
              
              return (
              <div
                key={`${item.productId}-${item.colorName}-${item.size}-${index}`}
                className="flex items-center gap-3 text-sm"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.productName}</p>
                  <p className="text-textLight text-xs">
                    {item.colorName} {item.size && `• مقاس ${item.size}`} • الكمية: {item.quantity}
                  </p>
                </div>
                <div className="text-left">
                  <span className="font-bold">{discountedPrice.toFixed(2)} د.أ</span>
                  {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through mr-1">{originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
            );
            })}
          </div>
          {items.reduce((sum, i) => sum + i.quantity, 0) > 1 && (
            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center text-sm text-textLight">
              <span>أجور التوصيل:</span>
              <span>2.00 د.أ</span>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="font-bold text-textDark">المجموع:</span>
            <span className="text-xl font-bold text-black">{totalPrice.toFixed(2)} د.أ</span>
          </div>
        </div>

        {/* نموذج البيانات */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-textDark mb-2">
              الاسم الكامل *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
              placeholder="أدخل اسمك الكامل"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-textDark mb-2">
              رقم الهاتف *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition text-left"
              placeholder="07XXXXXXXX"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-textDark mb-2">
              المحافظة *
            </label>
            <select
              required
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition bg-white"
            >
              <option value="">اختر المحافظة</option>
              {GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-textDark mb-2">
              العنوان التفصيلي *
            </label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition resize-none"
              placeholder="المنطقة، الشارع، رقم البناية..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-textDark mb-2">
              ملاحظات إضافية
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition resize-none"
              placeholder="أي ملاحظات خاصة بالطلب..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition shadow-xl flex items-center justify-center gap-3"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
            <span>إرسال الطلب عبر واتساب</span>
          </button>
        </form>
      </div>
    </div>
  );
}
