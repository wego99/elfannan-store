import React from 'react';
import { Tag, Sparkles, ShoppingBag, ArrowLeft, Percent, Gift } from 'lucide-react';
import { Product } from '../types';
import { handleImageError } from '../utils/imageUtils';

interface SpecialOffersProps {
  onQuickView: (product: Product) => void;
  offerProduct: Product | undefined;
}

export const SpecialOffers: React.FC<SpecialOffersProps> = ({ onQuickView, offerProduct }) => {
  return (
    <section id="offers" className="py-16 bg-gradient-to-br from-rose-950 via-stone-900 to-rose-950 text-white border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md relative overflow-hidden">
          
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Right Text Column (RTL) */}
            <div className="lg:col-span-7 space-y-5 text-right">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-600/30 text-rose-300 rounded-lg text-xs font-bold border border-rose-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>أوكازيون وتخفيضات مصنع الفنان الكبرى</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                عروض المصنع الحصرية: <br />
                <span className="text-rose-400">وفر حتى 350 جنيه</span> على باقات البيتي المجمعة
              </h2>

              <p className="text-sm text-stone-300 leading-relaxed max-w-xl">
                بمناسبة دخول الموسم الجديد، سنتر الفنان بيقدملك عرض التوفير السوبر: اختاري أي 3 بيجامات قطنية أو ميلتون مشكل بمقاساتك، واحصلي على خصم المصنع المباشر مع شحن مخفض لجميع المحافظات.
              </p>

              {/* Offer highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <span className="block text-amber-300 font-extrabold text-base tabular-nums">من 150 ج.م</span>
                  <span className="text-stone-300">بيجامات بيتي قطن</span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <span className="block text-rose-300 font-extrabold text-base tabular-nums">من 200 ج.م</span>
                  <span className="text-stone-300">دريسات واستقبال</span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                  <span className="block text-emerald-300 font-extrabold text-base">كاش عند الاستلام</span>
                  <span className="text-stone-300">حق المعاينة الكاملة</span>
                </div>
              </div>

              {/* Button */}
              {offerProduct && (
                <div className="pt-2">
                  <button
                    onClick={() => onQuickView(offerProduct)}
                    className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>تفاصيل عرض الـ 3 بيجامات (750 ج.م)</span>
                    <ArrowLeft className="w-4 h-4 mr-1" />
                  </button>
                </div>
              )}

            </div>

            {/* Left Column Image Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
                <img
                  src="/images/product_pajama_cotton_pink.jpg"
                  alt="عرض التوفير الخاص"
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />
                <div className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" />
                  <span>خصم 35%</span>
                </div>
                <div className="absolute bottom-4 right-4 left-4 bg-stone-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-right">
                  <span className="block text-xs font-bold text-white">عرض التوفير الـ 3 قطع</span>
                  <span className="text-[11px] text-stone-300">750 ج.م بدلاً من 1100 ج.م لفترة محدودة</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
