import React from 'react';
import { ShoppingBag, MessageCircle, ShieldCheck, Truck, Star, Award, ChevronDown } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { handleImageError } from '../utils/imageUtils';

interface HeroProps {
  onExploreCatalog: () => void;
  onExploreReviews: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onExploreReviews }) => {
  return (
    <section id="hero" className="relative bg-[#FAF8F5] pt-8 pb-16 overflow-hidden border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Right Column (Arabic RTL: text intro first) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-right space-y-6">
            
            {/* Quiet metadata kicker (No candy pills) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-900 tracking-wide">
              <span>مصنع ومول الفنان للملابس الجاهزة</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>الكردي - المنصورة</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-emerald-700">مفتوح يومياً</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 leading-[1.25] tracking-tight">
              أفخم ملابس بيتي وهوم وير تركي{' '}
              <span className="text-rose-900 underline decoration-rose-300 decoration-wavy decoration-2">
                من المصنع مباشرة
              </span>{' '}
              لبيتك بدون وسيط
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl font-normal">
              أهلاً بكم في الصرح الرسمي لسنتر ومصنع الفنان. تشكيلة حصرية من أطقم البيجامات الميلتون والقطيفة وخامات القطن المصري والتركي، بتصميمات عصرية وأسعار جملة أصلية تناسب كل بيت وعروسة بتجهز.
            </p>

            {/* Key Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-rose-950 hover:bg-rose-900 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>تصفح كولكشن الشتاء والبيتي</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent('السلام عليكم، شفت موقع مصنع الفنان وعاوز أطلب واستفسر عن الموديلات المتاحة')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 rounded-xl border border-emerald-300 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>طلب واستفسار فوري واتساب</span>
              </a>

              <button
                onClick={onExploreReviews}
                className="w-full sm:w-auto px-4 py-3 text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>قراءة آراء الزبائن (1,480+ تقييم)</span>
              </button>
            </div>

            {/* Direct Value Pillars Row */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-stone-200/80 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-900 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-stone-900">حق المعاينة الكاملة</span>
                  <span className="text-stone-500">افتح وعاين خامتك قبل الدفع</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-900 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-stone-900">خامات تركي & مصري</span>
                  <span className="text-stone-500">أقطان معالجة وثبات ألوان</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-stone-900">شحن لكل مصر</span>
                  <span className="text-stone-500">توصيل سريع لباب بيتك</span>
                </div>
              </div>
            </div>

          </div>

          {/* Left Column: Visual Campaign Showcase */}
          <div className="lg:col-span-5 relative flex items-center">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-stone-100 group">
              <img
                src="/images/hero_loungewear_banner.jpg"
                alt="كولكشن ملابس بيتي مصنع الفنان"
                className="w-full h-80 sm:h-96 lg:h-[460px] object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white text-right">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-rose-300 font-semibold">
                    <span>مصور داخل معرض الفنان</span>
                    <span aria-hidden="true">·</span>
                    <span>كولكشن شتاء 2026 الحصري</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    أطقم بيجامات وهوم وير قطيفة وميلتون مستورد
                  </h3>
                  <p className="text-xs text-stone-300">
                    أسعار مباشرة من المصنع تبدأ من 150 إلى 490 ج.م فقط
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Trust Card (Adhering to anti-slop: clean typography, functional stats) */}
            <div className="absolute -bottom-5 -right-3 sm:right-6 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-stone-200 text-right z-10 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-900 text-rose-100 flex items-center justify-center font-bold text-xs shrink-0">
                  133k
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-stone-900">
                    <span>متابع فيسبوك حقيقي</span>
                    <span className="text-rose-600">✓</span>
                  </div>
                  <span className="text-[11px] text-stone-500">صفحة مصنع الفنان الرسمية</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
