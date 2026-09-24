import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, Package, User, MapPin, CreditCard, Search, ShoppingBag } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
  currentUser?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, currentUser = 'user' }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);

        const orderData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(orderData);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Filter orders based on currentUser / search
  const isAdmin = currentUser.toLowerCase() === 'admin';
  
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) {
      // If user is not admin, show orders where name or email contains currentUser if applicable, or show all
      if (!isAdmin && currentUser && currentUser.toLowerCase() !== 'user') {
        const userTerm = currentUser.toLowerCase();
        const fullName = (order.shippingDetails?.fullName || '').toLowerCase();
        const email = (order.shippingDetails?.email || '').toLowerCase();
        return fullName.includes(userTerm) || email.includes(userTerm);
      }
      return true;
    }

    const q = searchQuery.toLowerCase();
    const orderId = (order.id || '').toLowerCase();
    const fullName = (order.shippingDetails?.fullName || '').toLowerCase();
    const email = (order.shippingDetails?.email || '').toLowerCase();
    const phone = (order.shippingDetails?.phone || '').toLowerCase();

    return orderId.includes(q) || fullName.includes(q) || email.includes(q) || phone.includes(q);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-stone-400 font-mono animate-pulse">Loading orders from database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-7xl mx-auto">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-amber-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span>NAHID VAULT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span className="text-stone-400 capitalize">Logged in as: {currentUser}</span>
            </p>
            <h1 className="text-3xl font-black font-serif mt-1">
              {isAdmin ? 'Store Order Management' : 'My Orders & Order History'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-3 text-right">
              <p className="text-xs text-stone-500">Total Placed Orders</p>
              <p className="text-2xl font-black text-amber-400">{filteredOrders.length}</p>
            </div>
          </div>
        </div>

        {/* Search Bar for Orders */}
        <div className="mb-6 relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by Name, Email, Phone, or Order ID..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-3 text-stone-600" />
            <h3 className="text-lg font-bold text-stone-300">No Orders Found</h3>
            <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
              {searchQuery
                ? `No orders matching "${searchQuery}". Try clearing your search.`
                : 'No placed orders were found. Once an order is placed, it will be listed here instantly.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-amber-500 text-xs font-mono font-bold">
                        ORDER #{order.id}
                      </p>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full uppercase">
                        Placed
                      </span>
                    </div>

                    <h2 className="text-lg font-bold mt-1">
                      {order.shippingDetails?.fullName || 'Customer'}
                    </h2>

                    <p className="text-xs text-stone-400 flex items-center gap-2 mt-0.5">
                      <span>{order.shippingDetails?.email}</span>
                      <span>•</span>
                      <span>{order.items?.length || 0} items</span>
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xl font-black text-amber-400">
                      ${Number(order.total || 0).toFixed(2)}
                    </p>

                    <p className="text-xs text-stone-400 capitalize mt-0.5">
                      Method: {order.paymentMethod || 'Card'}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    View Details
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">

              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-amber-500 text-xs font-bold">
                    ORDER #{selectedOrder.id}
                  </p>

                  <h2 className="text-2xl font-black">
                    Order Details
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-stone-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              {/* Customer */}
              <div className="border-b border-neutral-800 pb-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold">Customer Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <p>
                    <span className="text-stone-500">Name:</span>{' '}
                    {selectedOrder.shippingDetails?.fullName}
                  </p>

                  <p>
                    <span className="text-stone-500">Email:</span>{' '}
                    {selectedOrder.shippingDetails?.email}
                  </p>

                  <p>
                    <span className="text-stone-500">Phone:</span>{' '}
                    {selectedOrder.shippingDetails?.phone}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="border-b border-neutral-800 pb-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold">Shipping Address</h3>
                </div>

                <p className="text-sm text-stone-300">
                  {selectedOrder.shippingDetails?.address}
                  <br />
                  {selectedOrder.shippingDetails?.city},{' '}
                  {selectedOrder.shippingDetails?.postalCode}
                  <br />
                  {selectedOrder.shippingDetails?.country}
                </p>
              </div>

              {/* Products */}
              <div className="border-b border-neutral-800 pb-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold">Products</h3>
                </div>

                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between bg-neutral-800 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-bold text-sm">
                          {item.product?.title}
                        </p>

                        <p className="text-xs text-stone-500">
                          Size: {item.selectedSize} |{' '}
                          Color: {item.selectedColor?.name} |{' '}
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold">
                        ${(item.product?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="border-b border-neutral-800 pb-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold">Payment</h3>
                </div>

                <p className="text-sm">
                  Method:{' '}
                  <span className="text-amber-400">
                    {selectedOrder.paymentMethod}
                  </span>
                </p>
              </div>

              {/* Total */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Subtotal</span>
                  <span>${Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">Discount</span>
                  <span>-${Number(selectedOrder.discount || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">Shipping</span>
                  <span>${Number(selectedOrder.shippingFee || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">Tax</span>
                  <span>${Number(selectedOrder.tax || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xl font-black border-t border-neutral-800 pt-3">
                  <span>Total</span>
                  <span className="text-amber-500">
                    ${Number(selectedOrder.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};