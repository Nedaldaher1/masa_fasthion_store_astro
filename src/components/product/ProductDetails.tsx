import type { Product } from "./productsData";
import { Star } from "../../icons/react/star";
import { trackAddToCart } from "../../utils/metaPixel";
import { generateEventId, serverTrackAddToCart } from "../../utils/backendApi";

type Props = {
  product: Product;
  productId: string;
  selectedColorIndex: number;
  selectedColorName: string;
  selectedColorImage: string; // الصورة المحسّنة من Astro
  selectedColorOutofstock?: boolean; // هل اللون المختار غير متوفر
  selectedSize: string;
  onSelectSize: (size: string) => void;
};

type CartItem = {
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

const CART_STORAGE_KEY = "masa_fashion_cart";

function addToCart(newItem: Omit<CartItem, "quantity">) {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  let items: CartItem[] = [];
  
  if (saved) {
    try {
      items = JSON.parse(saved);
    } catch (e) {
      items = [];
    }
  }

  const existingIndex = items.findIndex(
    (item) =>
      item.productId === newItem.productId &&
      item.colorName === newItem.colorName &&
      item.size === newItem.size
  );

  if (existingIndex > -1) {
    items[existingIndex].quantity += 1;
  } else {
    items.push({ ...newItem, quantity: 1 });
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  
  // توليد Event ID للتخلص من التكرار
  const eventId = generateEventId();
  const price = parseFloat(newItem.price.replace(/[^\d.]/g, "")) || 0;
  
  // تتبع AddToCart في Meta Pixel (Client-side)
  trackAddToCart({
    productId: newItem.productId,
    productName: newItem.productName,
    price,
    colorName: newItem.colorName,
    size: newItem.size,
    eventId,
  });
  
  // تتبع AddToCart من السيرفر (Server-side)
  serverTrackAddToCart({
    eventId,
    productId: newItem.productId,
    productName: newItem.productName,
    price,
    colorName: newItem.colorName,
    size: newItem.size,
  });
  
  // إرسال event لتحديث الأزرار والسلة
  window.dispatchEvent(new CustomEvent("cart-updated"));
  window.dispatchEvent(new CustomEvent("open-cart"));
}

export default function ProductDetails({
  product,
  productId,
  selectedColorIndex,
  selectedColorName,
  selectedColorImage,
  selectedColorOutofstock,
  selectedSize,
  onSelectSize,
}: Props) {
  // حساب حالة عدم التوفر
  const selectedSizeData = product.sizes?.find((s) => s.number === selectedSize);
  const isOutOfStock = product.outofstock || selectedColorOutofstock || selectedSizeData?.outofstock;
  const prettyName = product.name.replace(" - ", "<br>");

  const selectedColor = product.colors[selectedColorIndex];

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("الرجاء اختيار المقاس أولاً");
      return;
    }

    addToCart({
      productId,
      productName: product.name,
      nameItemInStorage: product.nameItemInStorage,
      colorName: selectedColorName,
      colorHex: selectedColor?.hex || "#000",
      size: selectedSize,
      sizeDimensions: selectedSizeData?.dimensions,
      price: product.price,
      image: selectedColorImage || selectedColor?.image || product.colors[0]?.image || "",
    });
  };

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("الرجاء اختيار المقاس أولاً");
      return;
    }

    addToCart({
      productId,
      productName: product.name,
      nameItemInStorage: product.nameItemInStorage,
      colorName: selectedColorName,
      colorHex: selectedColor?.hex || "#000",
      size: selectedSize,
      sizeDimensions: selectedSizeData?.dimensions,
      price: product.price,
      image: selectedColorImage || selectedColor?.image || product.colors[0]?.image || "",
    });
  };

  return (
    <div className="flex flex-col justify-center space-y-8">
      {/* العنوان والتقييم */}
      <div className="border-b border-gray-200/50 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
            جديد
          </span>
          <span className="text-textLight text-sm">{product.category}</span>
        </div>

        <h1
          className="text-3xl md:text-5xl font-bold text-textDark mb-4 leading-tight"
          dangerouslySetInnerHTML={{ __html: prettyName }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
   
            <span className="text-xs text-textLight font-medium">(4.8 تقييم)</span>
                     <div className="flex text-yellow-400 text-sm">
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-left">
            <div className="text-3xl font-bold text-black">{product.price}</div>
            <div className="text-xs text-green-600 font-medium">شامل التوصيل لجميع المحافظات</div>
          </div>
        </div>
        
        {/* وقت التوصيل */}
        <div className="flex items-center gap-2 mt-3 bg-blue-50 rounded-xl px-4 py-2.5 border border-blue-100">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span className="text-sm text-blue-700 font-medium">يصلك خلال يوم عمل واحد</span>
        </div>
      </div>

      {/* الوصف */}
      <div>
        <p className="text-textLight text-lg leading-relaxed">{product.description}</p>
      </div>

      {/* اللون المختار */}
      <div>
        <h3 className="text-sm font-bold text-textDark mb-3">
          اللون المختار:{" "}
          <span className="text-textLight font-normal">{selectedColorName}</span>
        </h3>
      </div>

      {/* اختيار المقاس */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-textDark">
              المقاس:{" "}
              <span className="text-textLight font-normal">
                {selectedSize ? `رقم ${selectedSize}` : "--"}
              </span>
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {product.sizes.map((s) => {
              const active = selectedSize === s.number;
              const sizeOutOfStock = s.outofstock;
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => onSelectSize(s.number)}
                  className={[
                    "size-btn relative w-auto min-w-12 h-12 px-3 rounded-xl glass border flex items-center justify-center font-bold transition-all",
                    active
                      ? "bg-black border-black text-black"
                      : "border-gray-300 text-gray-400 hover:border-black",
                    sizeOutOfStock
                      ? "opacity-50 cursor-not-allowed line-through"
                      : "cursor-pointer",
                  ].join(" ")}
                  title={sizeOutOfStock ? `رقم ${s.number} - غير متوفر` : `رقم ${s.number}`}
                >
                  رقم {s.number}
                  {sizeOutOfStock && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] px-1 py-0.5 rounded-full font-bold">
                      نفذ
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* عرض تفاصيل المقاس المختار */}
          {selectedSize && (
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2">
                <i className="fas fa-ruler text-black"></i>
                <span className="text-sm font-bold text-textDark">تفاصيل المقاس:</span>
              </div>
              <p className="text-textLight text-sm mt-2">
                {product.sizes.find((s) => s.number === selectedSize)?.dimensions}
              </p>
            </div>
          )}
        </div>
      )}

      {/* أزرار الشراء */}
      {isOutOfStock && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <span className="text-red-600 font-bold">غير متوفر حالياً</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={[
            "flex-1 py-4 border-2 rounded-2xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2",
            isOutOfStock
              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-white text-black border-black hover:bg-gray-100",
          ].join(" ")}
        >
          <i className="fas fa-cart-plus text-sm"></i>
          <span>{isOutOfStock ? "غير متوفر" : "أضف للسلة"}</span>
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className={[
            "flex-1 py-4 rounded-2xl font-bold text-lg transition shadow-xl flex items-center justify-center gap-2",
            isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 transform hover:-translate-y-1",
          ].join(" ")}
        >
          <span>{isOutOfStock ? "غير متوفر" : "شراء الآن"}</span>
          <i className="fas fa-shopping-bag text-sm"></i>
        </button>
      </div>

      {/* رسالة طمأنة تحت الأزرار */}
      {!isOutOfStock && (
        <div className="text-center text-xs text-green-700 bg-green-50 rounded-xl py-2 px-4 border border-green-100">
          ✓ ادفعي بعد ما تشوفي القطعة وتتأكدي منها
        </div>
      )}

      {/* مميزات إضافية */}
      <div className="grid grid-cols-2 gap-4 text-xs text-textLight pt-4 border-t border-gray-200/50">
        <div className="flex items-center gap-2">
          <i className="fas fa-truck text-black text-lg"></i>
          <span>توصيل سريع لجميع المحافظات</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-undo text-black text-lg"></i>
          <span>سياسة استبدال مرنة</span>
        </div>
      </div>

      {/* ضمانات الثقة */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
        <h4 className="text-sm font-bold text-textDark mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          اطلبي بثقة تامة
        </h4>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2 text-xs text-textLight">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p><strong className="text-textDark">معاينة قبل الدفع</strong> - تقدري تشوفي القطعة وتتأكدي منها قبل ما تدفعي</p>
          </div>
          <div className="flex items-start gap-2 text-xs text-textLight">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p><strong className="text-textDark">خطأ بالمقاس أو اللون؟</strong> التبديل على حسابنا مجاناً</p>
          </div>
          <div className="flex items-start gap-2 text-xs text-textLight">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p><strong className="text-textDark">ضمان الجودة</strong> - إذا في عيب مصنعي نستبدلها فوراً</p>
          </div>
          <div className="flex items-start gap-2 text-xs text-textLight">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <p><strong className="text-textDark">التبديل بعد الاستلام</strong> - 2 د.أ فقط أجور التوصيل</p>
          </div>
        </div>
      </div>
    </div>
  );
}
