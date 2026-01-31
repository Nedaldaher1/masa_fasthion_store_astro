import  { useEffect, useMemo, useState } from "react";
import {Close} from  '../../icons/react/close';
import {Checkout} from  '../../icons/react/checkout';

type Props = {
  open: boolean;
  onClose: () => void;
  productName: string;
  colorName: string;
  size: string;
  price: string;
  whatsappPhone: string;
  onSubmitOrder?: () => void;
};

export default function OrderModal({
  open,
  onClose,
  productName,
  colorName,
  size,
  price,
  whatsappPhone,
  onSubmitOrder
}: Props) {
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [multipleItems, setMultipleItems] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const modalSizeText = useMemo(() => size || "غير محدد", [size]);

  if (!open) return null;

  function handleOverlayClick() {
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // نفس حقول required القديمة لكن بحماية إضافية
    if (!city.trim() || !address.trim() || weight === "" || height === "") return;

    let message = `مرحباً، أريد طلب منتج جديد 🛍️\n\n`;
    message += `🧥 *المنتج:* ${productName}\n`;
    message += `🎨 *اللون:* ${colorName}\n`;
    message += `📏 *المقاس:* ${modalSizeText}\n`;
    message += `💰 *السعر:* ${price}\n\n`;
    message += `🏙️ *المدينة:* ${city}\n`;
    message += `📍 *العنوان:* ${address}\n`;
    message += `⚖️ *الوزن:* ${weight} كغ\n`;
    message += `📐 *الطول:* ${height} سم\n`;

    if (multipleItems) {
      message += `\n⚠️ *ملاحظة:* أرغب بطلب أكثر من قطعة، أرجو التواصل معي للمساعدة`;
    }
    onSubmitOrder?.();
    
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();

  }

  return (
    <div
      className="fixed inset-0 z-100  flex items-center justify-center  bg-gray-900/60 backdrop-blur-sm transition-all duration-300 p-4 md:p-6"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative  w-full max-w-md mx-auto glass rounded-3xl shadow-2xl modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100/50 hover:bg-red-50 hover:text-red-500 text-gray-500 flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm"
          aria-label="إغلاق"
        >
          <Close  className="w-4 h-4" />
        </button>

        <div className="p-5 md:p-8">
          <div className="text-center mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-black/20 transform rotate-3">
              <Checkout className="w-6 h-6  text-white  " />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-textDark">إتمام الطلب</h3>
            <p className="text-textLight mt-1 text-xs md:text-sm">
              <span className="font-bold text-black">{productName}</span>
              <br />
              <span className="font-medium">{colorName}</span> |{" "}
              <span className="font-medium">{modalSizeText}</span>
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="relative group">
              <label className="block text-sm font-medium text-textDark mb-1 mr-1">
                المدينة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: عمان، الزرقاء، إربد..."
                className="w-full px-4 py-2.5 rounded-xl glass-input outline-none text-gray-800"
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-textDark mb-1 mr-1">
                عنوان المنطقة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="اسم المنطقة أو الحي"
                className="w-full px-4 py-2.5 rounded-xl glass-input outline-none text-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-textDark mb-1 mr-1">
                  الوزن (كغ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl glass-input outline-none  text-gray-800"
                  placeholder="120 كيلو"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textDark mb-1 mr-1">
                  الطول (سم) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={height}
                  onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl glass-input outline-none text-center text-gray-800"
                  placeholder="170 سم"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200/60">
              <input
                type="checkbox"
                className="w-5 h-5 mt-0.5 rounded accent-black cursor-pointer flex-shrink-0"
                checked={multipleItems}
                onChange={(e) => setMultipleItems(e.target.checked)}
                id="multipleItems"
              />
              <label
                htmlFor="multipleItems"
                className="text-sm text-amber-800 cursor-pointer leading-relaxed"
              >
                <span className="font-bold">أريد طلب أكثر من قطعة</span>
                <br />
                <span className="text-xs text-amber-600">
                  فعّل هذا الخيار ليتواصل معك فريق الدعم لمساعدتك
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 md:py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-3 mt-4"
            >
              <i className="fab fa-whatsapp text-xl md:text-2xl"></i>
              <span>إرسال الطلب</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
