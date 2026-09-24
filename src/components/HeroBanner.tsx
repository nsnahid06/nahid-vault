import React from 'react';
import { ShieldCheck, Truck, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../types';

interface HeroBannerProps {
  onExploreClick: () => void;
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="relative bg-transparent text-white overflow-hidden border-b border-neutral-800/80">
      {/* Background Graphic Accent */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/90 border border-neutral-700 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autumn / Winter 2026 Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-[1.1]">
              Elevated Tailoring & <span className="italic font-normal text-stone-300">Modern Outerwear.</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl font-sans leading-relaxed">
              Designed for the modern gentleman. Experience premium Italian lambskin leather, 130s merino wool, and handcrafted footwear built with uncompromising craftsmanship.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-explore-collection-btn"
                onClick={onExploreClick}
                className="px-8 py-4 bg-white hover:bg-stone-200 text-neutral-950 font-black text-xs uppercase tracking-widest rounded-none shadow-xl transition-all flex items-center gap-3 group active:scale-95"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-4 text-xs font-medium text-stone-400 pl-2">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-neutral-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Customer" referrerPolicy="no-referrer" />
                  <img className="w-8 h-8 rounded-full border-2 border-neutral-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="Customer" referrerPolicy="no-referrer" />
                  <img className="w-8 h-8 rounded-full border-2 border-neutral-900 object-cover" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100" alt="Customer" referrerPolicy="no-referrer" />
                </div>
                <span>Over <strong className="text-white">12,500+</strong> Gentlemen Satisfied</span>
              </div>
            </div>

            {/* Quick Category Pills */}
            <div className="pt-6 border-t border-neutral-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mr-2">Featured:</span>
              {(['Outerwear', 'Formal Wear', 'Footwear', 'Casual Shirts'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  id={`hero-pill-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'bg-neutral-900 border border-neutral-800 text-stone-300 hover:text-white hover:border-stone-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right Editorial Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=1000"
                alt="Men's Fashion Lookbook"
                referrerPolicy="no-referrer"
                className="w-full h-[420px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 text-left space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  FEATURED LOOK
                </div>
                <div className="text-base font-bold text-white font-serif">
                  The Heritage Leather & Raw Denim Pairing
                </div>
                <div className="text-xs text-stone-400 flex justify-between items-center pt-1">
                  <span>Complete Outfit Bundle</span>
                  <span className="text-white font-bold">$534.00</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 mt-12 border-t border-neutral-800 text-stone-300 text-xs">
          <div className="flex items-center gap-3 bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
            <Truck className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-left">
              <p className="font-bold text-white uppercase tracking-wider">Free Express Delivery</p>
              <p className="text-stone-400 text-[11px]">Complimentary shipping on orders over $150</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
            <RefreshCw className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-left">
              <p className="font-bold text-white uppercase tracking-wider">30-Day Easy Returns</p>
              <p className="text-stone-400 text-[11px]">Hassle-free exchanges & full refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-left">
              <p className="font-bold text-white uppercase tracking-wider">Authentic Guarantee</p>
              <p className="text-stone-400 text-[11px]">100% genuine Italian leather & wool</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
