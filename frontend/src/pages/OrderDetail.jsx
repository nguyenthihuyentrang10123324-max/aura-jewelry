import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { orderAPI } from '../utils/api';
import { formatPrice } from '../utils/helpers';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOrderById(id)
      .then(res => { if (res.data.success) setOrder(res.data.data.order); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="w-12 h-12 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <p className="text-[#6B6B6B]">Không tìm thấy đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
      <Header />
      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/orders" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#B8860B] hover:text-[#D4A84B] mb-12 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại đơn hàng
          </Link>

          <div className="text-center mb-16">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B8860B]">Chi tiết</span>
              <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">Đơn hàng #{order.order_number}</h1>
          </div>

          <div className="bg-white p-10 md:p-12 border-t-2 border-[#B8860B] mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-3">Người nhận</p>
                <p className="font-sans text-base text-[#1A1A1A]">{order.customer_name}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-3">Điện thoại</p>
                <p className="font-sans text-base text-[#1A1A1A]">{order.customer_phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-3">Địa chỉ</p>
                <p className="font-sans text-base text-[#1A1A1A]">
                  {[order.shipping_address, order.shipping_city, order.shipping_district].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>

            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-8">Sản phẩm</h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-6 border-b border-[#E8E4DF] last:border-b-0">
                  <div>
                    <p className="font-sans text-base text-[#1A1A1A]">{item.product_name}</p>
                    <p className="text-[#6B6B6B] text-sm mt-1">{item.quantity} x {formatPrice(item.unit_price)}</p>
                  </div>
                  <p className="font-serif text-lg text-[#B8860B]">{formatPrice(item.unit_price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-[#E8E4DF] text-right">
              <p className="font-sans text-sm text-[#6B6B6B] mb-2">Tổng cộng</p>
              <p className="font-serif text-3xl text-[#B8860B]">{formatPrice(order.total_price)}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
