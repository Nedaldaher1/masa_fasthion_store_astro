/**
 * Meta (Facebook) Pixel Helper
 * ============================
 * ملف مساعد لتتبع أحداث Meta Pixel في المشروع
 * 
 * الأحداث المدعومة:
 * - PageView: يتم تتبعه تلقائياً عند تحميل الصفحة
 * - ViewContent: عند عرض صفحة منتج
 * - AddToCart: عند إضافة منتج للسلة
 * - InitiateCheckout: عند فتح السلة/بدء الشراء
 * - Purchase: عند إتمام الطلب
 */

// التحقق من وجود fbq في window
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

// العملة الافتراضية
const CURRENCY = "JOD";

/**
 * دالة مساعدة آمنة لتتبع الأحداث
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  
  try {
    window.fbq("track", eventName, params ?? {});
    // يمكن تفعيل السطر التالي للتصحيح
    // console.log(`[Meta Pixel] ${eventName}`, params);
  } catch (error) {
    console.error(`[Meta Pixel] Error tracking ${eventName}:`, error);
  }
}

/**
 * تتبع عرض المنتج (ViewContent)
 */
export function trackViewContent(params: {
  productId: string;
  productName: string;
  price: number;
  category?: string;
}) {
  trackEvent("ViewContent", {
    content_ids: [params.productId],
    content_name: params.productName,
    content_type: "product",
    content_category: params.category || "عبايات",
    value: params.price,
    currency: CURRENCY,
  });
}

/**
 * تتبع إضافة للسلة (AddToCart)
 */
export function trackAddToCart(params: {
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
  colorName?: string;
  size?: string;
}) {
  trackEvent("AddToCart", {
    content_ids: [params.productId],
    content_name: params.productName,
    content_type: "product",
    value: params.price * (params.quantity || 1),
    currency: CURRENCY,
    contents: [{
      id: params.productId,
      quantity: params.quantity || 1,
      item_price: params.price,
    }],
  });
}

/**
 * تتبع فتح السلة / بدء عملية الشراء (InitiateCheckout)
 */
export function trackInitiateCheckout(params: {
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  totalValue: number;
  numItems: number;
}) {
  trackEvent("InitiateCheckout", {
    content_ids: params.items.map(item => item.productId),
    contents: params.items.map(item => ({
      id: item.productId,
      quantity: item.quantity,
      item_price: item.price,
    })),
    content_type: "product",
    value: params.totalValue,
    currency: CURRENCY,
    num_items: params.numItems,
  });
}

/**
 * تتبع إتمام الشراء (Purchase)
 */
export function trackPurchase(params: {
  items: Array<{
    productId: string;
    productName: string;
    nameItemInStorage: string;
    category: string;
    colorName: string;
    price: number;
    quantity: number;
  }>;
  totalValue: number;
  numItems: number;
}) {
  trackEvent("Purchase", {
    content_ids: params.items.map(item => item.productId),
    contents: params.items.map(item => ({
      id: item.productId,
      quantity: item.quantity,
      item_price: item.price,
      item_name: item.nameItemInStorage,
      item_category: item.category,
      item_variant: item.colorName,
    })),
    content_type: "product",
    value: params.totalValue,
    currency: CURRENCY,
    num_items: params.numItems,
  });
}
