import React from 'react';
import { Star, Eye, ShoppingBag, MessageCircle, Trash2, Pencil } from 'lucide-react';
import { Product } from '../types';
import { STORE_INFO } from '../data/mockData';
import { handleImageError, normalizeImagePath } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isAdmin,
  onDelete,
  onEdit,
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const whatsappDirectUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
    `السلام عليكم، أرغب بطلب الموديل (${product.code} - ${product.title}) بسعر ${product.price} ج.م من مصنع الفنان.`
  )}`;

  return (
    <article className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col text-right">
      
      {/* Product Image Area */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={normalizeImagePath(product.image)}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 pointer-events-none">
            {product.badge && (
              <span className="bg-stone-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs">
                {product.badge}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                خصم {discountPercent}%
              </span>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1.5 z-10">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product);
                  }}
                  title="تعديل بيانات وسعر الموديل"
                  className="px-2 py-1 bg-stone-900/90 hover:bg-amber-600 text-amber-200 hover:text-white rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                >
                  <Pencil className="w-3 h-3 text-amber-300" />
                  <span>تعديل</span>
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(product.id);
                  }}
                  title="حذف الموديل من الكتالوج"
                  className="p-1.5 bg-stone-900/90 hover:bg-rose-800 text-rose-300 hover:text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick View Floating Overlay on Hover */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3.5 py-2 bg-white text-stone-900 text-xs font-bold rounded-lg shadow-md hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة المقاسات</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Metadata line (Clean, unboxed, anti-slop) */}
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold text-rose-900 tracking-wider">
              {product.code}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-semibold text-stone-800">{product.rating}</span>
              <span className="text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-stone-900 text-base leading-snug group-hover:text-rose-950 transition-colors cursor-pointer line-clamp-2"
          >
            {product.title}
          </h3>

          {/* Fabric snippet */}
          <p className="text-xs text-stone-600 line-clamp-1">
            الخامة: {product.fabric}
          </p>
        </div>

        {/* Price and Actions Bottom */}
        <div className="pt-2 border-t border-stone-100 space-y-3">
          
          {/* Price Bar */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-stone-900 tabular-nums">
                {product.price}
              </span>
              <span className="text-xs text-stone-600 font-semibold">ج.م</span>

              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  {product.originalPrice} ج.م
                </span>
              )}
            </div>

            <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-sm">
              سعر المصنع
            </span>
          </div>

          {/* Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product)}
              className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>إضافة للسلة</span>
            </button>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>طلب واتساب</span>
            </a>
          </div>

        </div>

      </div>

    </article>
  );
};
