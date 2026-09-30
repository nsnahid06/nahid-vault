import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { formatBDT, formatBDTDiscount } from '../lib/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  appliedPromo: string | null;
  discountRate: number;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  appliedPromo,
  discountRate,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * discountRate;
  const discountedSubtotal = subtotal - discountAmount;
  
  const freeShippingThreshold = 150;
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 12;
  const tax = discountedSubtotal * 0.08; // 8% estimated tax
  const grandTotal = discountedSubtotal + shippingFee + tax;

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim().toUpperCase());
    if (success) {
      setPromoError(null);
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code. Try "NVM66" for 10% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        id="cart-drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900/95 text-white shadow-2xl flex flex-col border-l border-neutral-800 backdrop-blur-xl">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-black font-serif uppercase tracking-wider">Your Shopping Bag</h2>
              <span className="bg-amber-500 text-neutral-950 font-bold text-xs px-2 py-0.5 rounded-full ml-1">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="bg-neutral-900 text-stone-300 p-3.5 text-xs border-b border-neutral-800 space-y-1.5">
              <div className="flex justify-between font-semibold">
                {remainingForFreeShipping > 0 ? (
                  <span>Add <strong className="text-amber-400">{formatBDT(remainingForFreeShipping)}</strong> more for Free Shipping!</span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>You've unlocked FREE Express Shipping!</span>
                  </span>
                )}
                <span>{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 my-auto py-12">
                <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-neutral-800 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-serif">Your Bag is Empty</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs">
                    Explore our Autumn / Winter collection and add tailored pieces to your cart.
                  </p>
                </div>
                <button
                  id="empty-cart-shop-now-btn"
                  onClick={onClose}
                  className="px-6 py-3 bg-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-md hover:bg-amber-400 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="flex gap-4 p-3 bg-stone-50 dark:bg-neutral-800/60 rounded-xl border border-stone-200 dark:border-neutral-800 text-left"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover object-center rounded-lg bg-white shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-stone-900 dark:text-white line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          id={`remove-item-btn-${item.id}`}
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
                        <span className="bg-stone-200 dark:bg-neutral-700 px-2 py-0.5 rounded text-stone-800 dark:text-stone-200">
                          Size: {item.selectedSize}
                        </span>
                        <span className="bg-stone-200 dark:bg-neutral-700 px-2 py-0.5 rounded text-stone-800 dark:text-stone-200 flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full border"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span>{item.selectedColor.name}</span>
                        </span>
                      </div>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center bg-white dark:bg-neutral-900 rounded-md border border-stone-200 dark:border-neutral-700">
                        <button
                          id={`qty-minus-${item.id}`}
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-xs font-bold hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold">{item.quantity}</span>
                        <button
                          id={`qty-plus-${item.id}`}
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-xs font-bold hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-r"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold font-serif text-stone-900 dark:text-white">
                        {formatBDT(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-950 space-y-3">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromoCode} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                    <input
                      id="promo-code-input"
                      type="text"
                      placeholder="Promo Code (Try 'NVM66')"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError(null);
                      }}
                      className="w-full bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg py-2 pl-9 pr-3 text-xs uppercase font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    id="apply-promo-btn"
                    type="submit"
                    className="px-4 py-2 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {promoError && (
                  <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>{promoError}</span>
                  </p>
                )}

                {appliedPromo && (
                  <div className="flex items-center justify-between p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs">
                    <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Code '{appliedPromo}' Applied ({discountRate * 100}% OFF)</span>
                    </span>
                    <button
                      id="remove-promo-btn"
                      type="button"
                      onClick={onRemovePromo}
                      className="text-stone-400 hover:text-stone-900 dark:hover:text-white underline text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-stone-200 dark:border-neutral-800">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{formatBDT(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span className="font-semibold">{formatBDTDiscount(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {shippingFee === 0 ? <strong className="text-emerald-500">FREE</strong> : formatBDT(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{formatBDT(tax)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-stone-900 dark:text-white font-serif pt-2 border-t border-stone-200 dark:border-neutral-800">
                  <span>Total</span>
                  <span className="text-amber-500">{formatBDT(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="checkout-drawer-btn"
                  onClick={onCheckout}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="clear-cart-btn"
                  onClick={onClearCart}
                  className="w-full py-1 text-center text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 underline"
                >
                  Clear Shopping Bag
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
