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
 * 
 * ⚠️ ملاحظة: يتم تعطيل التتبع في بيئة التطوير (localhost)
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
 * التحقق من بيئة التطوير
 * @returns true إذا كنا في بيئة التطوير (localhost)
 */
function isDevelopment(): boolean {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.");
}

/**
 * دالة مساعدة آمنة لتتبع الأحداث
 * @param eventName اسم الحدث
 * @param params معلمات الحدث
 * @param eventId معرف فريد للتخلص من التكرار (اختياري)
 */
export function trackEvent(eventName: string, params?: Record<string, any>, eventId?: string) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  
  // ⛔ تعطيل التتبع في بيئة التطوير
  if (isDevelopment()) {
    console.log(`[Meta Pixel - DEV] Skipped: ${eventName}`, params);
    return;
  }
  
  try {
    // إذا تم توفير eventId، نضيفه للحدث
    if (eventId) {
      window.fbq("track", eventName, params ?? {}, { eventID: eventId });
    } else {
      window.fbq("track", eventName, params ?? {});
    }
    // يمكن تفعيل السطر التالي للتصحيح
    // console.log(`[Meta Pixel] ${eventName}`, params, eventId);
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
  eventId?: string;
}) {
  trackEvent("ViewContent", {
    content_ids: [params.productId],
    content_name: params.productName,
    content_type: "product",
    content_category: params.category || "عبايات",
    value: params.price,
    currency: CURRENCY,
  }, params.eventId);
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
  eventId?: string;
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
  }, params.eventId);
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
  eventId?: string;
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
  }, params.eventId);
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
  eventId?: string;
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
  }, params.eventId);
}
