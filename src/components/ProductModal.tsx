import React, { useState } from 'react';
import { X, Star, ShoppingBag, MessageCircle, ShieldCheck, Check, Truck } from 'lucide-react';
import { Product } from '../types';
import { STORE_INFO } from '../data/mockData';
import { handleImageError, normalizeImagePath } from '../utils/imageUtils';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCartWithOptions: (product: Product, size: string, color: string, qty: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCartWithOptions,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'L');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'الافتراضي');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAdd = () => {
    onAddToCartWithOptions(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const whatsappMessage = `السلام عليكم ورحمة الله، أرغب بطلب الموديل التالي من مصنع الفنان:
- الموديل: ${product.title}
- الكود: ${product.code}
- المقاس المطلوب: ${selectedSize}
- اللون المختار: ${selectedColor}
- الكمية: ${quantity}
- السعر الإجمالي: ${product.price * quantity} ج.م
يرجى تأكيد التوافر وتفاصيل الشحن.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto text-right"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white rounded-full shadow-xs transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 bg-stone-100 relative min-h-[300px] md:min-h-full">
          <img
            src={normalizeImagePath(product.image)}
            alt={product.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
          <div className="absolute top-4 right-4 bg-stone-900/90 text-white text-xs font-bold px-3 py-1 rounded-md backdrop-blur-xs">
            {product.code}
          </div>
        </div>

        {/* Product Details & Selection Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-5">
          
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>{product.categoryLabel}</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400">({product.reviewsCount} تقييم)</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-stone-900 leading-snug">
                {product.title}
              </h2>
            </div>

            {/* Price Box */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-2xl font-extrabold text-stone-900 tabular-nums">
                  {product.price}
                </span>
                <span className="text-xs text-stone-600 font-bold mr-1">ج.م قطاعي</span>
                {product.originalPrice && (
                  <span className="text-xs text-stone-400 line-through tabular-nums mr-2">
                    {product.originalPrice} ج.م
                  </span>
                )}
              </div>
              <span className="text-xs text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.5 rounded-sm">
                متوفر بالمخزن
              </span>
            </div>

            {/* Description & Fabric */}
            <p className="text-xs text-stone-600 leading-relaxed">
              {product.description}
            </p>

            <div className="text-xs bg-rose-50/60 border border-rose-100 p-2.5 rounded-lg text-rose-950 font-medium">
              <span className="font-bold">مواصفات الخامة: </span>
              {product.fabric}
            </div>

            {/* Size Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 block">
                اختر المقاس:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-rose-950 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 block">
                اختر اللون: ({selectedColor})
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      selectedColor === c.name
                        ? 'border-rose-950 bg-rose-50 text-rose-950 font-bold'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0" 
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-stone-800">الكمية المطلوبة:</span>
              <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-bold text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            
            <button
              onClick={handleAdd}
              disabled={addedSuccess}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-950 hover:bg-rose-900 text-white shadow-md'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تمت الإضافة بنجاح!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>إضافة إلى سلة الشراء ({product.price * quantity} ج.م)</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>طلب مباشر عبر الواتساب مع المواصفات</span>
            </a>

            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                معاينة قبل الدفع
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-stone-500" />
                شحن لجميع المحافظات
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
