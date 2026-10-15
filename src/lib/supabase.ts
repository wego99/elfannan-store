import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';
import { normalizeImagePath } from '../utils/imageUtils';

/**
 * Validates and normalizes the Supabase URL, guarding against misconfigured
 * environment variables (e.g. anon key passed as URL, malformed strings, etc.)
 */
function getCleanSupabaseUrl(raw?: string | null): string {
  const fallbackUrl = 'https://dmoywjqsgjhtjfojjvkn.supabase.co';
  if (!raw || typeof raw !== 'string') return fallbackUrl;
  let str = raw.trim().replace(/^["']|["']$/g, '');
  const match =
    str.match(/https?:\/\/[a-zA-Z0-9.-]+\.supabase\.co[^\s)"']*/i) ||
    str.match(/https?:\/\/[^\s)"']+/i);
  if (match) {
    str = match[0];
  }
  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    return fallbackUrl;
  }
  try {
    const u = new URL(str);
    return u.origin;
  } catch {
    return fallbackUrl;
  }
}

/**
 * Validates and normalizes the Supabase Anon Key.
 */
function getCleanSupabaseKey(raw?: string | null): string {
  const fallbackKey = 'sb_publishable_39lxXBB8wjC-snjxzkMAbQ_98raexy0';
  if (!raw || typeof raw !== 'string') return fallbackKey;
  let str = raw.trim().replace(/^["']|["']$/g, '');
  if (str.startsWith('http://') || str.startsWith('https://') || str.length < 15) {
    return fallbackKey;
  }
  return str;
}

export const SUPABASE_URL = getCleanSupabaseUrl(
  typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : undefined
);

export const SUPABASE_ANON_KEY = getCleanSupabaseKey(
  typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_ANON_KEY : undefined
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseProductRow {
  id: number | string;
  title: string;
  price: number;
  image: string;
  created_at?: string;
  [key: string]: any;
}

/**
 * Transforms a raw Supabase row (with title, price, image, id) into
 * the full Product structure used throughout the store UI.
 */
export function transformSupabaseToProduct(
  row: SupabaseProductRow,
  index: number = 0
): Product {
  const rowId = String(row.id ?? `sp-${index}`);
  const rowPrice = Number(row.price) || 280;
  const originalPrice = row.originalPrice
    ? Number(row.originalPrice)
    : Math.round(rowPrice * 1.3);

  // Assign standard attributes for home/loungewear catalog
  const categories: Product['category'][] = ['winter', 'turkish', 'cotton', 'velvet', 'offers'];
  const categoryLabels: Record<Product['category'], string> = {
    winter: 'بيجامات شتوي وميلتون',
    turkish: 'كولكشن تركي فاخر',
    cotton: 'كولكشن قطن وسمر كاجوال',
    velvet: 'قطيفة واستقبال',
    offers: 'عروض الأوكازيون والتخفيضات',
  };

  const assignedCategory: Product['category'] =
    row.category && categories.includes(row.category)
      ? row.category
      : categories[index % categories.length];

  return {
    id: rowId,
    code: row.code ? String(row.code) : `FN-${String(row.id || index + 101).padStart(3, '0')}`,
    title: row.title || 'منتج كولكشن الفنان',
    category: assignedCategory,
    categoryLabel: row.categoryLabel || categoryLabels[assignedCategory],
    price: rowPrice,
    originalPrice: originalPrice > rowPrice ? originalPrice : undefined,
    image: normalizeImagePath(row.image || '/images/product_pajama_cotton_pink.jpg'),
    description:
      row.description ||
      `موديل راقي من خامات قطنية وميلتون عالية الجودة من مصنع وسنتر الفنان بالكردي.`,
    fabric: row.fabric || 'قطن مصري أصلي / ميلتون مبطن ناعم',
    sizes: Array.isArray(row.sizes) && row.sizes.length > 0 ? row.sizes : ['M', 'L', 'XL', '2XL', '3XL'],
    colors:
      Array.isArray(row.colors) && row.colors.length > 0
        ? row.colors
        : [
            { name: 'كحلي ملكي', hex: '#1e3a8a' },
            { name: 'وردي هادئ', hex: '#f43f5e' },
            { name: 'رصاصي كلاسيك', hex: '#4b5563' },
          ],
    inStock: row.inStock !== false,
    rating: Number(row.rating) || 5.0,
    reviewsCount: Number(row.reviewsCount) || 14,
    badge: row.badge || (index === 0 ? 'الأكثر طلباً' : undefined),
    features: [
      'تقفيل مصنع عالي الدقة',
      'ثبات ألوان بعد الغسيل 100%',
      'معاينة كاملة قبل استلام الطلب',
    ],
  };
}

/**
 * Fetch all products from Supabase 'products' table.
 */
export async function fetchProductsFromSupabase(): Promise<{
  data: Product[] | null;
  error: any;
  isEmpty: boolean;
}> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.warn('Supabase fetch products error:', error);
      return { data: null, error, isEmpty: false };
    }

    if (!data || data.length === 0) {
      return { data: [], error: null, isEmpty: true };
    }

    const products = data.map((row, idx) => transformSupabaseToProduct(row, idx));
    return { data: products, error: null, isEmpty: false };
  } catch (err) {
    console.error('Unexpected Supabase fetch error:', err);
    return { data: null, error: err, isEmpty: false };
  }
}

/**
 * Insert a new product into Supabase 'products' table (strictly title, price, image).
 */
export async function addProductToSupabase(product: {
  title: string;
  price: number;
  image: string;
}): Promise<{
  data: SupabaseProductRow | null;
  error: any;
  rlsError: boolean;
}> {
  try {
    const payload = {
      title: product.title.trim(),
      price: Number(product.price),
      image: product.image,
    };

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select();

    if (error) {
      const isRls =
        error.code === '42501' ||
        (typeof error.message === 'string' && error.message.includes('row-level security'));
      return { data: null, error, rlsError: isRls };
    }

    return { data: data?.[0] || null, error: null, rlsError: false };
  } catch (err: any) {
    return { data: null, error: err, rlsError: false };
  }
}

/**
 * Delete a product from Supabase 'products' table by ID.
 */
export async function deleteProductFromSupabase(
  id: string | number
): Promise<{ error: any; rlsError: boolean }> {
  try {
    // If id is numeric or can be parsed to number, use it directly
    const numericId = Number(id);
    const target = isNaN(numericId) ? id : numericId;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', target);

    if (error) {
      const isRls =
        error.code === '42501' ||
        (typeof error.message === 'string' && error.message.includes('row-level security'));
      return { error, rlsError: isRls };
    }
    return { error: null, rlsError: false };
  } catch (err: any) {
    return { error: err, rlsError: false };
  }
}

/**
 * Bulk seed initial products into Supabase 'products' table.
 */
export async function seedProductsToSupabase(
  products: Product[]
): Promise<{ count: number; error: any; rlsError: boolean }> {
  try {
    const payload = products.map((p) => ({
      title: p.title,
      price: Number(p.price),
      image: p.image,
    }));

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select();

    if (error) {
      const isRls =
        error.code === '42501' ||
        (typeof error.message === 'string' && error.message.includes('row-level security'));
      return { count: 0, error, rlsError: isRls };
    }

    return { count: data?.length || 0, error: null, rlsError: false };
  } catch (err: any) {
    return { count: 0, error: err, rlsError: false };
  }
}
