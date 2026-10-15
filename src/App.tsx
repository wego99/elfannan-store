import React, { useState, useEffect } from 'react';
import { Product, Review, CartItem, User } from './types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, STORE_INFO } from './data/mockData';
import { normalizeImagePath } from './utils/imageUtils';
import {
  fetchProductsFromSupabase,
  addProductToSupabase,
  deleteProductFromSupabase,
  seedProductsToSupabase,
} from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductModal } from './components/ProductModal';
import { ReviewsSection } from './components/ReviewsSection';
import { FactoryStory } from './components/FactoryStory';
import { SpecialOffers } from './components/SpecialOffers';
import { LocationAndContact } from './components/LocationAndContact';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { LuckyWheelModal, WheelPrize, WHEEL_PRIZES } from './components/LuckyWheelModal';
import { FloatingWheelTrigger } from './components/FloatingWheelTrigger';
import { AuthModal } from './components/AuthModal';
import { AddProductModal } from './components/AddProductModal';

export default function App() {
  // Products with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('el_fannan_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map((p) => ({
          ...p,
          image: normalizeImagePath(p.image),
        }));
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // Current logged in user (admin or customer)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('el_fannan_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Cart with LocalStorage Persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('el_fannan_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((item) => ({
          ...item,
          product: {
            ...item.product,
            image: normalizeImagePath(item.product.image),
          },
        }));
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });
  
  // Reviews with LocalStorage Persistence
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('el_fannan_reviews');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  // Applied Wheel / Promo Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<WheelPrize | null>(() => {
    try {
      const saved = localStorage.getItem('el_fannan_won_coupon');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Supabase Database Sync State
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);
  const [supabaseProductCount, setSupabaseProductCount] = useState(0);
  const [rlsWarning, setRlsWarning] = useState(false);

  // Fetch products from Supabase on mount
  const loadProducts = async () => {
    setIsSupabaseLoading(true);
    try {
      const { data, error, isEmpty } = await fetchProductsFromSupabase();
      if (error) {
        console.warn('Supabase fetch error, fallback to local products:', error);
      } else if (data && data.length > 0) {
        setProducts(data);
        setSupabaseProductCount(data.length);
      } else if (isEmpty) {
        setSupabaseProductCount(0);
      }
    } catch (e) {
      console.error('Supabase load error:', e);
    } finally {
      setIsSupabaseLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Sync products to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('el_fannan_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Sync current user to LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('el_fannan_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('el_fannan_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Sync reviews to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('el_fannan_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Sync cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('el_fannan_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync applied coupon to LocalStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('el_fannan_won_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('el_fannan_won_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  // Total items in cart
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Add to cart default
  const handleAddToCart = (product: Product) => {
    const defaultSize = product.sizes[0] || 'L';
    const defaultColor = product.colors[0]?.name || 'الافتراضي';
    handleAddToCartWithOptions(product, defaultSize, defaultColor, 1);
  };

  // Add to cart with custom size, color, quantity
  const handleAddToCartWithOptions = (
    product: Product,
    selectedSize: string,
    selectedColor: string,
    quantity: number
  ) => {
    const itemId = `${product.id}-${selectedSize}-${selectedColor}`;
    
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          quantity,
          selectedSize,
          selectedColor,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Coupon handlers
  const handleApplyPrizeToCart = (prize: WheelPrize) => {
    setAppliedCoupon(prize);
    setIsCartOpen(true);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleApplyPromoCode = (code: string): boolean => {
    const found = WHEEL_PRIZES.find(
      (p) => p.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (found) {
      setAppliedCoupon(found);
      return true;
    }
    return false;
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Admin Add Product Handler with Supabase cloud persistence
  const handleAddProduct = async (
    newProd: Product
  ): Promise<{ success: boolean; rlsError?: boolean }> => {
    const sanitizedProd: Product = {
      ...newProd,
      image: normalizeImagePath(newProd.image),
    };

    // 1. Save directly to Supabase products table (columns: title, price, image)
    const { data: supaData, error: supaError, rlsError } = await addProductToSupabase({
      title: sanitizedProd.title,
      price: sanitizedProd.price,
      image: sanitizedProd.image,
    });

    if (rlsError) {
      setRlsWarning(true);
    }

    // Attach generated database ID if available
    const finalProduct: Product = {
      ...sanitizedProd,
      id: supaData?.id ? String(supaData.id) : sanitizedProd.id,
    };

    setProducts((prev) => [finalProduct, ...prev]);

    if (!rlsError && supaData) {
      setSupabaseProductCount((c) => c + 1);
    }

    return { success: !supaError, rlsError };
  };

  // Admin Delete Product Handler with Supabase deletion
  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    const { error, rlsError } = await deleteProductFromSupabase(productId);
    if (rlsError) {
      setRlsWarning(true);
    } else if (!error) {
      setSupabaseProductCount((c) => Math.max(0, c - 1));
    }
  };

  // Admin Seed Products to Supabase
  const handleSeedSupabase = async () => {
    setIsSupabaseLoading(true);
    try {
      const { count, error, rlsError } = await seedProductsToSupabase(products);
      if (rlsError) {
        setRlsWarning(true);
      } else if (count > 0) {
        setSupabaseProductCount(count);
        await loadProducts();
      }
    } finally {
      setIsSupabaseLoading(false);
    }
  };

  // Add new customer review
  const handleAddReview = (
    newRev: Omit<Review, 'id' | 'date' | 'likes' | 'verified'>
  ) => {
    const createdReview: Review = {
      ...newRev,
      id: 'rev-' + Date.now(),
      date: 'الآن',
      likes: 1,
      verified: true,
    };
    setReviews((prev) => [createdReview, ...prev]);
  };

  // Like review handler
  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const hasLiked = !!r.hasLiked;
          return {
            ...r,
            hasLiked: !hasLiked,
            likes: hasLiked ? r.likes - 1 : r.likes + 1,
          };
        }
        return r;
      })
    );
  };

  // Navigation scroll helper
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const comboOfferProduct = products.find((p) => p.id === 'prod-offer-1') || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-['Cairo',sans-serif]">
      {/* Top Navbar with Account, Admin triggers, and Wheel Quick Trigger */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        onOpenWheel={() => setIsWheelOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAddProduct={() => setIsAddProductModalOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCatalog={() => handleNavigate('catalog')}
          onExploreReviews={() => handleNavigate('reviews')}
        />

        {/* Special Offers Banner */}
        <SpecialOffers
          onQuickView={(p) => setQuickViewProduct(p)}
          offerProduct={comboOfferProduct}
        />

        {/* Product Catalog with Admin controls and Supabase database status */}
        <ProductCatalog
          products={products}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={handleAddToCart}
          isAdmin={currentUser?.role === 'admin'}
          onOpenAddProduct={() => setIsAddProductModalOpen(true)}
          onDeleteProduct={handleDeleteProduct}
          supabaseProductCount={supabaseProductCount}
          isSupabaseLoading={isSupabaseLoading}
          rlsWarning={rlsWarning}
          onRefreshSupabase={loadProducts}
          onSeedSupabase={handleSeedSupabase}
        />

        {/* Authentic Customer Reviews Section */}
        <ReviewsSection
          reviews={reviews}
          onAddReview={handleAddReview}
          onLikeReview={handleLikeReview}
        />

        {/* Factory Story & Showroom */}
        <FactoryStory />

        {/* Location & Contact Information */}
        <LocationAndContact />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Lucky Wheel Trigger Button */}
      <FloatingWheelTrigger
        onOpenWheel={() => setIsWheelOpen(true)}
        hasWonDiscount={!!appliedCoupon}
      />

      {/* Lucky Wheel Modal */}
      <LuckyWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        onApplyPrizeToCart={handleApplyPrizeToCart}
      />

      {/* Quick View Product Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCartWithOptions={handleAddToCartWithOptions}
      />

      {/* Slide-over Shopping Cart Drawer with Promo & Coupon Support */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        appliedCoupon={appliedCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onApplyPromoCode={handleApplyPromoCode}
      />

      {/* Authentication Modal (Login / Register / Pre-configured admin) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Admin Add Product Modal with Dedicated Discount Buttons */}
      <AddProductModal
        isOpen={isAddProductModalOpen && currentUser?.role === 'admin'}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
