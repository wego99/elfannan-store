import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  Tag,
  Sparkles,
  Image as ImageIcon,
  ShieldCheck,
  Check,
  Upload,
  Camera,
  Trash2,
  Pencil,
  Search,
  ListFilter,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Product, User } from '../types';
import { handleImageError, normalizeImagePath } from '../utils/imageUtils';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => Promise<{ success: boolean; rlsError?: boolean } | void> | void;
  onUpdateProduct?: (product: Product) => Promise<{ success: boolean; rlsError?: boolean } | void> | void;
  onDeleteProduct?: (id: string) => Promise<void> | void;
  editingProduct?: Product | null;
  onClearEditingProduct?: () => void;
  allProducts?: Product[];
  currentUser?: User | null;
  onOpenAuth?: () => void;
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
  onUpdateProduct,
  onDeleteProduct,
  editingProduct = null,
  onClearEditingProduct,
  allProducts = [],
  currentUser = null,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'manage'>('form');

  // Form Fields State
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  // Manage Tab State
  const [manageSearch, setManageSearch] = useState('');
  const [manageCategoryFilter, setManageCategoryFilter] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Synchronize fields when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title || '');
      setCode(editingProduct.code || '');
      setCategory(editingProduct.category || 'winter');
      setPrice(editingProduct.price || 300);
      setOriginalPrice(editingProduct.originalPrice || Math.round((editingProduct.price || 300) * 1.25));
      setFabric(editingProduct.fabric || PRESET_FABRICS[0]);
      setBadge(editingProduct.badge || '');
      setDescription(editingProduct.description || '');
      setSelectedSizes(editingProduct.sizes && editingProduct.sizes.length > 0 ? editingProduct.sizes : ['M', 'L', 'XL', '2XL']);
      setSelectedColors(
        editingProduct.colors && editingProduct.colors.length > 0
          ? editingProduct.colors
          : [AVAILABLE_COLORS[0], AVAILABLE_COLORS[1]]
      );

      if (editingProduct.image) {
        if (editingProduct.image.startsWith('data:image/')) {
          setUploadedImage(editingProduct.image);
          setSelectedImage(editingProduct.image);
          setCustomImageUrl('');
        } else {
          setUploadedImage(null);
          setCustomImageUrl(editingProduct.image);
          setSelectedImage(editingProduct.image);
        }
      }
      setActiveTab('form');
    }
  }, [editingProduct]);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email === 'wageh8918@gmail.com';

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

  const handleResetToNew = () => {
    if (onClearEditingProduct) onClearEditingProduct();
    setTitle('');
    setCode('CODE ' + Math.floor(400 + Math.random() * 200));
    setCategory('winter');
    setPrice(380);
    setOriginalPrice(480);
    setActiveDiscountPercent(20);
    setSelectedImage(PRESET_IMAGES[0].url);
    setUploadedImage(null);
    setCustomImageUrl('');
    setFabric(PRESET_FABRICS[0]);
    setBadge('جديد الكولكشن');
    setDescription('');
    setSelectedSizes(['M', 'L', 'XL', '2XL']);
    setSelectedColors([AVAILABLE_COLORS[0], AVAILABLE_COLORS[1]]);
    setActiveTab('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim() || isSubmitting) return;

    const categoryLabels: Record<Product['category'], string> = {
      winter: 'بيجامات شتوي وميلتون',
      turkish: 'كولكشن تركي فاخر',
      cotton: 'كولكشن قطن وسمر كاجوال',
      velvet: 'قطيفة واستقبال',
      offers: 'عروض الأوكازيون والتخفيضات',
    };

    const rawImage = uploadedImage || (customImageUrl.trim() ? customImageUrl.trim() : selectedImage);
    const finalImage = rawImage.startsWith('data:image/') ? rawImage : normalizeImagePath(rawImage);

    setIsSubmitting(true);

    if (editingProduct && onUpdateProduct) {
      // EDIT MODE
      setSubmitFeedback('جاري حفظ التعديل في Supabase (جدول products)...');
      const updatedProduct: Product = {
        ...editingProduct,
        code: code.trim().toUpperCase(),
        title: title.trim(),
        category,
        categoryLabel: categoryLabels[category],
        price: Number(price) || 300,
        originalPrice: originalPrice > price ? Number(originalPrice) : undefined,
        image: finalImage,
        description: description.trim() || editingProduct.description,
        fabric,
        sizes: selectedSizes,
        colors: selectedColors,
        badge: badge.trim() || undefined,
      };

      try {
        const res = await onUpdateProduct(updatedProduct);
        if (res && res.rlsError) {
          setSubmitFeedback('تم تعديل الموديل محلياً! (ملاحظة: Supabase بحاجة لصلاحية UPDATE في RLS)');
        } else {
          setSubmitFeedback('تم حفظ التعديلات بنجاح في Supabase والمتجر! ✅');
        }
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setSubmitFeedback(null);
          setIsSubmitting(false);
          handleResetToNew();
          onClose();
        }, 1200);
      } catch (err) {
        console.error(err);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setSubmitFeedback(null);
          setIsSubmitting(false);
          handleResetToNew();
          onClose();
        }, 1200);
      }
    } else {
      // ADD MODE
      setSubmitFeedback('جاري الحفظ في قاعدة بيانات Supabase (جدول products)...');
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

      try {
        const res = await onAddProduct(newProduct);
        if (res && (res as any).rlsError) {
          setSubmitFeedback('تم الحفظ محلياً! (يرجى مراجعة صلاحيات RLS في Supabase)');
        } else {
          setSubmitFeedback('تم الحفظ بنجاح في Supabase وموقع المتجر! ✅');
        }
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setSubmitFeedback(null);
          setIsSubmitting(false);
          handleResetToNew();
          onClose();
        }, 1200);
      } catch (err) {
        console.error(err);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setSubmitFeedback(null);
          setIsSubmitting(false);
          handleResetToNew();
          onClose();
        }, 1200);
      }
    }
  };

  const handleExecuteDelete = async (id: string) => {
    if (!onDeleteProduct) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(id);
      setConfirmDeleteId(null);
      if (editingProduct?.id === id) {
        handleResetToNew();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter products for the manage tab
  const filteredManageProducts = allProducts.filter((p) => {
    const matchesCategory = manageCategoryFilter === 'all' || p.category === manageCategoryFilter;
    const q = manageSearch.trim().toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-right flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold">
              لوحة الإدارة: إضافة وتعديل وإزالة الموديلات
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
              👑
            </div>
          </div>
        </div>

        {/* Admin Email Identity Verification Notice */}
        <div className="px-4 py-2.5 bg-amber-50/90 border-b border-amber-200 text-amber-950 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {isAdmin
                ? `صلاحيات الإدارة مفعلة عبر البريد المعتمد: wageh8918@gmail.com`
                : `تنبيه: يجب تسجيل الدخول ببريد الإدارة (wageh8918@gmail.com) لتفعيل الحفظ والحذف`}
            </span>
          </div>

          {!isAdmin && onOpenAuth && (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[11px] font-bold transition-colors cursor-pointer"
            >
              تسجيل الدخول كمدير
            </button>
          )}
        </div>

        {/* Navigation Tabs between Form & Product Manager */}
        <div className="flex border-b border-stone-200 bg-stone-50 p-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'form'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {editingProduct ? (
              <>
                <Pencil className="w-4 h-4 text-amber-600" />
                <span>تعديل الموديل ({editingProduct.code})</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-rose-700" />
                <span>إضافة موديل جديد للمتجر</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'manage'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ListFilter className="w-4 h-4 text-stone-700" />
            <span>إدارة وحذف الموديلات ({allProducts.length})</span>
          </button>
        </div>

        {/* Content Body */}
        {activeTab === 'form' ? (
          /* FORM TAB: Add or Edit */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
            {/* If Editing: Visual Notice Banner */}
            {editingProduct && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-3 text-amber-950">
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-extrabold block text-xs">
                      أنت الآن في وضع تعديل الموديل: {editingProduct.title}
                    </span>
                    <span className="text-[11px] text-amber-800">
                      سيتم تحديث السعر والبيانات مباشرة في جدول products بقاعدة بيانات Supabase.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetToNew}
                  className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 rounded-lg text-[11px] font-bold border border-stone-300 transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-stone-500" />
                  <span>إلغاء التعديل</span>
                </button>
              </div>
            )}

            {/* Title & Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="font-bold text-stone-800 block mb-1">
                  اسم ووصف الموديل: *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: بيجاما ميلتون شتوي مبطن فرو ناعم"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  كود الموديل: *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="CODE 448"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono focus:outline-hidden focus:border-rose-900 text-right uppercase"
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                قسم الموديل:
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

            {/* Dedicated Discount Button Controls */}
            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-rose-950 text-xs">
                  <Tag className="w-3.5 h-3.5 text-rose-800" />
                  <span>زرار الخصم السريع للأوكازيون (تخفيض المصنع المباشر):</span>
                </div>
                {activeDiscountPercent > 0 && (
                  <span className="text-[11px] font-bold text-rose-700">
                    خصم {activeDiscountPercent}% مفعل
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[10, 15, 20, 25, 30, 40, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => applyDiscountPreset(pct)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      activeDiscountPercent === pct
                        ? 'bg-rose-900 text-white border-rose-900 shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-rose-100 border-rose-200'
                    }`}
                  >
                    خصم {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  السعر بعد الخصم (سعر البيع النهائي ج.م): *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-hidden focus:border-rose-900 text-right"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  السعر الأصلي قبل الخصم (ج.م):
                </label>
                <input
                  type="number"
                  min={1}
                  value={originalPrice}
                  onChange={(e) => handleBasePriceChange(Number(e.target.value))}
                  placeholder="مثال: 450"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                />
              </div>
            </div>

            {/* Image Selection with live preview & upload */}
            <div className="space-y-2">
              <label className="font-bold text-stone-800 block">
                صورة الموديل:
              </label>

              {/* Live Preview */}
              <div className="flex items-center gap-4 p-3 bg-stone-50 border border-stone-200 rounded-2xl">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
                  <img
                    src={uploadedImage || (customImageUrl.trim() ? customImageUrl.trim() : selectedImage)}
                    alt="معاينة الموديل"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>

                <div className="flex-1 space-y-2 text-right">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>رفع صورة من الموبايل أو الكمبيوتر</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {uploadedImage && (
                      <button
                        type="button"
                        onClick={handleRemoveUploadedImage}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-semibold border border-rose-200 cursor-pointer"
                      >
                        إلغاء الصورة المرفوعة
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={customImageUrl}
                    onChange={(e) => {
                      setCustomImageUrl(e.target.value);
                      if (e.target.value.trim()) {
                        setUploadedImage(null);
                      }
                    }}
                    placeholder="أو اكتب رابط صورة مباشرة (https://...)"
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] text-stone-800 focus:outline-hidden text-right"
                  />
                </div>
              </div>

              {/* Preset Catalog Images Selector */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {PRESET_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img.url);
                      setUploadedImage(null);
                      setCustomImageUrl('');
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                      selectedImage === img.url && !uploadedImage && !customImageUrl
                        ? 'border-rose-900 ring-2 ring-rose-900/30'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-stone-900/80 text-white text-[9px] py-0.5 px-1 truncate text-center block">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric */}
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                وصف الخامة:
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="ميلتون قطني مبطن ناعم"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right mb-1.5"
              />
              <div className="flex flex-wrap gap-1">
                {PRESET_FABRICS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFabric(f)}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[10px] cursor-pointer"
                  >
                    {f.slice(0, 25)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes & Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Sizes */}
              <div>
                <label className="font-bold text-stone-800 block mb-1.5">
                  المقاسات المتوفرة بالمصنع:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_SIZES.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="font-bold text-stone-800 block mb-1.5">
                  الألوان المتاحة:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_COLORS.map((col) => {
                    const isSelected = selectedColors.some((c) => c.name === col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => toggleColor(col)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 text-rose-950 border-rose-300 ring-1 ring-rose-900/20'
                            : 'bg-stone-50 text-stone-600 border-stone-200'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-stone-300"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Badge input */}
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                شارة تمييز الموديل (اختياري):
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="مثال: الأكثر طلباً، عرسان 2026، خصم خاص"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                تفاصيل ووصف الموديل:
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="أضف تفاصيل الموديل، تقفيل التطريز، تعليمات الغسيل..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
              />
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              {submitFeedback ? (
                <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 w-full sm:w-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{submitFeedback}</span>
                </div>
              ) : (
                <span className="text-[11px] text-stone-500">
                  {editingProduct
                    ? 'سيتم تحديث الموديل مباشرة في Supabase'
                    : 'سيتم حفظ الموديل تلقائياً في جدول products بقاعدة بيانات Supabase'}
                </span>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition-colors cursor-pointer text-xs"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer text-xs text-white ${
                    isSubmitting
                      ? 'bg-stone-400 cursor-not-allowed'
                      : editingProduct
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-rose-950 hover:bg-rose-900'
                  }`}
                >
                  {isSubmitting ? (
                    <span>جاري الحفظ في Supabase...</span>
                  ) : editingProduct ? (
                    <>
                      <Pencil className="w-4 h-4" />
                      <span>حفظ تعديلات الموديل 💾</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>حفظ الموديل في Supabase ✨</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* MANAGE TAB: List all products with direct Edit & Delete */
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
            {/* Search and Filters inside modal */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manageSearch}
                  onChange={(e) => setManageSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو كود الموديل..."
                  className="w-full pr-9 pl-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden text-right text-xs"
                />
              </div>

              <select
                value={manageCategoryFilter}
                onChange={(e) => setManageCategoryFilter(e.target.value)}
                className="py-2 px-3 bg-white border border-stone-200 rounded-xl text-stone-800 text-xs text-right cursor-pointer"
              >
                <option value="all">كل الأقسام ({allProducts.length})</option>
                <option value="winter">بيجامات شتوي وميلتون</option>
                <option value="turkish">كولكشن تركي فاخر</option>
                <option value="cotton">كولكشن قطن وسمر كاجوال</option>
                <option value="velvet">قطيفة واستقبال</option>
                <option value="offers">عروض الأوكازيون</option>
              </select>
            </div>

            {/* Notice */}
            <div className="text-[11px] text-stone-500 flex items-center justify-between">
              <span>انقر فوق "تعديل" لتعديل بيانات أي موديل، أو "حذف" لإزالته نهائياً من Supabase والمتجر.</span>
              <span className="font-bold text-stone-700">{filteredManageProducts.length} موديل معروض</span>
            </div>

            {/* Products List */}
            {filteredManageProducts.length > 0 ? (
              <div className="space-y-2.5">
                {filteredManageProducts.map((p) => {
                  const isConfirming = confirmDeleteId === p.id;
                  return (
                    <div
                      key={p.id}
                      className="p-3 bg-stone-50 hover:bg-stone-100/70 rounded-2xl border border-stone-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3">
                        <img
                          src={normalizeImagePath(p.image)}
                          alt={p.title}
                          className="w-14 h-14 rounded-xl object-cover bg-stone-200 border border-stone-300 shrink-0"
                          onError={handleImageError}
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-rose-900 text-xs">
                              {p.code}
                            </span>
                            <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-sm">
                              {p.categoryLabel}
                            </span>
                          </div>
                          <h4 className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-1">
                            {p.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="font-extrabold text-stone-900">{p.price} ج.م</span>
                            {p.originalPrice && (
                              <span className="text-stone-400 line-through">{p.originalPrice} ج.م</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 justify-end sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                        {isConfirming ? (
                          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 p-1 rounded-xl">
                            <span className="text-[11px] font-bold text-rose-950 px-1.5">
                              تأكيد الحذف نهائياً؟
                            </span>
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleExecuteDelete(p.id)}
                              className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              {isDeleting ? 'جاري الحذف...' : 'نعم، احذف'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setTitle(p.title);
                                setCode(p.code);
                                setCategory(p.category);
                                setPrice(p.price);
                                setOriginalPrice(p.originalPrice || Math.round(p.price * 1.25));
                                setFabric(p.fabric || PRESET_FABRICS[0]);
                                setBadge(p.badge || '');
                                setDescription(p.description || '');
                                setSelectedSizes(p.sizes || ['M', 'L', 'XL', '2XL']);
                                setSelectedColors(p.colors || [AVAILABLE_COLORS[0], AVAILABLE_COLORS[1]]);
                                if (p.image.startsWith('data:image/')) {
                                  setUploadedImage(p.image);
                                  setSelectedImage(p.image);
                                } else {
                                  setCustomImageUrl(p.image);
                                  setSelectedImage(p.image);
                                }
                                if (editingProduct && editingProduct.id !== p.id) {
                                  if (onClearEditingProduct) onClearEditingProduct();
                                }
                                setActiveTab('form');
                              }}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5 text-amber-700" />
                              <span>تعديل</span>
                            </button>

                            {/* Delete Button */}
                            {onDeleteProduct && (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(p.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>حذف</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
                <p className="text-stone-500 text-xs">لا توجد موديلات تطابق البحث.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
