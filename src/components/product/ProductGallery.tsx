import { useEffect, useRef, useState } from "react";

// نوع موسّع يدعم الصور المحسّنة
type ColorItemWithOptimized = {
  name: string;
  hex: string;
  image: string;
  thumbImage?: string;
  outofstock?: boolean;
};

type Props = {
  colors: ColorItemWithOptimized[];
  selectedColorIndex: number;
  onSelectColorIndex: (idx: number) => void;
};

export default function ProductGallery({
  colors,
  selectedColorIndex,
  onSelectColorIndex,
}: Props) {
  const main = colors[selectedColorIndex] ?? colors[0];

  // تأثير fade/scale مثل القديم
  const [animating, setAnimating] = useState(false);
  const lastIndexRef = useRef<number>(selectedColorIndex);

  useEffect(() => {
    if (lastIndexRef.current !== selectedColorIndex) {
      setAnimating(true);
      const t = window.setTimeout(() => setAnimating(false), 220);
      lastIndexRef.current = selectedColorIndex;
      return () => window.clearTimeout(t);
    }
  }, [selectedColorIndex]);

  return (
    <div className="space-y-6">
      {/* الصورة الرئيسية */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gray-100 aspect-[3/4] shadow-lg group">
        <img
          src={main?.image}
          alt="Product Image"
          width={800}
          height={1066}
          className={[
            "object-cover w-full h-full transition-transform duration-700 group-hover:scale-110",
            "transition-opacity duration-200",
            animating ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100",
          ].join(" ")}
        />

        {/* بادج */}
        <div className="absolute top-6 right-6 bg-white/95 md:bg-white/80 md:backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-black shadow-sm">
          الأكثر مبيعاً
        </div>
      </div>

      {/* الصور المصغرة */}
      <div className="grid grid-cols-3 gap-4 justify-items-center pb-2 lg:grid-cols-6 lg:justify-items-start">
        {colors.map((c, idx) => (
          <button
            key={`${c.name}-${idx}`}
            type="button"
            onClick={() => onSelectColorIndex(idx)}
            className={[
              "relative w-20 h-20 rounded-xl overflow-hidden border-2 hover:border-black transition-all focus:border-black focus:ring-2 focus:ring-black/20",
              idx === selectedColorIndex ? "border-black" : "border-transparent",
              c.outofstock ? "opacity-60" : "",
            ].join(" ")}
            aria-label={`اختر صورة ${c.name}`}
          >
            <img 
              src={c.thumbImage || c.image} 
              width={80}
              height={80}
              className="w-full h-full object-cover" 
              alt={c.name} 
            />
            {c.outofstock && (
              <span className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-[8px] py-0.5 text-center font-bold">
                غير متوفر
              </span>
            )}
          </button>
        ))}
      </div>


      {/* أزرار الألوان */}
      <div className="flex items-center gap-3 justify-center lg:justify-start">
        {colors.map((c, idx) => (
          <button
            key={`color-${c.name}-${idx}`}
            type="button"
            title={c.outofstock ? `${c.name} - غير متوفر` : c.name}
            onClick={() => onSelectColorIndex(idx)}
            className={[
              "relative w-10 h-10 rounded-full border border-gray-200 shadow-sm transition-all",
              idx === selectedColorIndex
                ? "ring-2 ring-offset-2 ring-black transform scale-110"
                : "",
              c.outofstock ? "opacity-60" : "",
            ].join(" ")}
            style={{ backgroundColor: c.hex }}
            aria-label={`اللون ${c.name}${c.outofstock ? ' - غير متوفر' : ''}`}
          >
            {c.outofstock && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-full h-0.5 bg-red-500 rotate-45 absolute"></span>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
