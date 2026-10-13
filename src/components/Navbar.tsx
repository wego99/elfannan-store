import React, { useState } from 'react';
import { ShoppingBag, Phone, MessageCircle, Menu, X, Sparkles, MapPin, User as UserIcon, Plus, Crown } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenWheel?: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenAddProduct?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onNavigate,
  onOpenWheel,
  currentUser,
  onOpenAuth,
  onOpenAddProduct,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center text-rose-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 ml-1 inline text-rose-400" />
              أوكازيون سنتر الفنان:
            </span>
            <span className="text-stone-300 hidden sm:inline">
              أسعار المصنع تبدأ من 150 ج.م • شحن لكافة المحافظات والدفع عند الاستلام مع المعاينة
            </span>
            {onOpenWheel && (
              <button
                onClick={onOpenWheel}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-full font-bold text-[11px] hover:brightness-110 transition-all cursor-pointer shadow-xs"
              >
                <span>🎡 عجلة الحظ: العب واكسب هدية فورية</span>
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4 text-stone-400 shrink-0 text-xs">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              الكردي - المنصورة
            </span>
            <span aria-hidden="true">·</span>
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank" 
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              خدمة العملاء: {STORE_INFO.phone1}
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Navigation Bar (Strict 3-zone contract) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single Brand Wordmark Element */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNavClick('hero')} 
              className="text-right group focus:outline-hidden"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-950 to-stone-900 text-rose-200 flex items-center justify-center font-bold text-lg shadow-sm border border-rose-900/40">
                  الفنان
                </div>
                <div>
                  <span className="block text-xl font-bold tracking-tight text-stone-900 group-hover:text-rose-950 transition-colors whitespace-nowrap">
                    مصنع وسنتر الفنان
                  </span>
                  <span className="block text-[11px] text-stone-500 font-medium whitespace-nowrap">
                    للملابس البيتي والتركية الجاهزة
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => handleNavClick('catalog')}
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              الموديلات والأسعار
            </button>
            <button
              onClick={() => handleNavClick('offers')}
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap text-rose-700 font-semibold"
            >
              عروض الأوكازيون
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              عن المصنع
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <span>آراء العملاء</span>
              <span className="text-xs bg-rose-50 text-rose-800 font-bold px-1.5 py-0.5 rounded-md border border-rose-200">
                ⭐ 4.9
              </span>
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              الفروع والتواصل
            </button>
          </nav>

          {/* Zone 3: Primary Action, User & Cart */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Admin Exclusive: Compact Add Product Button */}
            {currentUser?.role === 'admin' && onOpenAddProduct && (
              <button
                type="button"
                onClick={onOpenAddProduct}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 rounded-lg border border-amber-300/80 transition-all shadow-xs cursor-pointer whitespace-nowrap"
                title="إضافة موديل جديد للمصنع (خاص بالإدارة)"
              >
                <Plus className="w-3.5 h-3.5 text-amber-800" />
                <span>+ إضافة منتج 👑</span>
              </button>
            )}

            {/* User Account / Login Button */}
            {currentUser ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className={`px-3 py-2 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentUser.role === 'admin'
                    ? 'text-rose-950 bg-rose-50 hover:bg-rose-100 border-rose-200'
                    : 'text-stone-800 bg-stone-100 hover:bg-stone-200 border-stone-200'
                }`}
              >
                {currentUser.role === 'admin' ? (
                  <>
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>المدير (admin)</span>
                  </>
                ) : (
                  <>
                    <UserIcon className="w-3.5 h-3.5 text-stone-600" />
                    <span className="truncate max-w-[85px]">{currentUser.name}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3 py-2 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                <span>دخول / حسابي</span>
              </button>
            )}

            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent('السلام عليكم، أرغب بالاستفسار عن كولكشن مصنع الفنان للملابس البيتي')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>واتساب</span>
            </a>

            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-all cursor-pointer flex items-center gap-2 border border-stone-200"
              aria-label="حقيبة التسوق"
            >
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <span className="hidden sm:inline text-xs font-bold text-stone-800">السلة</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in duration-150">
            <button
              onClick={() => handleNavClick('catalog')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              الموديلات والأسعار
            </button>
            <button
              onClick={() => handleNavClick('offers')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-medium text-rose-700 hover:bg-rose-50"
            >
              عروض الأوكازيون والتخفيضات
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              عن مصنع الفنان
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-50 flex items-center justify-between"
            >
              <span>تقييمات وآراء العملاء</span>
              <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">4.9 / 5</span>
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-right py-2.5 px-3 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              الفروع وأرقام التواصل
            </button>
            {onOpenWheel && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWheel();
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-100 to-rose-100 border border-amber-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🎡 جرب حظك واربح كوبون هدية فوري</span>
              </button>
            )}

            {/* Account / Admin Trigger in Mobile Menu */}
            <div className="pt-1 border-t border-stone-100 space-y-1.5">
              {currentUser?.role === 'admin' && onOpenAddProduct && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAddProduct();
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-800" />
                  <span>+ إضافة موديل جديد (خاص بالمدير) 👑</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-stone-600" />
                <span>{currentUser ? `حساب: ${currentUser.name}` : 'تسجيل الدخول / إنشاء حساب'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 text-center text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                محادثة واتساب سريعة
              </a>
              <a
                href={`tel:${STORE_INFO.phone1}`}
                className="w-full py-2.5 text-center text-xs font-semibold text-stone-800 bg-stone-100 rounded-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-stone-600" />
                اتصال هاتفي: {STORE_INFO.phone1}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
