import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { CartItem, ShippingDetails, PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  onCompleteOrder: (shipping: ShippingDetails, paymentMethod: PaymentMethod) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  tax,
  shippingFee,
  total,
  onCompleteOrder,
}) => {
  if (!isOpen) return null;

  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [expiry, setExpiry] = useState('08/28');
  const [cvc, setCvc] = useState('884');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!shipping.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!shipping.email.trim() || !shipping.email.includes('@')) errs.email = 'Valid email required';
    if (!shipping.phone.trim()) errs.phone = 'Phone number is required';
    if (!shipping.address.trim()) errs.address = 'Shipping address is required';
    if (!shipping.city.trim()) errs.city = 'City is required';
    if (!shipping.postalCode.trim()) errs.postalCode = 'Postal code is required';

    if (paymentMethod === 'credit_card') {
      if (!cardNumber.trim()) errs.cardNumber = 'Card number required';
      if (!expiry.trim()) errs.expiry = 'Expiry required';
      if (!cvc.trim()) errs.cvc = 'CVC required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onCompleteOrder(shipping, paymentMethod);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        id="checkout-modal-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative bg-neutral-900/95 text-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-neutral-800 z-10 max-h-[92vh] flex flex-col md:flex-row my-auto">
        
        {/* Close Button */}
        <button
          id="close-checkout-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-800 text-stone-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Form Column */}
        <div className="md:w-3/5 p-6 sm:p-8 overflow-y-auto space-y-6 text-left border-b md:border-b-0 md:border-r border-neutral-800">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
              Express Checkout
            </span>
            <h2 className="text-2xl font-black font-serif tracking-tight">Shipping & Payment</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Shipping Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-1 border-stone-200 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  1. Delivery Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="checkout-input-name"
                    type="text"
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    placeholder="e.g. John Doe"
                    className={`w-full bg-stone-50 dark:bg-neutral-800 border ${
                      errors.fullName ? 'border-rose-500' : 'border-stone-300 dark:border-neutral-700'
                    } rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-amber-500`}
                  />
                  {errors.fullName && <p className="text-[10px] text-rose-500">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="checkout-input-email"
                    type="email"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className={`w-full bg-stone-50 dark:bg-neutral-800 border ${
                      errors.email ? 'border-rose-500' : 'border-stone-300 dark:border-neutral-700'
                    } rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-amber-500`}
                  />
                  {errors.email && <p className="text-[10px] text-rose-500">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="checkout-input-phone"
                    type="text"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className={`w-full bg-stone-50 dark:bg-neutral-800 border ${
                      errors.phone ? 'border-rose-500' : 'border-stone-300 dark:border-neutral-700'
                    } rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-amber-500`}
                  />
                  {errors.phone && <p className="text-[10px] text-rose-500">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                    Country
                  </label>
                  <input
                    id="checkout-input-country"
                    type="text"
                    value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-neutral-800 border border-stone-300 dark:border-neutral-700 rounded-lg p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                  Street Address *
                </label>
                <input
                  id="checkout-input-address"
                  type="text"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  className={`w-full bg-stone-50 dark:bg-neutral-800 border ${
                    errors.address ? 'border-rose-500' : 'border-stone-300 dark:border-neutral-700'
                  } rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-amber-500`}
                />
                {errors.address && <p className="text-[10px] text-rose-500">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                    City *
                  </label>
                  <input
                    id="checkout-input-city"
                    type="text"
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className={`w-full bg-stone-50 dark:bg-neutral-800 border ${
                      errors.city ? 'border-rose-500' : 'border-stone-300 dark:border-neutral-700'
                    } rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-amber-500`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                    Postal Code *
                  </label>
                  <input
                    id="checkout-input-postal"
                    type="text"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    className={`w-full bg-stone-50 dark:bg-neutral-800 border ${
                      errors.postalCode ? 'border-rose-500' : 'border-stone-300 dark:border-neutral-700'
                    } rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-amber-500`}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 border-b pb-1 border-stone-200 dark:border-neutral-800">
                2. Select Payment Method
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="pay-method-card"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-stone-50 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  id="pay-method-cod"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-stone-50 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span>Cash on Delivery</span>
                </button>

                <button
                  type="button"
                  id="pay-method-mobile"
                  onClick={() => setPaymentMethod('mobile_banking')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                    paymentMethod === 'mobile_banking'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-stone-50 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Apple / Google Pay</span>
                </button>
              </div>

              {/* Credit Card Details Inputs */}
              {paymentMethod === 'credit_card' && (
                <div className="p-3.5 bg-stone-50 dark:bg-neutral-800/80 rounded-xl border border-stone-200 dark:border-neutral-700 space-y-3 mt-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        id="input-card-number"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg p-2.5 text-xs font-mono font-bold"
                      />
                      <Lock className="w-3.5 h-3.5 absolute right-3 top-3 text-stone-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                        Expiry Date
                      </label>
                      <input
                        id="input-card-expiry"
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg p-2.5 text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        id="input-card-cvc"
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg p-2.5 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cash_on_delivery' && (
                <div className="p-3 bg-stone-50 dark:bg-neutral-800/80 rounded-xl text-xs text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-neutral-700">
                   Pay cash directly to the courier upon delivery. Please prepare exact change.
                </div>
              )}

              {paymentMethod === 'mobile_banking' && (
                <div className="p-3 bg-stone-50 dark:bg-neutral-800/80 rounded-xl text-xs text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-neutral-700">
                   You will be prompted to authenticate your biometric Apple Pay / Google Pay authorization upon placing order.
                </div>
              )}
            </div>

            {/* Complete Order Action */}
            <div className="pt-4">
              <button
                id="place-order-submit-btn"
                type="submit"
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Complete Order (${total.toFixed(2)})</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Summary Sidebar */}
        <div className="md:w-2/5 p-6 sm:p-8 bg-stone-50 dark:bg-neutral-950 flex flex-col justify-between text-left">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white border-b pb-2 border-stone-200 dark:border-neutral-800">
              Order Summary ({items.length} items)
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover rounded bg-white shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-bold line-clamp-1">{item.product.title}</p>
                    <p className="text-[10px] text-stone-500">
                      {item.selectedSize} / {item.selectedColor.name} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold font-serif">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-stone-200 dark:border-neutral-800 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>Discount</span>
                  <span className="font-bold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-bold text-stone-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-black text-stone-900 dark:text-white font-serif pt-2 border-t border-stone-200 dark:border-neutral-800">
                <span>Total Due</span>
                <span className="text-amber-500">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 text-[10px] text-stone-400 space-y-1">
            <p className="flex items-center gap-1 font-semibold text-emerald-500">
              <CheckCircle2 className="w-3 h-3" />
              <span>256-bit SSL Encrypted Secure Checkout</span>
            </p>
            <p>Your order is protected by our 30-day money back gentleman's guarantee.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
