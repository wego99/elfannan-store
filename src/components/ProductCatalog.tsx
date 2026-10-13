import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

type CategoryFilter = 'all' | 'winter' | 'turkish' | 'cotton' | 'velvet' | 'offers';

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onQuickView,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const categories = [
    { id: 'all', label: 'جميع الموديلات' },
    { id: 'winter', label: 'بيجامات شتوي وميلتون' },
    { id: 'turkish', label: 'كولكشن تركي فاخر' },
    { id: 'cotton', label: 'قطن وسمر كاجوال' },
    { id: 'velvet', label: 'قطيفة واستقبال' },
    { id: 'offers', label: '🔥 عروض الأوكازيون' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesCategory =
          activeCategory === 'all' ? true : item.category === activeCategory;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.code.toLowerCase().includes(query) ||
          item.fabric.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section id="catalog" className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-right space-y-2 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-900">
            <span>تشكيلة الموسم الحالية</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>أسعار الجملة للقطاعي</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-500">{products.length} موديل متوفر</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            كتالوج موديلات مصنع وسنتر الفنان
          </h2>
          <p className="text-sm text-stone-600 max-w-2xl">
            بيجامات شتوي وصيفي وهوم وير بأعلى تقفيل وخامات مستوردة، متوفر بجميع المقاسات والألوان مع كود الموديل لسهولة الطلب.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="bg-stone-50 rounded-2xl p-4 mb-8 border border-stone-200/80 space-y-4">
          
          {/* Top Row: Search Input & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو كود الموديل (مثال: 448، 466، ميلتون، تاج الملوك...)"
                className="w-full pr-10 pl-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-all text-right"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-bold px-1"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-stone-500 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2.5 px-3 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-rose-900 transition-colors text-right cursor-pointer"
              >
                <option value="featured">ترتيب حسب: الأكثر طلباً</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً من الزبائن</option>
              </select>
            </div>

          </div>

          {/* Bottom Row: Category Tabs (Functional Segmented Controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as CategoryFilter)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-950 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <Sparkles className="w-8 h-8 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-900 mb-1">
              لم نتمكن من العثور على موديلات تطابق بحثك
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              جرّب كتابة كود الموديل مثل "448" أو "466" أو اختيار فئة أخرى.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-bold text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            >
              عرض جميع الموديلات
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
