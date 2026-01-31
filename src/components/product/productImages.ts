// استيراد جميع صور المنتجات باستخدام import.meta.glob
// هذا يسمح لـ Astro بمعالجة الصور وتحسينها تلقائياً

const productImagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/products/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true }
);

// تحويل المسارات إلى كائن سهل الاستخدام
export const productImages: Record<string, ImageMetadata> = {};

for (const [path, module] of Object.entries(productImagesGlob)) {
  // تحويل المسار من /src/assets/products/product_1/1.png إلى /products/product_1/1.png
  const key = path.replace('/src/assets', '');
  productImages[key] = module.default;
}

// دالة مساعدة للحصول على صورة بناءً على المسار القديم
export function getProductImage(oldPath: string): ImageMetadata | undefined {
  return productImages[oldPath];
}

// تصدير نوع ImageMetadata للاستخدام في الملفات الأخرى
export type { ImageMetadata } from 'astro';
