import React, { useEffect, useMemo, useState, useCallback } from "react";
import { productsData } from "./productsData";
import ProductGallery from "./ProductGallery";
import ProductDetails from "./ProductDetails";

type Props = { productId: string };

const CURRENCY = "JOD";


export default function ProductView({ productId }: Props) {
  const product = useMemo(() => {
    return productsData[productId] ?? productsData.product1;
  }, [productId]);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const selectedColor = product.colors[selectedColorIndex] ?? product.colors[0];

  // Helper لتتبع البيكسل بأمان
  const track = useCallback((eventName: string, params?: Record<string, any>) => {
    if (typeof window === "undefined") return;
    const fbq = (window as any).fbq;
    if (typeof fbq !== "function") return;
    fbq("track", eventName, params ?? {});
  }, []);

  // فور تغيير المنتج
  useEffect(() => {
    setSelectedColorIndex(0);
    setSelectedSize("");
  }, [productId]);

  // تحديث عنوان الصفحة
  useEffect(() => {
    document.title = `${product.name} | ماسة فيشن`;
  }, [product.name]);

  // ✅ ViewContent عند عرض صفحة المنتج
  useEffect(() => {
    const price = Number(product.price ?? 0);

    track("ViewContent", {
      content_ids: [productId],
      content_name: product.name,
      content_type: "product",
      value: price,
      currency: CURRENCY,
    });
  }, [track, productId, product.name, product.price]);
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <ProductGallery
          colors={product.colors}
          selectedColorIndex={selectedColorIndex}
          onSelectColorIndex={setSelectedColorIndex}
        />

        <ProductDetails
          product={product}
          productId={productId}
          selectedColorIndex={selectedColorIndex}
          selectedColorName={selectedColor?.name ?? ""}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
        />
      </div>
    </>
  );
}
