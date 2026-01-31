import type { Product } from "./productsData";
import { Star } from "../../icons/react/star";

type Props = {
  product: Product;
  productId: string;
  selectedColorIndex: number;
  selectedColorName: string;
  selectedColorImage: string; // الصورة المحسّنة من Astro
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
  selectedSize,
  onSelectSize,
}: Props) {
  const prettyName = product.name.replace(" - ", "<br>");

  const selectedColor = product.colors[selectedColorIndex];
  const selectedSizeData = product.sizes?.find((s) => s.number === selectedSize);

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
          <div className="text-3xl font-bold text-black">{product.price}</div>
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
            <button className="text-xs text-textLight underline hover:text-black" type="button">
              دليل المقاسات
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {product.sizes.map((s) => {
              const active = selectedSize === s.number;
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => onSelectSize(s.number)}
                  className={[
                    "size-btn w-12 h-12 rounded-xl glass border flex items-center justify-center font-bold transition-all cursor-pointer",
                    active
                      ? "bg-black border-black text-black"
                      : "border-gray-300 text-gray-400 hover:border-black",
                  ].join(" ")}
                >
                  رقم {s.number}
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
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-4 bg-white text-black border-2 border-black rounded-2xl font-bold text-lg hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2"
        >
          <i className="fas fa-cart-plus text-sm"></i>
          <span>أضف للسلة</span>
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          <span>شراء الآن</span>
          <i className="fas fa-shopping-bag text-sm"></i>
        </button>
      </div>

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
    </div>
  );
}
