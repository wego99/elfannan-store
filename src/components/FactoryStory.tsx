import React from 'react';
import { Store, Users, MapPin, Sparkles, HeartHandshake, Video } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { handleImageError } from '../utils/imageUtils';

export const FactoryStory: React.FC = () => {
  return (
    <section id="story" className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Right Text Column (RTL) */}
          <div className="lg:col-span-6 space-y-6 text-right">
            
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-900">
              <span>عن مصنع وسنتر الفنان</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>الكردي - المنصورة</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>133 ألف متابع</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug">
              قصة نجاح بدأت من القلب: <br />
              <span className="text-rose-950 font-black">
                «إبداع على مدار الزمان وأمانة لا تُسرق»
              </span>
            </h2>

            <p className="text-sm text-stone-600 leading-relaxed">
              انطلق مصنع ومول الفنان من مدينة الكردي بمحافظة الدقهلية برؤية واضحة يقودها الأستاذ <strong>محمود موسى</strong>: تقديم أرقى الملابس البيتي والبيجامات التركية والهوم وير النسائي والولادي بجودة تفوق المستورد وبسعر المصنع المباشر دون وسطاء أو هوامش ربح خيالية.
            </p>

            {/* Inspirational Quote Card Inspired Directly by the Facebook Screenshots */}
            <div className="bg-stone-50 border-r-4 border-rose-900 p-4 rounded-xl text-stone-800 text-xs sm:text-sm leading-relaxed space-y-2">
              <p className="italic font-medium">
                "ربنا مبينساش، حتى لو نسيت هو فاكر كل دعوة دعيتها وكل أمنية اتمنيتها... متستقلش بعمل صغير انت شغال فيه، ما تعلمش بكرة اللي انت شغال فيه هيكبر ازاي. أعظم ميزة تنافسية هي أخلاقك وأمانتك مع زبائنك."
              </p>
              <div className="text-[11px] text-stone-500 font-bold">
                — من كلمات محمود موسى لمتابعي وأسرة سنتر الفنان
              </div>
            </div>

            {/* Core Badges Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm mb-1">
                  <Store className="w-4 h-4" />
                  <span>معرض ومول الكردي</span>
                </div>
                <p className="text-xs text-stone-600">
                  ميدان المجمع بجوار صيدلية د. جبر، صالة عرض متكاملة مفتوحة طوال اليوم.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm mb-1">
                  <Users className="w-4 h-4" />
                  <span>مجتمع الفنان المباشر</span>
                </div>
                <p className="text-xs text-stone-600">
                  قناة حصرية تضم أكثر من 1400 عضو لمتابعة العروض الجديدة أولاً بأول.
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={STORE_INFO.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <span>صفحة فيسبوك الرسمية (133k)</span>
              </a>

              <a
                href={STORE_INFO.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>تيك توك @mahmoud mousa</span>
              </a>
            </div>

          </div>

          {/* Left Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-xl bg-stone-100">
              <img
                src="/images/store_factory_showroom.jpg"
                alt="معرض وصالة عرض مصنع الفنان للملابس الجاهزة"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
                onError={handleImageError}
              />
            </div>

            {/* Floating Info card */}
            <div className="absolute -bottom-6 -left-3 sm:left-6 bg-white p-4 rounded-xl border border-stone-200 shadow-lg text-right max-w-xs hidden sm:block">
              <div className="flex items-center gap-2 text-rose-900 text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>بيع قطاعي بسعر الجملة</span>
              </div>
              <p className="text-[11px] text-stone-600">
                تجهيز كامل للعرائس، وتوريد للتجار وأصحاب المحلات بأفضل خامات الميلتون والقطيفة في مصر.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
