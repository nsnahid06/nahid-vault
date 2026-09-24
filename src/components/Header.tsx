import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Sparkles, Palette, Mic, Globe, Lightbulb, User, ChevronDown } from 'lucide-react';
import { Category } from '../types';

export type VibeTheme = 'obsidian' | 'midnight' | 'crimson' | 'emerald' | 'bourbon' | 'violet';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  categories: Category[];
  vibeTheme: VibeTheme;
  onSelectVibe: (vibe: VibeTheme) => void;
  onOpenVoiceConversation?: () => void;
  onOpenDatabase?: () => void;
  onOpenRegionGateway?: () => void;
  onOpenAdminLogin?: () => void;
}

const VIBE_OPTIONS: { id: VibeTheme; label: string; colorDot: string }[] = [
  { id: 'obsidian', label: 'Obsidian Gold', colorDot: 'bg-amber-400' },
  { id: 'midnight', label: 'Royal Midnight', colorDot: 'bg-sky-400' },
  { id: 'crimson', label: 'Crimson Velvet', colorDot: 'bg-rose-500' },
  { id: 'emerald', label: 'Emerald Forest', colorDot: 'bg-emerald-400' },
  { id: 'bourbon', label: 'Smokey Bourbon', colorDot: 'bg-orange-500' },
  { id: 'violet', label: 'Cyber Violet', colorDot: 'bg-purple-400' },
];

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  vibeTheme,
  onSelectVibe,
  onOpenVoiceConversation,
  onOpenDatabase,
  onOpenRegionGateway,
  onOpenAdminLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [vibeMenuOpen, setVibeMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-neutral-900 border-b border-stone-200/90 shadow-sm transition-all">
      {/* Top Banner Announcement */}
      <div className="bg-stone-100/90 text-stone-700 text-xs py-1.5 px-4 text-center border-b border-stone-200/80 flex justify-between items-center max-w-7xl mx-auto font-medium tracking-wider">
        <span className="hidden sm:inline-block text-amber-700 font-semibold uppercase tracking-widest text-[10px]">
          ★ Autumn / Winter 2026 Collection
        </span>
        <span className="mx-auto sm:mx-0 text-stone-800">
          FREE EXPRESS SHIPPING OVER $150 • USE CODE <strong className="text-black underline decoration-amber-500">NVM66</strong> FOR 10% OFF
        </span>
        <span className="hidden md:inline-block text-stone-600 text-[11px]">
          Need Help? 01609258416-NV
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-black hover:bg-stone-100 rounded-md transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a href="#" className="group flex items-baseline gap-2 text-left">
              <span className="text-2xl sm:text-3xl font-black tracking-normal text-neutral-900 font-serif uppercase group-hover:text-stone-700 transition-colors">
                NAHID <span className="text-amber-600 font-sans font-light">VAULT</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest text-stone-500 uppercase border-l border-stone-300 pl-2">
                GENTLEMAN CO.
              </span>
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-4">
            <div className={`relative w-full flex items-center bg-stone-100/90 rounded-full border transition-all ${
              searchFocused ? 'border-amber-500 ring-2 ring-amber-500/20 bg-white' : 'border-stone-300 hover:border-stone-400'
            }`}>
              <Search className="w-4 h-4 ml-4 text-stone-500 shrink-0" />
              <input
                id="header-search-input-desktop"
                type="text"
                placeholder="Search leather jackets, suits, boots, denim..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full bg-transparent py-2.5 pl-3 pr-8 text-sm text-neutral-900 placeholder-stone-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  id="clear-search-desktop-btn"
                  onClick={() => onSearchChange('')}
                  className="mr-3 text-stone-500 hover:text-neutral-900 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live AI Voice Stylist Button */}
            {onOpenVoiceConversation && (
              <button
                id="ai-voice-stylist-btn"
                onClick={onOpenVoiceConversation}
                className="relative flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 rounded-full text-xs font-semibold text-amber-900 transition-all shadow-sm group"
                title="Talk with Gemini Live AI Voice Stylist"
              >
                <div className="relative">
                  <Mic className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping absolute -top-0.5 -right-0.5" />
                </div>
                <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">AI Voice</span>
              </button>
            )}

            {/* Login Account Dropdown Button */}
            {onOpenAdminLogin && (
              <button
                id="lamp-login-header-btn"
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300/80 rounded-full text-stone-800 hover:text-black transition-all shadow-sm group cursor-pointer"
                title="Account Login & Orders"
              >
                <User className="w-5 h-5 text-stone-700 group-hover:scale-105 transition-transform" />
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:translate-y-0.5 transition-transform" />
              </button>
            )}

            {/* Real Vibe Theme Selector Dropdown */}
            <div className="relative">
              <button
                id="vibe-color-theme-toggle-btn"
                onClick={() => setVibeMenuOpen(!vibeMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-full text-xs font-semibold text-stone-800 transition-all shadow-sm"
                title="Change background color vibe"
              >
                <Palette className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">Vibe Color</span>
                <span className={`w-2.5 h-2.5 rounded-full ${VIBE_OPTIONS.find(v => v.id === vibeTheme)?.colorDot}`} />
              </button>

              {vibeMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-xl shadow-2xl p-2 z-50 animate-slide-up space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-500 px-3 py-1 border-b border-stone-100 flex items-center justify-between">
                    <span>Background Vibe</span>
                    <Sparkles className="w-3 h-3 text-amber-600" />
                  </div>
                  {VIBE_OPTIONS.map((vibe) => (
                    <button
                      key={vibe.id}
                      id={`vibe-option-${vibe.id}`}
                      onClick={() => {
                        onSelectVibe(vibe.id);
                        setVibeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left font-medium transition-all ${
                        vibeTheme === vibe.id
                          ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span>{vibe.label}</span>
                      <span className={`w-3 h-3 rounded-full ${vibe.colorDot}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              id="wishlist-header-btn"
              onClick={onOpenWishlist}
              className="relative p-2.5 text-stone-700 hover:text-black hover:bg-stone-100 rounded-full transition-colors flex items-center justify-center"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-neutral-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger Button */}
            <button
              id="cart-header-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-amber-500/20 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-neutral-950" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-neutral-950 text-white font-black text-[11px] px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full flex items-center bg-stone-100 rounded-full border border-stone-300">
            <Search className="w-4 h-4 ml-3.5 text-stone-500 shrink-0" />
            <input
              id="header-search-input-mobile"
              type="text"
              placeholder="Search jackets, boots, suits..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent py-2 pl-2.5 pr-8 text-xs text-neutral-900 placeholder-stone-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                id="clear-search-mobile-btn"
                onClick={() => onSearchChange('')}
                className="mr-3 text-stone-500 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Bar (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center gap-1 py-3 border-t border-stone-200/80 overflow-x-auto no-scrollbar text-xs font-semibold tracking-wider uppercase">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-btn-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'text-stone-700 hover:text-black hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 py-5 space-y-4">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">
            Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`mobile-cat-btn-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

