/**
 * Backend API Helper
 * ==================
 * ملف مساعد للتواصل مع السيرفر الخلفي
 * يدعم:
 * - Meta Conversion API (Server-Side Events)
 * - WhatsApp Cloud API (إشعارات الطلبات)
 * 
 * آخر تحديث: February 2026
 * API Version: 1.0.0
 * 
 * ⚠️ ملاحظة: يتم تعطيل تتبع Meta Events في بيئة التطوير (localhost)
 */

// عنوان السيرفر الخلفي
const API_URL = import.meta.env.PUBLIC_API_URL || "https://api.masa-fashion.store";
const API_KEY = import.meta.env.PUBLIC_API_KEY || "";

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
 * توليد Event ID فريد للتخلص من التكرار
 * يُستخدم في كل من Client-side و Server-side tracking
 */
export function generateEventId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 11);
  return `${timestamp}_${random}`;
}

/**
 * الحصول على Client User Agent
 */
function getUserAgent(): string {
  return typeof navigator !== "undefined" ? navigator.userAgent : "";
}

/**
 * الحصول على URL الصفحة الحالية
 */
function getSourceUrl(): string {
  return typeof window !== "undefined" ? window.location.href : "";
}

/**
 * قراءة قيمة Cookie
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}

/**
 * دالة مساعدة لإرسال الطلبات للسيرفر
 */
async function sendToAPI<T = any>(endpoint: string, data: Record<string, any>): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`[Backend API] Error: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    // لا نوقف تجربة المستخدم عند فشل التتبع
    console.error("[Backend API] Request failed:", error);
    return null;
  }
}

// =============================================
// Meta Conversion API Events
// =============================================

/**
 * تتبع ViewContent من السيرفر
 */
export async function serverTrackViewContent(params: {
  eventId: string;
  productId: string;
  productName: string;
  price: number;
  category?: string;
}): Promise<boolean> {
  // ⛔ تعطيل التتبع في بيئة التطوير
  if (isDevelopment()) {
    console.log("[Backend API - DEV] Skipped: ViewContent", params);
    return true;
  }
  
  const result = await sendToAPI("/api/events/view-content", {
    productId: params.productId,
    productName: params.productName,
    price: params.price,
    category: params.category || "عبايات",
    eventId: params.eventId,
    sourceUrl: getSourceUrl(),
    fbp: getCookie("_fbp"),
    userAgent: getUserAgent(),
  });
  return result !== null;
}

/**
 * تتبع AddToCart من السيرفر
 */
export async function serverTrackAddToCart(params: {
  eventId: string;
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
  colorName?: string;
  size?: string;
}): Promise<boolean> {
  // ⛔ تعطيل التتبع في بيئة التطوير
  if (isDevelopment()) {
    console.log("[Backend API - DEV] Skipped: AddToCart", params);
    return true;
  }
  
  const result = await sendToAPI("/api/events/add-to-cart", {
    productId: params.productId,
    productName: params.productName,
    price: params.price,
    quantity: params.quantity || 1,
    eventId: params.eventId,
    sourceUrl: getSourceUrl(),
    fbp: getCookie("_fbp"),
    userAgent: getUserAgent(),
  });
  return result !== null;
}

/**
 * تتبع InitiateCheckout من السيرفر
 */
export async function serverTrackInitiateCheckout(params: {
  eventId: string;
  items: Array<{
    productId: string;
    price: number;
    quantity: number;
  }>;
  totalValue: number;
}): Promise<boolean> {
  // ⛔ تعطيل التتبع في بيئة التطوير
  if (isDevelopment()) {
    console.log("[Backend API - DEV] Skipped: InitiateCheckout", params);
    return true;
  }
  
  const result = await sendToAPI("/api/events/initiate-checkout", {
    items: params.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    totalValue: params.totalValue,
    eventId: params.eventId,
    sourceUrl: getSourceUrl(),
    fbp: getCookie("_fbp"),
    userAgent: getUserAgent(),
  });
  return result !== null;
}

/**
 * تتبع Purchase من السيرفر
 */
export async function serverTrackPurchase(params: {
  eventId: string;
  items: Array<{
    productId: string;
    productName: string;
    colorName: string;
    price: number;
    quantity: number;
  }>;
  totalValue: number;
  customerData: {
    name: string;
    phone: string;
    city: string;
  };
}): Promise<boolean> {
  // ⛔ تعطيل التتبع في بيئة التطوير
  if (isDevelopment()) {
    console.log("[Backend API - DEV] Skipped: Purchase", params);
    return true;
  }
  
  const result = await sendToAPI("/api/events/purchase", {
    customerName: params.customerData.name,
    customerPhone: params.customerData.phone,
    city: params.customerData.city,
    items: params.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      colorName: item.colorName,
      price: item.price,
      quantity: item.quantity,
    })),
    totalValue: params.totalValue,
    eventId: params.eventId,
    sourceUrl: getSourceUrl(),
    fbc: getCookie("_fbc"),
    fbp: getCookie("_fbp"),
    userAgent: getUserAgent(),
  });
  return result !== null;
}

// =============================================
// WhatsApp Cloud API
// =============================================

interface WhatsAppNotifyResult {
  success: boolean;
  customerNotification?: { success: boolean; error: string | null };
  storeNotification?: { success: boolean; error: string | null };
}

/**
 * إرسال إشعار طلب جديد عبر WhatsApp Cloud API
 * يُرسل رسالتين تلقائياً: واحدة للعميل وواحدة للمتجر
 */
export async function sendWhatsAppOrderNotification(params: {
  customerName: string;
  customerPhone: string;
  governorate: string;
  address: string;
  notes?: string;
  items: Array<{
    productName: string;
    colorName: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  totalValue: number;
}): Promise<WhatsAppNotifyResult | null> {
  return sendToAPI<WhatsAppNotifyResult>("/api/whatsapp/notify-order", {
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    governorate: params.governorate,
    address: params.address,
    notes: params.notes || "",
    items: params.items.map(item => ({
      productName: item.productName,
      colorName: item.colorName,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    })),
    totalValue: params.totalValue,
  });
}
