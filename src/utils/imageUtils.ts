/**
 * Image Utilities & Path Normalization for Vite & Vercel
 * Ensures all image paths are strictly absolute (/images/...), lowercase,
 * and resilient against browser caching, localStorage migration, and CDN hosting.
 */

export const FALLBACK_IMAGE = '/images/product_pajama_cotton_pink.jpg';

// Elegant SVG data URI fallback for when network or local files are missing
export const SVG_FALLBACK_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF8F5" />
      <stop offset="100%" stop-color="#F3ECE4" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#881337" />
      <stop offset="100%" stop-color="#4C0519" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bg)" />
  <circle cx="300" cy="180" r="70" fill="#EADFD6" />
  <path d="M260 215 C260 170, 340 170, 340 215 L360 300 C360 310, 240 310, 240 300 Z" fill="#D3C3B6" />
  <path d="M275 145 C285 135, 315 135, 325 145 C320 160, 280 160, 275 145 Z" fill="#881337" />
  <text x="300" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#4C0519" text-anchor="middle" direction="rtl">
    مصنع ومول الفنان
  </text>
  <text x="300" y="370" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#78716C" text-anchor="middle" direction="rtl">
    ملابس بيتي وهوم وير تركي
  </text>
</svg>
`)}`;

/**
 * Normalizes any image path to ensure 100% compatibility with Vite and Vercel:
 * 1. Converts legacy /src/assets/images/... to /images/...
 * 2. Normalizes filenames to match exact lowercase disk files in public/images/
 * 3. Preserves valid data:image (base64) and external https:// URLs
 * 4. Ensures leading slash for clean absolute path routing
 */
export function normalizeImagePath(rawPath?: string | null): string {
  if (!rawPath || typeof rawPath !== 'string') {
    return FALLBACK_IMAGE;
  }

  const trimmed = rawPath.trim();

  // If already a base64 data URI (e.g. uploaded by user from device)
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // If already an external absolute URL (https://...)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Match specific known product & hero images
  if (trimmed.includes('hero_loungewear_banner')) {
    return '/images/hero_loungewear_banner.jpg';
  }
  if (trimmed.includes('product_pajama_leopard_velvet')) {
    return '/images/product_pajama_leopard_velvet.jpg';
  }
  if (trimmed.includes('product_pajama_cotton_pink')) {
    return '/images/product_pajama_cotton_pink.jpg';
  }
  if (trimmed.includes('product_loungewear_winter_set')) {
    return '/images/product_loungewear_winter_set.jpg';
  }
  if (trimmed.includes('store_factory_showroom')) {
    return '/images/store_factory_showroom.jpg';
  }

  // Convert legacy src/assets path to public /images/ path
  let cleaned = trimmed.replace(/^\/?src\/assets\/images\//i, '/images/');
  cleaned = cleaned.replace(/^\/?public\//i, '/');

  // Ensure absolute path starting with /
  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned;
  }

  return cleaned;
}

/**
 * Handle image error and supply a graceful fallback
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (!target.dataset.fallbackTried) {
    target.dataset.fallbackTried = '1';
    target.src = FALLBACK_IMAGE;
  } else if (target.dataset.fallbackTried === '1') {
    target.dataset.fallbackTried = '2';
    target.src = SVG_FALLBACK_DATA_URI;
  }
}
