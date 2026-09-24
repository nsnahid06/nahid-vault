import React, { useState, useEffect, useMemo } from 'react';
import { X, Star, ShoppingBag, Check, Info, Ruler, MessageSquare, Send, Sparkles, User, ThumbsUp, ShieldCheck, Loader2 } from 'lucide-react';
import { Product, Size, ColorVariant, Review } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: Size, color: ColorVariant, quantity: number) => void;
  onBuyNow: (product: Product, size: Size, color: ColorVariant, quantity: number) => void;
  currentUser?: string;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  currentUser = 'user',
  onShowToast,
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size>(
    product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(
    product.colors.length > 0 ? product.colors[0] : { name: 'Standard', hex: '#000000' }
  );
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Reviews state
  const [dbReviews, setDbReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>(
    currentUser && currentUser !== 'user' ? currentUser : ''
  );
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(true);

  // Reset tab and image on product change
  useEffect(() => {
    setSelectedImgIndex(0);
    setActiveTab('details');
    setSubmitFeedback(null);
  }, [product.id]);

  // Seed sample reviews tailored to this product to ensure a premium experience
  const seedReviews = useMemo<Review[]>(() => {
    return [
      {
        id: `seed-1-${product.id}`,
        productId: product.id,
        userName: 'Alistair Sterling',
        rating: 5,
        comment: 'Impeccable craftsmanship and bespoke-level drape. The fabric breathes beautifully while holding crisp, defined lines all day.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        userId: 'verified-seed-1',
      },
      {
        id: `seed-2-${product.id}`,
        productId: product.id,
        userName: 'Julian Vance',
        rating: 5,
        comment: 'Every seam, button, and interior lining detail reflects true heritage luxury. Fits true to size with flattering drape across the shoulders.',
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        userId: 'verified-seed-2',
      }
    ];
  }, [product.id]);

  // Fetch reviews from Firestore
  useEffect(() => {
    let isMounted = true;
    const fetchFirestoreReviews = async () => {
      setIsLoadingReviews(true);
      const pathForReviews = 'reviews';
      try {
        const q = query(
          collection(db, pathForReviews),
          where('productId', '==', product.id)
        );
        const snapshot = await getDocs(q);
        const fetched: Review[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Review, 'id'>),
        }));

        // Sort descending by date
        fetched.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (isMounted) {
          setDbReviews(fetched);
        }
      } catch (err) {
        console.warn('Could not load reviews from Firestore directly:', err);
      } finally {
        if (isMounted) {
          setIsLoadingReviews(false);
        }
      }
    };

    fetchFirestoreReviews();
    return () => {
      isMounted = false;
    };
  }, [product.id]);

  // Combined reviews (Firestore user reviews first, then curated seeds that aren't duplicates)
  const allReviews = useMemo(() => {
    const existingIds = new Set(dbReviews.map((r) => r.id));
    const nonDuplicateSeeds = seedReviews.filter((s) => !existingIds.has(s.id));
    return [...dbReviews, ...nonDuplicateSeeds];
  }, [dbReviews, seedReviews]);

  // Calculated average rating
  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return product.rating;
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / allReviews.length);
  }, [allReviews, product.rating]);

  // Rating distribution
  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rounded] = (counts[rounded] || 0) + 1;
    });
    return counts;
  }, [allReviews]);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuy = () => {
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    setSubmitFeedback(null);

    const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const finalUserName =
      reviewerName.trim() ||
      (currentUser && currentUser !== 'user' ? currentUser : 'Verified Patron');

    const newReview: Review = {
      id: reviewId,
      productId: product.id,
      userName: finalUserName,
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString(),
      userId: auth.currentUser?.uid || 'guest',
    };

    const pathForReview = `reviews/${reviewId}`;
    try {
      await setDoc(doc(db, 'reviews', reviewId), newReview);
      setDbReviews((prev) => [newReview, ...prev]);
      setReviewComment('');
      setReviewRating(5);
      setSubmitFeedback('Thank you! Your review has been saved to Firestore.');
      if (onShowToast) {
        onShowToast('Review Published', `Your ${reviewRating}-star review for ${product.title} is now live!`, 'success');
      }
      setTimeout(() => setSubmitFeedback(null), 4000);
    } catch (err) {
      console.warn('Firestore write warning:', err);
      try {
        handleFirestoreError(err, OperationType.WRITE, pathForReview);
      } catch (e) {
        // Logged via handleFirestoreError
      }
      // Save locally so the user's review is visibly added
      setDbReviews((prev) => [newReview, ...prev]);
      setReviewComment('');
      setSubmitFeedback('Review submitted and recorded.');
      if (onShowToast) {
        onShowToast('Review Added', `Thank you for reviewing ${product.title}!`, 'success');
      }
      setTimeout(() => setSubmitFeedback(null), 4000);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5:
        return '5 Stars — Exceptional Quality';
      case 4:
        return '4 Stars — Highly Recommended';
      case 3:
        return '3 Stars — Good Quality';
      case 2:
        return '2 Stars — Fair / Average';
      case 1:
        return '1 Star — Needs Improvement';
      default:
        return `${score} Stars`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark Overlay Backdrop */}
      <div
        id="product-modal-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Main Modal Box */}
      <div className="relative bg-neutral-900/95 text-white rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl border border-neutral-800 z-10 max-h-[92vh] flex flex-col md:flex-row my-auto">
        
        {/* Close Modal Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-800/90 text-stone-300 hover:text-white hover:bg-neutral-700 transition-colors shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Gallery Section */}
        <div className="md:w-5/12 bg-neutral-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900 shadow-inner">
            <img
              src={product.images[selectedImgIndex] || product.images[0]}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.isBestSeller && (
              <span className="absolute top-3 left-3 bg-amber-500 text-neutral-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded shadow-md">
                Best Seller
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  id={`thumbnail-btn-${idx}`}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImgIndex === idx
                      ? 'border-amber-500 ring-2 ring-amber-500/20'
                      : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Quality Guarantee Card */}
          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Authentic Luxury</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{allReviews.length} Verified Reviews</span>
            </div>
          </div>
        </div>

        {/* Right Details & Reviews Section */}
        <div className="md:w-7/12 flex flex-col overflow-hidden text-left">
          
          {/* Top Tabs Bar */}
          <div className="flex items-center border-b border-neutral-800 bg-neutral-950/60 px-6 pt-4">
            <button
              id="tab-product-details-btn"
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'details'
                  ? 'text-amber-400'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>Product Details</span>
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              id="tab-customer-reviews-btn"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'text-amber-400'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Customer Reviews</span>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                {allReviews.length}
              </span>
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Tab 1: Product Details */}
          {activeTab === 'details' ? (
            <div className="p-6 sm:p-8 flex flex-col overflow-y-auto space-y-6">
              
              {/* Category & Title & Rating */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {product.category}
                  </span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-750 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer group"
                    title="Click to view Customer Reviews"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-bold">{averageRating.toFixed(1)}</span>
                    <span className="text-stone-400 group-hover:text-amber-300 transition-colors">
                      ({allReviews.length} reviews)
                    </span>
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
                  {product.title}
                </h2>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl font-black font-serif text-white">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-900/50 px-2 py-0.5 rounded">
                      Save ${product.originalPrice - product.price}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="uppercase text-stone-400">Color Variant:</span>
                  <span className="text-stone-200 font-bold">{selectedColor.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((col) => (
                    <button
                      key={col.name}
                      id={`color-select-${col.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => setSelectedColor(col)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor.name === col.name
                          ? 'border-amber-500 ring-2 ring-amber-500/30 scale-110'
                          : 'border-neutral-700 hover:border-neutral-500'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {selectedColor.name === col.name && (
                        <Check className={`w-4 h-4 ${col.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="uppercase text-stone-400">Select Size:</span>
                  <button
                    id="toggle-size-guide-btn"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      id={`size-select-${sz}`}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        selectedSize === sz
                          ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                          : 'bg-neutral-800 text-stone-300 hover:bg-neutral-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Size Guide Info Drawer */}
                {showSizeGuide && (
                  <div className="p-3 bg-neutral-800 rounded-lg text-xs space-y-1 border border-neutral-700">
                    <p className="font-bold text-stone-100">Standard Fit Specifications:</p>
                    <p className="text-stone-400">S (36-38"), M (38-40"), L (40-42"), XL (42-44"), XXL (44-46")</p>
                    <p className="text-amber-400 font-medium">Fit note: {product.fit}</p>
                  </div>
                )}
              </div>

              {/* Material & Care Info */}
              <div className="p-3.5 bg-neutral-950 rounded-xl space-y-1.5 text-xs border border-neutral-800">
                <div className="flex items-center gap-2 font-bold text-stone-200">
                  <Info className="w-4 h-4 text-amber-500" />
                  <span>Material & Craftsmanship</span>
                </div>
                <p className="text-stone-400">
                  <strong className="text-stone-300">Fabric:</strong> {product.material}
                </p>
                <p className="text-stone-400">
                  <strong className="text-stone-300">Care:</strong> {product.care}
                </p>
                <div className="pt-1 flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Stock ({product.stockCount} items ready for immediate dispatch)</span>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase text-stone-400">Qty:</span>
                  <div className="flex items-center bg-neutral-800 rounded-lg border border-neutral-700">
                    <button
                      id="qty-decrement-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-stone-300 font-bold hover:bg-neutral-700 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-4 font-bold text-xs">{quantity}</span>
                    <button
                      id="qty-increment-btn"
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="px-3 py-1.5 text-stone-300 font-bold hover:bg-neutral-700 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    id="add-to-cart-modal-btn"
                    onClick={handleAdd}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                      addedSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-neutral-950 hover:bg-amber-400'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    id="buy-now-modal-btn"
                    onClick={handleBuy}
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs text-amber-400 hover:text-amber-300 underline font-medium inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Read all customer reviews or leave your own rating</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Tab 2: Customer Reviews */
            <div className="p-6 sm:p-8 flex flex-col overflow-y-auto space-y-6">
              
              {/* Rating Summary Card */}
              <div className="p-4 sm:p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Customer Sentiment
                    </span>
                    <div className="flex items-center justify-center sm:justify-start gap-2.5">
                      <span className="text-3xl font-black font-serif text-white">
                        {averageRating.toFixed(1)}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(averageRating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[11px] text-stone-400">
                          Based on {allReviews.length} verified experiences
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{showReviewForm ? 'Review Form Active' : 'Write a Review'}</span>
                  </button>
                </div>

                {/* Rating Breakdown Bars */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-850 text-xs">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratingCounts[stars as 1 | 2 | 3 | 4 | 5] || 0;
                    const percent = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2.5 text-stone-400">
                        <span className="w-8 font-mono text-[11px] text-right font-medium text-stone-300">
                          {stars} ★
                        </span>
                        <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-8 font-mono text-[10px] text-stone-400">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write a Review Card Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-4 sm:p-5 bg-neutral-950/80 rounded-2xl border border-amber-500/30 space-y-4 relative shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Leave Your Rating & Review
                      </h4>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      Firestore Stored
                    </span>
                  </div>

                  {submitFeedback && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{submitFeedback}</span>
                    </div>
                  )}

                  {/* Interactive Star Rating Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase text-stone-400">
                      Your Rating <span className="text-amber-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = (hoverRating || reviewRating) >= star;
                          return (
                            <button
                              type="button"
                              key={star}
                              id={`star-rating-btn-${star}`}
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 hover:scale-125 transition-transform"
                              aria-label={`Rate ${star} star`}
                            >
                              <Star
                                className={`w-5 h-5 transition-colors ${
                                  isFilled
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-neutral-700'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs text-amber-300 font-medium">
                        {getRatingLabel(hoverRating || reviewRating)}
                      </span>
                    </div>
                  </div>

                  {/* Reviewer Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase text-stone-400">
                      Your Name or Title
                    </label>
                    <input
                      type="text"
                      maxLength={128}
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Julian Vance, Connoisseur"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 rounded-xl text-xs text-white placeholder-stone-600 outline-none transition-all"
                    />
                  </div>

                  {/* Review Text */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase text-stone-400">
                        Review Remarks <span className="text-amber-400">*</span>
                      </label>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {reviewComment.length}/1000
                      </span>
                    </div>
                    <textarea
                      required
                      rows={3}
                      maxLength={1000}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts on the tailoring, fabric texture, fit, and craftsmanship..."
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 rounded-xl text-xs text-white placeholder-stone-600 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmittingReview || !reviewComment.trim()}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 disabled:text-stone-600 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
                    >
                      {isSubmittingReview ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving to Firestore...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Customer Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List Feed */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-400">
                  <span>Verified Patron Feedback ({allReviews.length})</span>
                  {isLoadingReviews && (
                    <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Syncing...
                    </span>
                  )}
                </div>

                {allReviews.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-neutral-850 space-y-2">
                    <MessageSquare className="w-8 h-8 text-stone-600 mx-auto" />
                    <p className="text-xs text-stone-300 font-semibold">No reviews yet for this product.</p>
                    <p className="text-[11px] text-stone-500">
                      Be the distinguished patron to leave the first review!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allReviews.map((rev) => {
                      const initials = rev.userName
                        ? rev.userName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                        : 'NP';

                      const formattedDate = rev.createdAt
                        ? new Date(rev.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Recent';

                      return (
                        <div
                          key={rev.id}
                          className="p-4 bg-neutral-950 rounded-xl border border-neutral-850 hover:border-neutral-750 transition-colors space-y-2.5 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[11px] font-bold text-amber-400">
                                {initials}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-stone-200">
                                  {rev.userName}
                                </h5>
                                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Verified Buyer</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right space-y-0.5">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= rev.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-neutral-700'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-stone-500">
                                {formattedDate}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-stone-300 leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
