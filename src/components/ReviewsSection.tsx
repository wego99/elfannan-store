import React, { useState } from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus, CheckCircle2, Search, Filter, Sparkles } from 'lucide-react';
import { Review } from '../types';
import { GOVERNORATES } from '../data/mockData';

interface ReviewsSectionProps {
  reviews: Review[];
  onAddReview: (newReview: Omit<Review, 'id' | 'date' | 'likes' | 'verified'>) => void;
  onLikeReview: (reviewId: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onAddReview,
  onLikeReview,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New review form state
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState(GOVERNORATES[0]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(5);
  const [productCode, setProductCode] = useState('CODE 448 (تايجر شتوي)');
  const [comment, setComment] = useState('');
  const [recommends, setRecommends] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Statistics
  const totalReviews = reviews.length;
  const averageRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (totalReviews || 1)
  ).toFixed(1);

  const starCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesRating = filterRating === 'all' || r.rating === filterRating;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      r.author.toLowerCase().includes(query) ||
      r.city.toLowerCase().includes(query) ||
      r.comment.toLowerCase().includes(query) ||
      (r.productCode && r.productCode.toLowerCase().includes(query));
    return matchesRating && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    onAddReview({
      author: authorName.trim(),
      city,
      rating,
      comment: comment.trim(),
      productCode: productCode.trim() || undefined,
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowAddModal(false);
      // reset form
      setAuthorName('');
      setComment('');
    }, 1500);
  };

  return (
    <section id="reviews" className="py-16 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-right">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-900 mb-1">
              <span>مصداقية وتجارب حقيقية</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>133 ألف متابع على فيسبوك</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              تقييمات وآراء زبائن مصنع وسنتر الفنان
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl mt-1">
              تجارب موثقة لعملاء وعرائس من مختلف محافظات مصر بعد استلام ومعاينة منتجاتنا وخاماتنا على الطبيعة.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 text-xs font-bold text-white bg-rose-950 hover:bg-rose-900 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>شاركنا تجربتك واكتب تقييمك</span>
          </button>
        </div>

        {/* Rating Breakdown Scoreboard Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Score Big Display */}
            <div className="md:col-span-4 text-center md:text-right md:border-l md:border-stone-200/80 md:pl-6 space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-5xl font-black text-stone-900 tabular-nums">
                  {averageRating}
                </span>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-500 font-medium">من 5 نجوم</span>
                </div>
              </div>

              <p className="text-xs text-stone-600">
                مبني على <span className="font-bold text-stone-900 tabular-nums">1,480+</span> تقييم موثق من صفحاتنا الرسمية والطلبات المستلمة.
              </p>

              <div className="flex items-center justify-center md:justify-start gap-2 pt-2 text-[11px] text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>99% من العملاء يؤكدون مطابقة الخامة للفيديو</span>
              </div>
            </div>

            {/* Progress Bars for Stars */}
            <div className="md:col-span-5 space-y-2 text-right">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = starCounts[star as keyof typeof starCounts] || 0;
                const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-stone-600 font-bold shrink-0 tabular-nums">
                      {star} نجوم
                    </span>
                    <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-left text-stone-400 font-medium tabular-nums">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Satisfaction Highlights */}
            <div className="md:col-span-3 space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-100 text-right text-xs">
              <div className="font-bold text-stone-900 pb-1 border-b border-stone-200">
                أبرز ما يشيد به العملاء:
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>الخامات ثقيلة ولا تنكمش</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>المعاينة قبل دفع أي مليم</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>أسعار مصنع أرخص 40% من المحلات</span>
              </div>
            </div>

          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          
          {/* Star Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-stone-500 font-bold ml-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> تصفية:
            </span>
            <button
              onClick={() => setFilterRating('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterRating === 'all'
                  ? 'bg-rose-950 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              الكل ({reviews.length})
            </button>
            <button
              onClick={() => setFilterRating(5)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterRating === 5
                  ? 'bg-rose-950 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>5 نجوم ({starCounts[5]})</span>
            </button>
            <button
              onClick={() => setFilterRating(4)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                filterRating === 4
                  ? 'bg-rose-950 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>4 نجوم ({starCounts[4]})</span>
            </button>
          </div>

          {/* Search Reviews Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في التجارب والمدن..."
              className="w-full pr-9 pl-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-rose-900 transition-colors text-right"
            />
          </div>

        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between text-right space-y-4"
            >
              
              <div className="space-y-3">
                
                {/* Author Info & Avatar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-900 font-bold text-sm flex items-center justify-center shrink-0 border border-rose-200">
                      {rev.author.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900 text-sm">
                          {rev.author}
                        </span>
                        {rev.verified && (
                          <span 
                            title="مشتري موثق" 
                            className="text-emerald-700 text-xs flex items-center"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 inline" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500">
                        {rev.city}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-stone-400 tabular-nums">
                    {rev.date}
                  </span>
                </div>

                {/* Stars & Product Code */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-stone-200 fill-stone-100'
                        }`}
                      />
                    ))}
                  </div>

                  {rev.productCode && (
                    <span className="text-[11px] font-semibold text-rose-900 bg-rose-50 px-2 py-0.5 rounded-md">
                      {rev.productCode}
                    </span>
                  )}
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  "{rev.comment}"
                </p>

              </div>

              {/* Bottom Helpful Button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <button
                  onClick={() => onLikeReview(rev.id)}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                    rev.hasLiked
                      ? 'text-rose-900 bg-rose-50 font-bold'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${rev.hasLiked ? 'fill-rose-900' : ''}`} />
                  <span>مفيد للآخرين ({rev.likes})</span>
                </button>

