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
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden text-ellipsis whitespace-nowrap w-full sm:w-auto justify-center sm:justify-start">
            <span className="inline-flex items-center text-rose-300 font-bold text-[11px] sm:text-xs shrink-0">
              <Sparkles className="w-3 h-3 ml-1 inline text-rose-400" />
              أوكازيون الفنان:
            </span>
            <span className="text-stone-300 text-[11px] sm:text-xs truncate">
              أسعار المصنع تبدأ من 150 ج.م • شحن لكافة المحافظات والدفع مع المعاينة
            </span>
            {onOpenWheel && (
              <button
                onClick={onOpenWheel}
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-full font-bold text-[11px] hover:brightness-110 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <span>🎡 عجلة الحظ</span>
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Zone 1: Single Brand Wordmark Element */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <button 
              onClick={() => handleNavClick('hero')} 
              className="text-right group focus:outline-hidden flex items-center gap-2 sm:gap-2.5 min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-950 to-stone-900 text-rose-200 flex items-center justify-center font-bold text-base sm:text-lg shadow-sm border border-rose-900/40 shrink-0">
                الفنان
              </div>
              <div className="min-w-0 text-right">
                <span className="block text-base sm:text-xl font-bold tracking-tight text-stone-900 group-hover:text-rose-950 transition-colors whitespace-nowrap">
                  مصنع وسنتر الفنان
                </span>
                <span className="hidden sm:block text-[11px] text-stone-500 font-medium whitespace-nowrap">
                  للملابس البيتي والتركية الجاهزة
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean Nav Links (Anti-slop, clean typography) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => handleNavClick('catalog')}
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              الموديلات والأسعار
            </button>
            <button
              onClick={() => handleNavClick('offers')}
              className="hover:text-rose-950 text-rose-900 font-semibold transition-colors cursor-pointer whitespace-nowrap"
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
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              <span>آراء العملاء</span>
              <span className="text-xs text-amber-600 font-bold">★ 4.9</span>
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              الفروع والتواصل
            </button>
          </nav>

          {/* Zone 3: Primary Action, User & Cart (Harmonized, anti-clash) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* If Admin: Single Elegant Management Control */}
            {currentUser?.role === 'admin' ? (
              <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl border border-stone-200 shadow-2xs">
                {onOpenAddProduct && (
                  <button
                    type="button"
                    onClick={onOpenAddProduct}
                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-rose-950 hover:bg-rose-900 rounded-lg transition-all shadow-xs cursor-pointer whitespace-nowrap"
                    title="لوحة تحكم وتعديل وحذف الموديلات"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">إدارة الموديلات</span>
                    <span className="sm:hidden text-[11px]">الإدارة</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-2 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  title="بيانات الحساب وتسجيل الخروج"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden md:inline">المدير</span>
                </button>
              </div>
            ) : (
              /* Customer Login - Hidden on mobile phones, accessible via mobile hamburger menu */
              <button
                type="button"
                onClick={onOpenAuth}
                className="hidden sm:flex px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                <span>{currentUser ? currentUser.name : 'دخول / حسابي'}</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 sm:p-2.5 sm:px-3 text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-stone-200/90 shadow-2xs"
              aria-label="حقيبة التسوق"
            >
              <ShoppingBag className="w-4 h-4 text-stone-800" />
              <span className="hidden sm:inline text-xs font-bold text-stone-800">السلة</span>
              {cartCount > 0 && (
                <span className="bg-rose-900 text-white text-[11px] font-bold px-1.5 min-w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-950 rounded-xl hover:bg-stone-100 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in duration-150">
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
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-rose-950 hover:bg-rose-900 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>إدارة وتعديل الموديلات</span>
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
