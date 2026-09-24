import React, { useState } from 'react';
import { Send, Instagram, Twitter, Facebook, ArrowUpRight, Check } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  categories: Category[];
  onSelectCategory: (cat: Category) => void;
}

export const Footer: React.FC<FooterProps> = ({ categories, onSelectCategory }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="bg-neutral-950 text-stone-300 border-t border-neutral-800 text-left">
      {/* Top Newsletter & Club Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 border-b border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-2">
            <span className="text-amber-500 text-xs font-black uppercase tracking-widest">
              JOIN THE GENTLEMAN'S CLUB
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Unlock 10% Off Your First Order
            </h3>
            <p className="text-stone-400 text-xs max-w-md">
              Subscribe to receive private preview access to seasonal releases, bespoke styling advice, and exclusive VIP promotions.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                id="footer-newsletter-email"
                type="email"
                placeholder="Enter your personal email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                id="footer-subscribe-btn"
                type="submit"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Main Link Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <a href="#" className="flex items-baseline gap-2 text-left">
            <span className="text-2xl font-black tracking-tighter text-white font-serif uppercase">
              NAHID <span className="text-amber-500 font-sans font-light">VAULT</span>
            </span>
          </a>
          <p className="text-stone-400 leading-relaxed text-[11px]">
            Defined by uncompromising tailored outerwear, leathercraft, and essential modern wardrobe staples for discerning gentlemen worldwide.
          </p>
          <div className="flex items-center gap-3 text-stone-400 pt-2">
            <a href="#" className="p-2 rounded-full bg-neutral-900 hover:text-white hover:bg-neutral-800"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-full bg-neutral-900 hover:text-white hover:bg-neutral-800"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="p-2 rounded-full bg-neutral-900 hover:text-white hover:bg-neutral-800"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider">Collections</h4>
          <ul className="space-y-2 text-stone-400">
            {categories.filter(c => c !== 'All').map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => onSelectCategory(cat)}
                  className="hover:text-amber-400 transition-colors"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Client Services */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider">Client Services</h4>
          <ul className="space-y-2 text-stone-400">
            <li><a href="#" className="hover:text-amber-400">Bespoke Fitting & Size Guide</a></li>
            <li><a href="#" className="hover:text-amber-400">Shipping & Global Logistics</a></li>
            <li><a href="#" className="hover:text-amber-400">30-Day Easy Return Portal</a></li>
            <li><a href="#" className="hover:text-amber-400">Leather & Wool Garment Care</a></li>
            <li><a href="#" className="hover:text-amber-400">Order Tracking Status</a></li>
          </ul>
        </div>

        {/* Atelier Locations */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider">Ateliers</h4>
          <p className="text-stone-400 text-[11px] leading-relaxed">
            Visit our flagship showrooms in Manhattan, London, Milan, and Tokyo.
          </p>
          <p className="text-amber-400 font-bold font-serif text-sm">
            542 Madison Ave, New York, NY
          </p>
          <p className="text-stone-500 text-[10px]">
            Mon - Sat: 10:00 AM - 8:00 PM EST
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 gap-4">
        <p>© 2026 URBAN MAN - GENTLEMAN Co. All Rights Reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-stone-300">Privacy Policy</a>
          <a href="#" className="hover:text-stone-300">Terms of Service</a>
          <a href="#" className="hover:text-stone-300">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};
