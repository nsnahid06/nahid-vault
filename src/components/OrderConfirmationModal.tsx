import React from 'react';
import { CheckCircle2, Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Order } from '../types';
import { formatBDT } from '../lib/currency';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        id="order-confirm-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md transition-opacity"
      />

      <div className="relative bg-neutral-900/95 text-white rounded-2xl max-w-xl w-full p-6 sm:p-8 overflow-hidden shadow-2xl border border-neutral-800 z-10 text-center space-y-6 my-auto backdrop-blur-xl">
        
        {/* Animated Success Badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-xl">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Order Confirmed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
            Thank You, Gentleman!
          </h2>
          <p className="text-xs text-stone-400">
            Order <strong className="text-white font-mono">{order.id}</strong> has been received and is being prepared with extreme care.
          </p>
        </div>

        {/* Estimated Delivery Window Box */}
        <div className="p-4 bg-neutral-800/80 rounded-xl border border-neutral-700 text-left grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-stone-400 font-semibold uppercase text-[10px]">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Est. Delivery</span>
            </div>
            <p className="font-bold text-stone-900 dark:text-white">{order.estimatedDelivery}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-stone-400 font-semibold uppercase text-[10px]">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Shipping To</span>
            </div>
            <p className="font-bold text-stone-900 dark:text-white truncate">
              {order.shippingDetails.city}, {order.shippingDetails.country}
            </p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-2 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 border-b pb-1 border-stone-200 dark:border-neutral-800">
            Purchased Items ({order.items.length})
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 dark:border-neutral-800/60">
                <div className="flex items-center gap-2">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-bold text-stone-900 dark:text-white line-clamp-1">{item.product.title}</p>
                    <p className="text-[10px] text-stone-500">Size {item.selectedSize} • {item.selectedColor.name} • Qty {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold font-serif">{formatBDT(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Paid Summary */}
        <div className="p-3 bg-neutral-900 text-white rounded-xl flex justify-between items-center text-sm font-bold">
          <span className="uppercase text-xs text-stone-400">Total Paid:</span>
          <span className="text-amber-400 font-serif text-lg">{formatBDT(order.total)}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="continue-shopping-confirm-btn"
            onClick={onClose}
            className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
