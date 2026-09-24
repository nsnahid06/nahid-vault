import React, { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { PRODUCTS, PROMO_CODES } from './data/products';
import { Product, Category, Size, ColorVariant, CartItem, SortOption, ShippingDetails, PaymentMethod, Order, ToastMessage } from './types';
import { Header, VibeTheme } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { PromoSaleBanner } from './components/PromoSaleBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { VoiceConversationModal } from './components/VoiceConversationModal';
import { LampLoginModal } from './components/LampLoginModal';
import { GlobalRegionSelector } from './components/GlobalRegionSelector';
import { ToastStack } from './components/Toast';
import { Footer } from './components/Footer';
import { SlidersHorizontal, ArrowUpDown, Sparkles, Filter, X, Heart, ShoppingBag, Mic } from 'lucide-react';
import { db, initAuth, logout } from './lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

import { AdminDashboard } from './components/AdminDashboard';
const CATEGORIES: Category[] = [
  'All',
  'Outerwear',
  'Formal Wear',
  'Casual Shirts',
  'Denim & Pants',
  'Footwear',
  'Accessories',
];

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLampLoginOpen, setIsLampLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // State variables
  const [vibeTheme, setVibeTheme] = useState<VibeTheme>('crimson');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const [cart, setCart] = useState<CartItem[]>([
    // Start with 1 default item so user sees active state
    {
      id: 'p1-M-#121212',
      product: PRODUCTS[0],
      selectedSize: 'M',
      selectedColor: PRODUCTS[0].colors[0],
      quantity: 1,
    }
  ]);

  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isRegionGatewayOpen, setIsRegionGatewayOpen] = useState(true);

  const [wishlist, setWishlist] = useState<string[]>(['p1', 'p2']);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountRate, setDiscountRate] = useState<number>(0);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => initAuth(setCurrentUser, () => setCurrentUser(null)), []);

  const currentUserName = currentUser?.displayName || currentUser?.email || 'Guest';

  // Helper for triggering toast
  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success', image?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type, image }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Category Match
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Search Match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesMaterial = product.material.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesMaterial && !matchesDesc) {
          return false;
        }
      }
      // In Stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'rating-desc') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); // Default 'featured'
    });
  }, [selectedCategory, searchQuery, inStockOnly, sortOption]);

  // Cart Operations
  const handleAddToCart = (
    product: Product,
    size: Size = 'M',
    color: ColorVariant = product.colors[0],
    quantity: number = 1
  ) => {
    const cartItemId = `${product.id}-${size}-${color.hex}`;
    
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { id: cartItemId, product, selectedSize: size, selectedColor: color, quantity }];
      }
    });

    addToast(
      'Added to Shopping Bag',
      `${product.title} (${size} / ${color.name})`,
      'success',
      product.images[0]
    );
  };

  const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(product, 'M', product.colors[0], 1);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    const item = cart.find((i) => i.id === cartItemId);
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    if (item) {
      addToast('Item Removed', `Removed ${item.product.title} from bag`, 'info');
    }
  };

  const handleClearCart = () => {
    setCart([]);
    addToast('Bag Cleared', 'All items removed from your shopping bag', 'info');
  };

  // Wishlist Logic
  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        addToast('Wishlist Updated', `Removed ${product.title} from wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        addToast('Saved to Wishlist', `Added ${product.title} to wishlist`, 'success', product.images[0]);
        return [...prev, product.id];
      }
    });
  };

  // Promo Code
  const handleApplyPromo = (code: string) => {
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setDiscountRate(PROMO_CODES[code]);
      addToast('Promo Code Applied', `Coupon '${code}' applied successfully!`, 'success');
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscountRate(0);
    addToast('Promo Code Removed', 'Discount removed', 'info');
  };

  // Checkout & Order Completion
  const handleCompleteOrder = async (shippingDetails: ShippingDetails, paymentMethod: PaymentMethod) => {
    if (!currentUser) {
      setIsCheckoutOpen(false);
      setIsLampLoginOpen(true);
      addToast('Sign In Required', 'Please sign in before placing an order.', 'warning');
      return;
    }
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discount = subtotal * discountRate;
    const discountedSubtotal = subtotal - discount;
    const shippingFee = subtotal >= 150 ? 0 : 12;
    const tax = discountedSubtotal * 0.08;
    const total = discountedSubtotal + shippingFee + tax;

    const newOrder: Order = {
      id: `GNT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      shippingDetails,
      paymentMethod,
      subtotal,
      discount,
      tax,
      shippingFee,
      total,
      estimatedDelivery: '3-5 Business Days (Express)',
    };

    setOrdersList((prev) => [newOrder, ...prev]);
    setCompletedOrder(newOrder);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCart([]); // Reset cart

    // Save order securely to Firestore
    const pathForOrder = `orders/${newOrder.id}`;
    try {
      await setDoc(doc(db, 'orders', newOrder.id), {
        ...newOrder,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });
      addToast('Order Saved!', `Order ${newOrder.id} stored in Firestore`, 'success');
    } catch (err) {
      console.warn('Firestore write warning:', err);
      addToast('Order Placed!', `Order ${newOrder.id} saved locally`, 'info');
    }

  };

  const spotlightGlows = useMemo(() => {
    switch (vibeTheme) {
      case 'midnight':
        return { top: 'bg-sky-500/25', bottom: 'bg-indigo-600/30' };
      case 'crimson':
        return { top: 'bg-rose-500/25', bottom: 'bg-red-700/30' };
      case 'emerald':
        return { top: 'bg-emerald-500/25', bottom: 'bg-teal-700/30' };
      case 'bourbon':
        return { top: 'bg-amber-500/25', bottom: 'bg-orange-600/30' };
      case 'violet':
        return { top: 'bg-purple-500/25', bottom: 'bg-fuchsia-600/30' };
      case 'obsidian':
      default:
        return { top: 'bg-amber-500/20', bottom: 'bg-indigo-500/20' };
    }
  }, [vibeTheme]);

  if (isAdminOpen) {
    return <AdminDashboard
      onBack={() => setIsAdminOpen(false)}
      onSignOut={async () => {
        await logout();
        setIsAdminOpen(false);
      }}
      userId={currentUser?.uid}
      currentUser={currentUserName}
    />;
  }

  return (
    <div
      data-vibe={vibeTheme}
      className="min-h-screen text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black relative overflow-x-hidden transition-all duration-700"
    >
      


      {/* Toast Overlay */}
      <ToastStack toasts={toasts} onDismiss={removeToast} />

      {/* Navigation Header */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(!isWishlistOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={CATEGORIES}
        vibeTheme={vibeTheme}
        onSelectVibe={setVibeTheme}
        onOpenVoiceConversation={() => setIsVoiceModalOpen(true)}
        onOpenRegionGateway={() => setIsRegionGatewayOpen(true)}
        onOpenAdminLogin={() => currentUser ? setIsAdminOpen(true) : setIsLampLoginOpen(true)}
      />

      {/* Global Landing Gateway / Region Selector Overlay */}
      <GlobalRegionSelector
        isOpen={isRegionGatewayOpen}
        onExplore={(country, region) => {
          setIsRegionGatewayOpen(false);
          addToast('Global Store Connected', `Browsing NAHID VAULT ${country} (${region}) flagship store catalog.`, 'info');
        }}
      />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        
        {/* Editorial Hero Banner */}
        <HeroBanner
          onExploreClick={() => {
            const catalogEl = document.getElementById('catalog-section');
            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Super Sale Promotional Showcase Banner */}
        <PromoSaleBanner
          onApplyPromo={handleApplyPromo}
          onSelectCategory={setSelectedCategory}
          onExploreClick={() => {
            const catalogEl = document.getElementById('catalog-section');
            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Catalog Section */}
        <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          
          {/* Section Header & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
            <div className="text-left space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                GENTLEMAN'S WARDROBE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
                {selectedCategory === 'All' ? 'Full Fashion Catalog' : selectedCategory}
              </h2>
              <p className="text-xs text-stone-400">
                Showing {filteredProducts.length} curated luxury pieces
              </p>
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* In Stock Toggle */}
              <label
                id="toggle-instock-filter"
                className="flex items-center gap-2 cursor-pointer bg-neutral-900/80 border border-neutral-800 px-3 py-2 rounded-lg text-xs font-semibold hover:border-amber-500 transition-colors text-stone-200"
              >
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <span>In Stock Only</span>
              </label>

              {/* Sorting Select */}
              <div className="relative">
                <select
                  id="sort-select-dropdown"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-neutral-900/80 border border-neutral-800 rounded-lg py-2 pl-3 pr-8 text-xs font-bold uppercase tracking-wider text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>

            </div>
          </div>

          {/* Active Search / Category Chips */}
          {(searchQuery || selectedCategory !== 'All' || inStockOnly) && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-stone-400 font-medium">Active Filters:</span>
              
              {selectedCategory !== 'All' && (
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-amber-800 dark:hover:text-amber-200">
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-amber-800 dark:hover:text-amber-200">
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} className="hover:text-amber-800 dark:hover:text-amber-200">
                    <X className="w-3 h-3 ml-0.5" />
                  </button>
                </span>
              )}

              <button
                id="reset-all-filters-btn"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setInStockOnly(false);
                }}
                className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline text-xs font-semibold ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-800 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 bg-stone-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-serif">No Products Found</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  We couldn't find any products matching your search term or active category filters.
                </p>
              </div>
              <button
                id="no-products-reset-btn"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setInStockOnly(false);
                }}
                className="px-6 py-2.5 bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={setSelectedProduct}
                  onQuickAddToCart={handleQuickAddToCart}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}

        </section>

        {/* Wishlist Drawer Modal if Open */}
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm" onClick={() => setIsWishlistOpen(false)} />
            <div className="relative bg-white dark:bg-neutral-900 text-stone-900 dark:text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10 space-y-4 border border-stone-200 dark:border-neutral-800">
              <div className="flex justify-between items-center border-b pb-3 border-stone-200 dark:border-neutral-800">
                <h3 className="text-lg font-black font-serif uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-current" />
                  <span>Saved Wishlist ({wishlist.length})</span>
                </h3>
                <button onClick={() => setIsWishlistOpen(false)} className="p-1 text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <p className="text-xs text-stone-500 py-8 text-center">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {PRODUCTS.filter((p) => wishlist.includes(p.id)).map((product) => (
                    <div key={product.id} className="flex gap-3 p-2 bg-stone-50 dark:bg-neutral-800 rounded-xl items-center text-left">
                      <img src={product.images[0]} alt="" className="w-14 h-16 object-cover rounded bg-white" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <p className="font-bold text-xs line-clamp-1">{product.title}</p>
                        <p className="font-serif text-xs text-amber-500 font-bold">${product.price}</p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-lg hover:bg-amber-400 shrink-0"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, sz, col, qty) => {
          handleAddToCart(prod, sz, col, qty);
          setSelectedProduct(null);
        }}
        onBuyNow={(prod, sz, col, qty) => {
          handleAddToCart(prod, sz, col, qty);
          setSelectedProduct(null);
          setIsCartOpen(true);
        }}
        currentUser={currentUserName}
        isAuthenticated={Boolean(currentUser)}
        onShowToast={addToast}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedPromo={appliedPromo}
        discountRate={discountRate}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
        discount={cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * discountRate}
        tax={(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * (1 - discountRate)) * 0.08}
        shippingFee={cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) >= 150 ? 0 : 12}
        total={
          (cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * (1 - discountRate)) +
          ((cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * (1 - discountRate)) * 0.08) +
          (cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) >= 150 ? 0 : 12)
        }
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Order Confirmation Screen */}
      <OrderConfirmationModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      {/* Voice Conversation Gemini Live Modal */}
      <VoiceConversationModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAddToast={addToast}
      />

      {/* Interactive Lamp Login Modal */}
      <LampLoginModal
        isOpen={isLampLoginOpen}
        onClose={() => setIsLampLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAdminOpen(true);
          addToast('Logged In Successfully', `Welcome ${user.displayName || user.email || 'back'}! Viewing your orders.`, 'success');
        }}
      />

      {/* Floating AI Voice Stylist Action Button */}
      <button
        id="floating-ai-voice-widget"
        onClick={() => setIsVoiceModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/50 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        title="Talk to AI Voice Stylist (Gemini Live)"
      >
        <div className="relative">
          <Mic className="w-5 h-5 text-amber-400 group-hover:animate-bounce" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">AI Voice Stylist</span>
      </button>

      {/* Footer */}
      <Footer categories={CATEGORIES} onSelectCategory={setSelectedCategory} />

    </div>
  );
}
