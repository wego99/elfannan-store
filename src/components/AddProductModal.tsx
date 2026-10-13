import React, { useState, useRef } from 'react';
import { X, Plus, Percent, Tag, Sparkles, Image as ImageIcon, ShieldCheck, Check, Upload, Camera, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { handleImageError, normalizeImagePath } from '../utils/imageUtils';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

const PRESET_IMAGES = [
  { label: 'بيجاما قطيفة تايجر', url: '/images/product_pajama_leopard_velvet.jpg' },
  { label: 'بيجاما قطن كشمير فلورا', url: '/images/product_pajama_cotton_pink.jpg' },
  { label: 'طقم هودي صوف شتوي', url: '/images/product_loungewear_winter_set.jpg' },
  { label: 'كولكشن بيتي تركي فاخر', url: '/images/hero_loungewear_banner.jpg' },
];

const PRESET_FABRICS = [
  'ميلتون قطني تركي مبطن فائق النعومة والدفء',
  'قطن مصري 100% معالج ضد الانكماش',
  'قطيفة كوري سوبر ناعمة ولمعة هادئة',
  'صوف وبولار تركي دبل فيس ناعم',
  'قطن ليكرا معالج عالي المرونة',
];

const AVAILABLE_SIZES = ['M', 'L', 'XL', '2XL', '3XL', 'Oversize'];

const AVAILABLE_COLORS = [
  { name: 'كشمير', hex: '#f472b6' },
  { name: 'أسود ملكي', hex: '#18181b' },
  { name: 'رمادي', hex: '#6b7280' },
  { name: 'كحلي', hex: '#1e3a8a' },
  { name: 'نبيتي', hex: '#831843' },
  { name: 'كافيه', hex: '#78350f' },
  { name: 'أوف وايت', hex: '#fafaf9' },
];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('CODE ' + Math.floor(400 + Math.random() * 200));
  const [category, setCategory] = useState<Product['category']>('winter');
  const [price, setPrice] = useState<number>(380);
  const [originalPrice, setOriginalPrice] = useState<number>(480);
  const [activeDiscountPercent, setActiveDiscountPercent] = useState<number>(20);
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_IMAGES[0].url);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fabric, setFabric] = useState<string>(PRESET_FABRICS[0]);
  const [badge, setBadge] = useState<string>('جديد الكولكشن');
  const [description, setDescription] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L', 'XL', '2XL']);
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([
    AVAILABLE_COLORS[0],
    AVAILABLE_COLORS[1],
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Dedicated Discounts Feature ("زرار الخصومات")
  const applyDiscountPreset = (percent: number) => {
    setActiveDiscountPercent(percent);
    const base = originalPrice > 0 ? originalPrice : 400;
    const discounted = Math.round(base * (1 - percent / 100));
    setPrice(discounted);
    if (!originalPrice || originalPrice <= discounted) {
      setOriginalPrice(base);
    }
    setBadge(`خصم ${percent}% خاص`);
  };

  const handleBasePriceChange = (val: number) => {
    setOriginalPrice(val);
    if (activeDiscountPercent > 0) {
      setPrice(Math.round(val * (1 - activeDiscountPercent / 100)));
    } else {
      setPrice(val);
    }
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
      }
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const toggleColor = (c: { name: string; hex: string }) => {
    if (selectedColors.some((col) => col.name === c.name)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((col) => col.name !== c.name));
      }
    } else {
      setSelectedColors([...selectedColors, c]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        setUploadedImage(base64);
        setSelectedImage(base64);
        setCustomImageUrl('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImage(null);
    setSelectedImage(PRESET_IMAGES[0].url);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const categoryLabels: Record<Product['category'], string> = {
      winter: 'بيجامات شتوي وميلتون',
      turkish: 'كولكشن تركي فاخر',
      cotton: 'كولكشن قطن وسمر كاجوال',
      velvet: 'قطيفة واستقبال',
      offers: 'عروض الأوكازيون والتخفيضات',
    };

    const rawImage = uploadedImage || (customImageUrl.trim() ? customImageUrl.trim() : selectedImage);
    const finalImage = rawImage.startsWith('data:image/') ? rawImage : normalizeImagePath(rawImage);

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      code: code.trim().toUpperCase(),
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category],
      price: Number(price) || 300,
      originalPrice: originalPrice > price ? Number(originalPrice) : undefined,
      image: finalImage,
      description: description.trim() || `موديل ${code} الحصري من مصنع وسنتر الفنان بخامات عالية الجودة وتقفيل ممتاز.`,
      fabric,
      sizes: selectedSizes,
      colors: selectedColors,
      inStock: true,
      rating: 5.0,
      reviewsCount: 1,
      badge: badge.trim() || undefined,
      features: ['خامة ثقيلة ممتازة', 'ثبات ألوان 100%', 'معاينة قبل الدفع'],
    };

    onAddProduct(newProduct);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-right flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                إضافة موديل جديد للكتالوج
              </h3>
              <span className="text-[11px] text-amber-300 font-medium">
                خاص بلوحة تحكم المدير (محمود موسى) 👑
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          
          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>تم إضافة الموديل بنجاح وأصبح متاحاً للزبائن بالكتالوج فوراً!</span>
            </div>
          )}

          {/* Row 1: Code and Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="font-bold text-stone-800 block mb-1">
                كود الموديل: *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="مثال: CODE 520"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono font-bold focus:outline-hidden focus:border-rose-900 text-right uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-stone-800 block mb-1">
                اسم وعنوان الموديل: *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: طقم بيجاما قطيفة كابوتشيه شتوي مطرز"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
              />
            </div>
          </div>

          {/* Row 2: Category and Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                قسم الكتالوج:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right cursor-pointer"
              >
                <option value="winter">بيجامات شتوي وميلتون</option>
                <option value="turkish">كولكشن تركي فاخر</option>
                <option value="cotton">كولكشن قطن وسمر كاجوال</option>
                <option value="velvet">قطيفة واستقبال</option>
                <option value="offers">عروض الأوكازيون والتخفيضات</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                الشارة المميزة (Badge):
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="جديد الكولكشن، الأكثر طلباً، تركي أصلي..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
              />
            </div>
          </div>

          {/* DEDICATED DISCOUNTS SECTION ("زرار الخصومات") */}
          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-950 flex items-center gap-1.5 text-xs">
                <Percent className="w-4 h-4 text-rose-700" />
                <span>زرار الخصومات والتسعير الفوري:</span>
              </span>
              <span className="text-[11px] text-rose-800 font-medium">
                احسب الخصم بضغطة زر
              </span>
            </div>

            {/* Quick Discount Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[10, 15, 20, 25, 30, 50].map((pct) => (
                <button
                  type="button"
                  key={pct}
                  onClick={() => applyDiscountPreset(pct)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDiscountPercent === pct
                      ? 'bg-rose-900 text-white shadow-xs'
                      : 'bg-white text-rose-950 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  خصم {pct}%
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setActiveDiscountPercent(0);
                  setPrice(originalPrice);
                  setBadge('سعر المصنع');
                }}
                className="px-2 py-1 rounded-lg text-xs text-stone-600 bg-white border border-stone-200 hover:bg-stone-100 cursor-pointer"
              >
                بدون خصم
              </button>
            </div>

            {/* Price inputs */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-0.5">
                  السعر الأصلي (قبل الخصم):
                </label>
                <div className="flex items-center bg-white border border-rose-200 rounded-xl px-2.5 py-1.5">
                  <input
                    type="number"
                    min="1"
                    value={originalPrice}
                    onChange={(e) => handleBasePriceChange(Number(e.target.value))}
                    className="w-full text-right font-mono font-bold text-stone-800 focus:outline-hidden"
                  />
                  <span className="text-stone-400 font-bold mr-1">ج.م</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-rose-900 block mb-0.5">
                  سعر البيع النهائي (المطلوب): *
                </label>
                <div className="flex items-center bg-white border border-rose-400 rounded-xl px-2.5 py-1.5">
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => {
                      setPrice(Number(e.target.value));
                      setActiveDiscountPercent(0);
                    }}
                    className="w-full text-right font-mono font-bold text-rose-950 focus:outline-hidden text-sm"
                  />
                  <span className="text-rose-900 font-bold mr-1">ج.م</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fabric Spec */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              مواصفات ونوع القماش:
            </label>
            <select
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right cursor-pointer"
            >
              {PRESET_FABRICS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Sizes Selector */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              المقاسات المتوفرة بالمخزن:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedSizes.includes(size)
                      ? 'bg-rose-950 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Selector */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              الألوان المتوفرة:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_COLORS.map((col) => {
                const isSelected = selectedColors.some((c) => c.name === col.name);
                return (
                  <button
                    type="button"
                    key={col.name}
                    onClick={() => toggleColor(col)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-950 bg-rose-50 text-rose-950 font-bold'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-stone-300 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Selection & Device File Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-800 block text-xs">
                صورة الموديل: *
              </label>
              <span className="text-[11px] text-rose-800 font-medium">
                يمكنك رفع صورة من جهازك أو اختيار كولكشن جاهز
              </span>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Device Upload Area */}
            {uploadedImage ? (
              <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={uploadedImage}
                    alt="الصورة المرفوعة"
                    className="w-16 h-16 object-cover rounded-xl border border-emerald-300 shadow-xs shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      تم رفع الصورة من جهازك بنجاح!
                    </span>
                    <span className="text-[11px] text-emerald-800 block">
                      سيتم حفظ هذه الصورة وعرضها للموديل بالمتجر.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-white hover:bg-stone-50 border border-emerald-300 rounded-lg text-[11px] font-bold text-stone-800 transition-colors cursor-pointer"
                  >
                    تغيير الصورة
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveUploadedImage}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                    title="حذف الصورة المرفوعة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 bg-stone-50 hover:bg-stone-100/80 border-2 border-dashed border-stone-300 hover:border-rose-800 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-900 group-hover:text-rose-950">
                  اضغط هنا لرفع صورة من جهازك أو الموبايل 📸
                </span>
                <span className="text-[11px] text-stone-500 mt-0.5">
                  يدعم صور الكاميرا، المعرض، وملفات (JPG, PNG, WEBP)
                </span>
              </div>
            )}

            {/* Presets or external URL */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-stone-600 block mb-1">
                أو اختر من صور كولكشن المصنع المجهزة:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_IMAGES.map((img) => {
                  const isSelected = selectedImage === img.url && !uploadedImage && !customImageUrl;
                  return (
                    <button
                      type="button"
                      key={img.url}
                      onClick={() => {
                        setSelectedImage(img.url);
                        setUploadedImage(null);
                        setCustomImageUrl('');
                      }}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer text-right group ${
                        isSelected
                          ? 'border-rose-900 shadow-md ring-2 ring-rose-900/20'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-14 object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                      />
                      <span className="block text-[10px] text-stone-700 truncate px-1 py-0.5">
                        {img.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-1">
              <input
                type="text"
                value={customImageUrl}
                onChange={(e) => {
                  setCustomImageUrl(e.target.value);
                  setUploadedImage(null);
                }}
                placeholder="أو ضع رابط صورة خارجية مخصصة (URL)..."
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-right text-[11px] focus:outline-hidden focus:border-rose-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              وصف الموديل وتفاصيل إضافية:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل القصة أو التبطين أو الاستخدام المنزلي..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-right resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-950 hover:bg-rose-900 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>نشر وإضافة الموديل فوراً</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
