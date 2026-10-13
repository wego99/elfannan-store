import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, ShieldCheck, CheckCircle2, Truck, ArrowLeft, Tag, Gift } from 'lucide-react';
import { CartItem } from '../types';
import { STORE_INFO, GOVERNORATES } from '../data/mockData';
import { WheelPrize } from './LuckyWheelModal';
import { handleImageError, normalizeImagePath } from '../utils/imageUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  appliedCoupon: WheelPrize | null;
  onRemoveCoupon: () => void;
  onApplyPromoCode: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
  onRemoveCoupon,
  onApplyPromoCode,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  
  // Checkout form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState(GOVERNORATES[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Discount calculation based on applied coupon
  let discountAmount = 0;
  let isFreeShippingCoupon = false;

  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = Math.min(subtotal, appliedCoupon.value);
    } else if (appliedCoupon.type === 'shipping') {
      isFreeShippingCoupon = true;
    }
  }

  const shippingCost = (subtotal >= 700 || isFreeShippingCoupon) ? 0 : 50;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromoCode(promoInput.trim());
    if (success) {
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('كود الخصم غير صحيح أو منتهي الصلاحية');
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    const newOrderNum = 'FN-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(newOrderNum);
    setCheckoutStep('success');
  };

  const handleSendWhatsAppOrder = () => {
    const itemsList = cartItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.product.title} (${item.product.code}) - مقاس: ${item.selectedSize} - لون: ${item.selectedColor} - عدد: ${item.quantity} - السعر: ${item.product.price * item.quantity} ج.م`
      )
      .join('\n');

    const couponLine = appliedCoupon
      ? `\nكوبون الهدية / عجلة الحظ: ${appliedCoupon.label} (كود: ${appliedCoupon.code}) - خصم: ${discountAmount > 0 ? discountAmount + ' ج.م' : 'مطبق'}`
      : '';

    const message = `طلب شراء جديد من موقع مصنع الفنان:
رقم الطلب: ${orderNumber || 'FN-طلب جديد'}
الاسم: ${name || 'عميل المتجر'}
الهاتف: ${phone || 'غير مسجل'}
المحافظة: ${governorate}
العنوان: ${address || 'تأكيد عبر المحادثة'}
ملاحظات: ${notes || 'لا يوجد'}

