import React, { useState, useEffect } from 'react';
import { CreditCard, Tag, ArrowRight, Sparkles, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import bannerImg from '../assets/images/mens_super_sale_banner_1786312326097.jpg';

interface PromoSaleBannerProps {
  onApplyPromo: (code: string) => boolean;
  onSelectCategory: (category: any) => void;
  onExploreClick?: () => void;
}

export const PromoSaleBanner: React.FC<PromoSaleBannerProps> = ({
  onApplyPromo,
  onSelectCategory,
  onExploreClick,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  const slides = [
    {
      id: 'slide-1',
      title: 'SUPER SALE',
      discount: '30% OFF',
      minPurchase: '$50',
      image: bannerImg,
      code: 'SUPER30',
      tagline: 'Exclusive Premium Footwear Collection',
    },
    {
      id: 'slide-2',
      title: 'AUTUMN VAULT SALE',
      discount: '25% OFF',
      minPurchase: '$40',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1600',
      code: 'AUTUMN25',
      tagline: 'Handcrafted Italian Leather Shoes',
    },
    {
      id: 'slide-3',
      title: 'EXCLUSIVE MEMBER CLUB',
      discount: '35% OFF',
      minPurchase: '$80',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=1600',
      code: 'VAULTCLUB35',
      tagline: 'Luxury Designer Shirts, Polos & Accessories',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleClaimOffer = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    onApplyPromo(code);
    onSelectCategory('Footwear');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentSlide = slides[activeSlide];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
      <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-neutral-950 shadow-2xl group">
        
        {/* Banner Background Image */}
        <div className="relative h-[260px] sm:h-[340px] md:h-[400px] lg:h-[440px] w-full overflow-hidden">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-700 scale-100 group-hover:scale-105"
          />

          {/* Vignette & Gradient Overlays for Sunlight Bokeh Look */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

          {/* ================= TOP LEFT: SUPER SALE BADGE ================= */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-col items-start gap-1 select-none animate-fade-in">
            {/* Red SUPER Box */}
            <div className="bg-red-600 text-white font-black italic text-lg sm:text-2xl md:text-3xl px-3 sm:px-5 py-1 tracking-wider uppercase rounded-sm shadow-[0_4px_15px_rgba(220,38,38,0.6)] transform -skew-x-12 border border-red-400">
              <span className="inline-block transform skew-x-12">SUPER</span>
            </div>

            {/* Yellow SALE Box */}
            <div className="bg-yellow-300 text-neutral-950 font-black italic text-xl sm:text-3xl md:text-4xl px-4 sm:px-6 py-1 tracking-widest uppercase rounded-sm shadow-[0_4px_20px_rgba(253,224,71,0.5)] transform -skew-x-12 border-2 border-yellow-400">
              <span className="inline-block transform skew-x-12">SALE</span>
            </div>
          </div>

          {/* ================= TOP RIGHT: ENJOY UP TO 30% OFF ================= */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-start gap-2 select-none">
            <div className="bg-neutral-950/85 backdrop-blur-md p-2.5 sm:p-4 rounded-xl border border-yellow-400/40 shadow-2xl flex flex-col items-end">
              {/* Red ENJOY UP TO */}
              <div className="bg-red-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 uppercase tracking-widest rounded shadow-md">
                ENJOY UP TO
              </div>

              {/* Big 30% OFF */}
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-yellow-300 tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-serif leading-none mt-1">
                {currentSlide.discount}
              </div>

              <div className="text-[9px] sm:text-[10px] text-stone-300 font-medium tracking-wide uppercase mt-1">
                USE CODE: <strong className="text-amber-400 font-mono underline">{currentSlide.code}</strong>
              </div>
            </div>

            {/* Vertical T&C Apply Label */}
            <div className="hidden sm:block text-[9px] font-bold text-stone-400 uppercase tracking-widest [writing-mode:vertical-lr] opacity-70">
              T&C APPLY*
            </div>
          </div>

          {/* ================= BOTTOM LEFT: EMI AVAILABLE BADGE & CLAIM BUTTON ================= */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="bg-neutral-950/90 backdrop-blur-md p-2.5 sm:p-3 rounded-lg border border-red-500/50 shadow-xl flex items-center gap-2.5 max-w-xs">
              <div className="p-2 bg-red-600 rounded text-white shrink-0 shadow-md">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-red-500 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                  <span>EMI* AVAILABLE</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-stone-300">
                  MINIMUM PURCHASE: {currentSlide.minPurchase}
                </div>
              </div>
            </div>

            {/* Quick Claim Button */}
            <button
              onClick={(e) => handleClaimOffer(e, currentSlide.code)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-xl flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-900" />
                  <span>30% COUPON APPLIED!</span>
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4" />
                  <span>CLAIM {currentSlide.discount} OFFER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* ================= BOTTOM RIGHT: NAHID VAULT LOGO SIGNATURE ================= */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 text-right select-none">
            <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-black italic tracking-tighter text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              NAHID <span className="text-amber-400 font-sans not-italic font-black">VAULT</span>
            </div>
            <div className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-stone-300 uppercase">
              LUXURY FOOTWEAR & LEATHERWEAR
            </div>
          </div>

          {/* ================= BOTTOM CENTER: SLIDER PAGINATION DOTS ================= */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-neutral-950/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-neutral-800">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeSlide === idx
                    ? 'w-6 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                    : 'w-2 bg-stone-600 hover:bg-stone-400'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Arrow Controls on Hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-neutral-950/70 hover:bg-neutral-900 text-stone-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity border border-neutral-800 cursor-pointer"
            title="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide((prev) => (prev + 1) % slides.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-neutral-950/70 hover:bg-neutral-900 text-stone-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity border border-neutral-800 cursor-pointer"
            title="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>
      </div>
    </section>
  );
};
