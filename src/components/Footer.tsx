import React from 'react';
import { STORE_INFO } from '../data/mockData';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 text-right pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-950 text-rose-200 flex items-center justify-center font-bold text-base border border-rose-800">
                الفنان
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                مصنع وسنتر الفنان للملابس الجاهزة
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              إبداع على مدار الزمان في صناعة وتجارة الملابس البيتي والبيجامات التركية والهوم وير. أسعار المصنع الحقيقية من الكردي - المنصورة لجميع أنحاء الجمهورية.
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
              <span>133k متابع على فيسبوك</span>
              <span aria-hidden="true">·</span>
              <span>1,480+ تقييم 5 نجوم</span>
              <span aria-hidden="true">·</span>
              <span>محمود موسى</span>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="font-bold text-white block text-sm">أقسام المتجر:</span>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  كولكشن البيجامات والميلتون
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-white transition-colors cursor-pointer text-rose-400"
                >
                  عروض الأوكازيون والتوفير
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  تقييمات وتجارب الزبائن
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('story')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  عن إدارة مصنع الفنان
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  عنوان المعرض بالكردي
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support & Orders Col */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <span className="font-bold text-white block text-sm">خدمة العملاء والطلبات:</span>
            <p className="text-stone-400">
              للاستفسارات وحجز طلبيات العرائس والجملة:
            </p>
            <div className="space-y-2 pt-1 font-mono text-stone-300">
              <a
                href={`tel:${STORE_INFO.phone1}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>{STORE_INFO.phone1}</span>
              </a>
              <a
                href={`tel:${STORE_INFO.phone2}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>{STORE_INFO.phone2}</span>
              </a>
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب المبيعات المباشر</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} مصنع ومول الفنان للملابس البيتى الجاهزة - الكردي، المنصورة.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors p-1 cursor-pointer"
          >
            <span>العودة للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
