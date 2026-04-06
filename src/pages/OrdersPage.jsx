import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'accepted': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'shipped': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getVariantColor = (variant) => {
    switch(variant?.toUpperCase()) {
      case 'BUDDY': return '#00E5FF';
      case 'LUNA': return '#FF69B4';
      case 'BATMAN': return '#FFD700';
      default: return '#888';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-20 px-6 flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-white border-white/20 rounded-full animate-spin mb-4"></div>
          <p className="text-[#888] tracking-widest uppercase text-sm font-bold">Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="flex items-end justify-between border-b border-white/10 pb-6 mb-8">
          <h1 className="text-3xl sm:text-[40px] font-black leading-none" style={{ fontFamily: 'Nunito, sans-serif' }}>My Orders</h1>
          <span className="text-[#888] font-bold">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-[80px] mb-6 opacity-30 animate-pulse">📦</div>
            <h2 className="text-2xl font-black mb-3">No orders placed yet</h2>
            <p className="text-[#888] max-w-[300px] mb-8">It seems you haven't bought anything from us yet. Ready to level up your brushing?</p>
            <Link 
              to="/" 
              className="px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-xl transition-transform hover:-translate-y-1"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map(order => (
              <div 
                key={order.id} 
                className="bg-[#141414] border border-white/[0.06] rounded-[16px] p-5 sm:p-6 flex flex-col sm:flex-row gap-6 hover:bg-[#181818] transition-colors relative overflow-hidden"
              >
                {/* Variant color strip indicator */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 opacity-80"
                  style={{ backgroundColor: getVariantColor(order.variant) }}
                />

                <div className="flex-1 flex flex-col pl-2 sm:pl-0">
                  {/* Top Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h3 className="text-lg font-black" style={{ fontFamily: 'Nunito, sans-serif' }}>DENTY {order.variant?.toUpperCase()}</h3>
                    <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-[13px] text-[#ccc]">
                    <div className="flex justify-between sm:justify-start sm:gap-4">
                      <span className="text-[#666]">Order #:</span>
                      <span className="font-mono">{order.order_number}</span>
                    </div>
                    <div className="flex justify-between sm:justify-start sm:gap-4">
                      <span className="text-[#666]">Date:</span>
                      <span>{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between sm:justify-start sm:gap-4">
                      <span className="text-[#666]">Amount:</span>
                      <span className="font-bold text-white">₹{(order.amount / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between sm:justify-start sm:gap-4">
                      <span className="text-[#666]">Payment ID:</span>
                      <span className="font-mono text-[12px]">{order.payment_id.slice(0,12)}...</span>
                    </div>
                  </div>

                  <div className="h-[1px] w-full bg-white/5 my-4" />

                  {/* Address & Tracking Floor */}
                  <div className="text-[13px] flex flex-col gap-2">
                    <p className="text-[#888]">
                      Delivering to: <span className="text-[#ccc]">{order.city}, {order.state} — {order.pincode}</span>
                    </p>
                    
                    {order.tracking_number && (
                      <p className="mt-1">
                        <span className="text-blue-400 cursor-pointer hover:underline font-medium">
                          DTDC Tracking: {order.tracking_number}
                        </span>
                      </p>
                    )}
                    
                    {order.status === 'delivered' && (
                      <p className="text-green-500 font-bold mt-1">✅ Delivered Successfully</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
