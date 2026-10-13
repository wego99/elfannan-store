import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Video, Facebook, ShieldCheck, Navigation } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

export const LocationAndContact: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-right space-y-2 mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-900">
            <span>فروعنا وتواصل معنا</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>محافظة الدقهلية</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>توصيل لجميع المحافظات</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            زيارة سنتر ومول الفنان أو الطلب هاتفياً
          </h2>
          <p className="text-sm text-stone-600 max-w-2xl">
            يشرفنا استقبالكم في صالة العرض والمول بمدينة الكردي، أو طلب أي موديل عبر الهاتف والواتساب ليصلكم أينما كنتم.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Right Column: Contact Cards Grid (RTL) */}
          <div className="lg:col-span-7 space-y-4 text-right">
            
            {/* Location Card */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-rose-50 text-rose-900 rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-rose-900 block">عنوان المعرض والمول:</span>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  {STORE_INFO.address}
                </h3>
                <p className="text-xs text-stone-500">
                  ميدان المجمع، خلف حلواني أبو عطوة، بجوار صيدلية د. نبيل أسامة.
                </p>
              </div>
            </div>

            {/* Hours & Availability */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-800 block">مواعيد العمل:</span>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  {STORE_INFO.workingHours}
                </h3>
                <p className="text-xs text-stone-500">
                  فريق المبيعات متاح طوال اليوم للرد على الاستفسارات وتجهيز طلبيات العرائس والجملة.
                </p>
              </div>
            </div>

            {/* Direct Phone Lines */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-900 rounded-xl shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-900 block">أرقام الهواتف والمبيعات:</span>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <a
                      href={`tel:${STORE_INFO.phone1}`}
                      className="font-bold text-stone-900 hover:text-rose-900 transition-colors text-sm tabular-nums"
                    >
                      {STORE_INFO.phone1}
                    </a>
                    <span className="text-stone-300">|</span>
                    <a
                      href={`tel:${STORE_INFO.phone2}`}
                      className="font-bold text-stone-900 hover:text-rose-900 transition-colors text-sm tabular-nums"
                    >
                      {STORE_INFO.phone2}
                    </a>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>محادثة واتساب فورا</span>
              </a>
            </div>

            {/* Social channels preview */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={STORE_INFO.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-blue-300 transition-colors flex items-center gap-2.5"
              >
                <Facebook className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="truncate">
                  <span className="block text-xs font-bold text-stone-900 truncate">صفحة فيسبوك</span>
                  <span className="text-[11px] text-stone-500">133 ألف متابع</span>
                </div>
              </a>

              <a
                href={STORE_INFO.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-stone-400 transition-colors flex items-center gap-2.5"
              >
                <Video className="w-5 h-5 text-stone-900 shrink-0" />
                <div className="truncate">
                  <span className="block text-xs font-bold text-stone-900 truncate">تيك توك @mahmoud</span>
                  <span className="text-[11px] text-stone-500">فيديوهات المعاينة</span>
                </div>
              </a>
            </div>

          </div>

          {/* Left Column: Visual Map & Showroom Guide */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs text-right space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900">خريطة وموقع المعرض</span>
                <Navigation className="w-4 h-4 text-stone-400" />
              </div>

              {/* Styled interactive map preview card */}
              <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 h-52 flex items-center justify-center text-center p-4">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#991b1b_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 space-y-2">
                  <div className="w-12 h-12 bg-rose-950 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      مول وسنتر الفنان - الكردي
                    </h4>
                    <p className="text-xs text-stone-500">
                      طريق المنزلة المنصورة السريع
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=الكردي+الدقهلية+طريق+المنزلة"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold rounded-lg transition-colors"
                  >
                    فتح الاتجاهات على خرائط Google
                  </a>
                </div>
              </div>

              {/* Delivery Guarantee box */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-1 text-emerald-950">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>الشحن لجميع محافظات مصر:</span>
                </div>
                <p className="text-emerald-900 text-[11px] leading-relaxed">
                  يصلك المندوب حتى باب المنزل خلال 24 - 48 ساعة مع إمكانية فتح الشحنة والتأكد من المقاس والخامة قبل السداد.
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <a
                href={`tel:${STORE_INFO.phone1}`}
                className="w-full py-3 bg-rose-950 hover:bg-rose-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>اتصل بنا الآن لحجز طلبك: {STORE_INFO.phone1}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