تفاصيل المنتجات:
${itemsList}
${couponLine}
الإجمالي الفرعي: ${subtotal} ج.م
قيمة الخصم: ${discountAmount > 0 ? `-${discountAmount} ج.م` : 'لا يوجد'}
الشحن: ${shippingCost === 0 ? 'مجاني (عرض/كوبون)' : shippingCost + ' ج.م'}
الإجمالي المطلوب عند الاستلام: ${total} ج.م
طريقة الدفع: كاش عند الاستلام بعد المعاينة`;

    window.open(
      `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const handleFinish = () => {
    onClearCart();
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col text-right border-r border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="إغلاق السلة"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-stone-900 text-base">
              {checkoutStep === 'cart' && `سلة المشتريات (${cartItems.length})`}
              {checkoutStep === 'form' && 'بيانات الشحن والتوصيل'}
              {checkoutStep === 'success' && 'تم تأكيد طلبك بنجاح!'}
            </h3>
            <ShoppingBag className="w-5 h-5 text-rose-950" />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {checkoutStep === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-base">
                    سلة المشتريات فارغة
                  </h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    تصفح موديلات سنتر ومصنع الفنان واختر بيجامتك المفضلة بمقاسك ولونك.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-5 py-2.5 bg-rose-950 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    تصفح الموديلات الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex gap-3 items-center justify-between"
                    >
                      <img
                        src={normalizeImagePath(item.product.image)}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded-lg border border-stone-200 shrink-0"
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                      />

                      <div className="flex-1 min-w-0 pr-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-rose-900">
                            {item.product.code}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            title="حذف الموديل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="font-bold text-xs text-stone-900 truncate">
                          {item.product.title}
                        </h4>

                        <div className="text-[11px] text-stone-500 flex items-center gap-2">
                          <span>المقاس: <strong>{item.selectedSize}</strong></span>
                          <span>·</span>
                          <span>اللون: <strong>{item.selectedColor}</strong></span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-extrabold text-stone-900 tabular-nums">
                            {item.product.price * item.quantity} ج.م
                          </span>

                          <div className="flex items-center border border-stone-200 rounded-md bg-white">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:bg-stone-100"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:bg-stone-100"
                            >
                              +
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}

                  {/* Free shipping threshold progress */}
                  <div className="bg-rose-50 border border-rose-200/80 p-3 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-rose-950">
                      <span>
                        {subtotal >= 700 || isFreeShippingCoupon
                          ? '🎉 مبروك! شحن مجاني لكافة المحافظات'
                          : `باقي لك ${700 - subtotal} ج.م للشحن المجاني`}
                      </span>
                      <Truck className="w-4 h-4 text-rose-800" />
                    </div>
                    <div className="w-full bg-rose-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-800 h-full rounded-full transition-all"
                        style={{ width: `${isFreeShippingCoupon ? 100 : Math.min(100, (subtotal / 700) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Applied Coupon from Wheel or Code */}
                  {appliedCoupon ? (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-amber-700 shrink-0" />
                        <div>
                          <span className="font-bold text-amber-950 block">{appliedCoupon.label}</span>
                          <span className="text-[11px] text-amber-800">الكود المطبق: <strong>{appliedCoupon.code}</strong></span>
                        </div>
                      </div>
                      <button
                        onClick={onRemoveCoupon}
                        className="text-[11px] text-rose-700 hover:text-rose-900 font-bold px-2 py-1 bg-white rounded-lg border border-amber-200"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    /* Promo Code Input */
                    <form onSubmit={handleApplyPromo} className="space-y-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="لديك كود خصم من عجلة الحظ؟"
                          className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 text-right focus:outline-hidden focus:border-rose-900"
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                          تطبيق
                        </button>
                      </div>
                      {promoError && (
                        <span className="text-[11px] text-rose-600 block pr-1">{promoError}</span>
                      )}
                    </form>
                  )}
                </div>
              )}
            </>
          )}

          {checkoutStep === 'form' && (
            <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-3 text-xs">
              
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-stone-600 space-y-1">
                <span className="font-bold text-stone-900 block">ضمان مصنع وسنتر الفنان:</span>
                <p>الدفع عند الاستلام كاش فقط بعد فتح الطرد ومعاينة الخامات والتأكد من المقاس بنفسك.</p>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  الاسم ثلاثي: *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: منى أحمد إبراهيم"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  رقم الهاتف (واتساب): *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010xxxxxxxx أو 011xxxxxxxx"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  المحافظة: *
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right cursor-pointer"
                >
                  {GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  العنوان بالتفصيل (الشارع والمنطقة ورقم البيت): *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: المنصورة - شارع المشاية السفلية - عمارة ... الدور ..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  ملاحظات للمندوب أو المقاس (اختياري):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: الاتصال قبل الوصول بنصف ساعة"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                />
              </div>

            </form>
          )}

          {checkoutStep === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-stone-900">
                  تم استلام طلبك بنجاح!
                </h4>
                <p className="text-xs text-stone-600">
                  رقم الطلب الخاص بك: <strong className="text-rose-950 font-bold">{orderNumber}</strong>
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-right text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">اسم العميل:</span>
                  <span className="font-bold text-stone-900">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">رقم الهاتف:</span>
                  <span className="font-bold text-stone-900">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">العنوان:</span>
                  <span className="font-bold text-stone-900">{address}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 font-bold">
                  <span>المبلغ المطلوب عند الاستلام:</span>
                  <span className="text-rose-900 text-sm">{total} ج.م</span>
                </div>
              </div>

              <p className="text-xs text-stone-500">
                سيتواصل معك فريق مبيعات سنتر الفنان هاتفياً أو عبر الواتساب لتأكيد موعد خروج المندوب.
              </p>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSendWhatsAppOrder}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>إرسال تفاصيل الفاتورة عبر واتساب لتسريع الشحن</span>
                </button>

                <button
                  onClick={handleFinish}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  العودة للمتجر والكتالوج
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer with Subtotals & CTAs */}
        {cartItems.length > 0 && checkoutStep !== 'success' && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>المجموع الفرعي للمنتجات:</span>
                <span className="font-bold text-stone-900 tabular-nums">{subtotal} ج.م</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-700 font-bold">
                  <span>خصم كود الهدية ({appliedCoupon?.code}):</span>
                  <span className="tabular-nums">-{discountAmount} ج.م</span>
                </div>
              )}

              {appliedCoupon?.type === 'gift' && (
                <div className="flex justify-between text-purple-700 font-bold">
                  <span>هدية إضافية مضافة:</span>
                  <span>بندانة قطن تركي مجاناً 🎁</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>مصاريف الشحن والمعاينة:</span>
                <span className="font-bold text-emerald-700">
                  {shippingCost === 0 ? 'مجاني (عرض/كوبون)' : `${shippingCost} ج.م`}
                </span>
              </div>
              
              <div className="flex justify-between text-sm font-extrabold text-stone-900 border-t border-stone-200 pt-2">
                <span>الإجمالي للدفع عند الاستلام:</span>
                <span className="text-rose-950 text-base tabular-nums">{total} ج.م</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setCheckoutStep('form')}
                  className="w-full py-3.5 bg-rose-950 hover:bg-rose-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>متابعة إتمام الطلب والدفع عند الاستلام</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleSendWhatsAppOrder}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>طلب مباشر عبر الواتساب</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl cursor-pointer"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-3 bg-rose-950 hover:bg-rose-900 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>تأكيد الطلب الآن</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>حق الفتح والمعاينة قبل دفع أي مليم</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