                <span className="text-[11px] text-emerald-700 font-medium">
                  ✓ تم تأكيد استلام الطلب
                </span>
              </div>

            </article>
          ))}
        </div>

      </div>

      {/* Add Review Interactive Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 text-right space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  أضف تقييمك ورأيك في مصنع الفنان
                </h3>
                <p className="text-xs text-stone-500">
                  رأيك يساعد آلاف العرائس والزبائن على اختيار الموديلات المناسبة.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-stone-900">
                  شكراً لمشاركتك يا فندم!
                </h4>
                <p className="text-xs text-stone-600">
                  تم نشر تقييمك بنجاح وأصبح ظاهراً لجميع الزوار.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Rating Stars Input */}
                <div className="space-y-1.5 text-center bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <label className="text-xs font-bold text-stone-800 block">
                    ما هو تقييمك العام للمنتج والخامة؟
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(rating)}
                        className="p-1 cursor-pointer transition-transform hover:scale-120"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-amber-700 font-bold block">
                    {rating === 5 && 'ممتاز جداً 🌟 (خامة وتقفيل عالي)'}
                    {rating === 4 && 'جيد جداً 👍'}
                    {rating === 3 && 'جيد ومقبول'}
                    {rating < 3 && 'يحتاج لتحسين'}
                  </span>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-800 block">
                    اسمك أو اللقب: *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="مثال: أم عبد الرحمن، أو فاطمة أحمد"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 text-right focus:outline-hidden focus:border-rose-900"
                  />
                </div>

                {/* Governorate / City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-800 block">
                    المدينة أو المحافظة:
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 text-right focus:outline-hidden focus:border-rose-900 cursor-pointer"
                  >
                    {GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Code */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-800 block">
                    الموديل أو كود البيجاما:
                  </label>
                  <input
                    type="text"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="مثال: كود 448، كود 466، طقم تاج الملوك..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 text-right focus:outline-hidden focus:border-rose-900"
                  />
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-800 block">
                    تجربتك بالتفصيل (الخامة، المقاس، وسرعة الشحن): *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="اكتبي تجربتك الصادقة عن جودة القماش، المقاس، ومعاملة المندوب..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 text-right focus:outline-hidden focus:border-rose-900 resize-none"
                  />
                </div>

                {/* Recommend Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={recommends}
                    onChange={(e) => setRecommends(e.target.checked)}
                    className="rounded text-rose-950 focus:ring-0"
                  />
                  <span>نعم، أوصي بالشراء من مصنع الفنان للملابس الجاهزة</span>
                </label>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-rose-950 hover:bg-rose-900 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>نشر التقييم فوراً</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
