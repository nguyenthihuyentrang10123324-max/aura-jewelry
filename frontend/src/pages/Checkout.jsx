import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    shippingMethod: 'standard',
    paymentMethod: 'banking'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        customer_name: formData.name,
        customer_email: user?.email || '',
        customer_phone: formData.phone,
        shipping_address: `${formData.address}, ${formData.city}`,
        shipping_city: formData.city,
        shipping_note: '',
        shipping_fee: shippingCost,
        payment_method: formData.paymentMethod === 'banking' ? 'bank_transfer' : formData.paymentMethod,
        items: cart.items.map(item => ({
          product_id: item.product_id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Đặt hàng thành công!');
        window.location.href = '/order-history';
      } else {
        toast.error(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = formData.shippingMethod === 'express' ? 250000 : 0;
  const subtotal = cart.total || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax + shippingCost;

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c]">
      <Header />

      {/* Back Button */}
      <div className="pt-32 max-w-7xl mx-auto px-6 md:px-12">
        <Link 
          to="/cart" 
          className="inline-flex items-center gap-2 text-sm text-[#4d4635] hover:text-[#735c00] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs uppercase tracking-widest">Quay lại giỏ hàng</span>
        </Link>
      </div>

      <main className="pt-8 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-7 space-y-16">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Shipping Information */}
              <section className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-sans tracking-widest text-[#d4af37] border border-[#d4af37] px-2 py-1">01</span>
                  <h2 className="text-2xl font-serif text-[#1a1c1c]">Thông tin giao hàng</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-widest text-[#5f5e5e]">Họ và tên</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#d0c5af] focus:border-[#735c00] focus:ring-0 py-2 px-0 transition-colors outline-none"
                      placeholder="Nguyễn Văn A"
                      type="text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-widest text-[#5f5e5e]">Số điện thoại</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#d0c5af] focus:border-[#735c00] focus:ring-0 py-2 px-0 transition-colors outline-none"
                      placeholder="090 123 4567"
                      type="tel"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] uppercase tracking-widest text-[#5f5e5e]">Địa chỉ</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#d0c5af] focus:border-[#735c00] focus:ring-0 py-2 px-0 transition-colors outline-none"
                      placeholder="Số nhà, tên đường, phường/xã"
                      type="text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-widest text-[#5f5e5e]">Thành phố</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#d0c5af] focus:border-[#735c00] focus:ring-0 py-2 px-0 transition-colors outline-none"
                      placeholder="TP. Hồ Chí Minh"
                      type="text"
                    />
                  </div>
                </div>
              </section>

              {/* Step 2: Shipping Methods */}
              <section className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-sans tracking-widest text-[#d4af37] border border-[#d4af37] px-2 py-1">02</span>
                  <h2 className="text-2xl font-serif text-[#1a1c1c]">Phương thức vận chuyển</h2>
                </div>
                <div className="space-y-4">
                  <label className={`flex items-center justify-between p-6 bg-white cursor-pointer transition-colors ${formData.shippingMethod === 'standard' ? 'ring-1 ring-[#735c00]' : 'hover:bg-[#f3f3f3]'}`}>
                    <div className="flex items-center gap-4">
                      <input
                        checked={formData.shippingMethod === 'standard'}
                        onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                        className="text-[#735c00] focus:ring-[#735c00] w-4 h-4"
                        name="shipping"
                        type="radio"
                      />
                      <div>
                        <p className="font-medium text-[#1a1c1c]">Giao hàng Tiêu chuẩn</p>
                        <p className="text-sm text-[#5f5e5e]">Từ 3-5 ngày làm việc</p>
                      </div>
                    </div>
                    <span className="font-serif text-[#5f5e5e]">Miễn phí</span>
                  </label>
                  <label className={`flex items-center justify-between p-6 bg-white cursor-pointer transition-colors ${formData.shippingMethod === 'express' ? 'ring-1 ring-[#735c00]' : 'hover:bg-[#f3f3f3]'}`}>
                    <div className="flex items-center gap-4">
                      <input
                        checked={formData.shippingMethod === 'express'}
                        onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                        className="text-[#735c00] focus:ring-[#735c00] w-4 h-4"
                        name="shipping"
                        type="radio"
                      />
                      <div>
                        <p className="font-medium text-[#1a1c1c]">Giao hàng Hỏa tốc</p>
                        <p className="text-sm text-[#5f5e5e]">Trong vòng 24 giờ</p>
                      </div>
                    </div>
                    <span className="font-serif">250,000₫</span>
                  </label>
                </div>
              </section>

              {/* Step 3: Payment Methods */}
              <section className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-sans tracking-widest text-[#d4af37] border border-[#d4af37] px-2 py-1">03</span>
                  <h2 className="text-2xl font-serif text-[#1a1c1c]">Phương thức thanh toán</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className={`flex flex-col items-center justify-center p-6 bg-white border transition-all cursor-pointer text-center ${formData.paymentMethod === 'banking' ? 'border-[#d4af37]' : 'border-transparent hover:border-[#d0c5af]'}`}>
                    <input
                      checked={formData.paymentMethod === 'banking'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'banking' })}
                      className="hidden"
                      name="payment"
                      type="radio"
                    />
                    <svg className="w-8 h-8 mb-3 text-[#5f5e5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-[11px] uppercase tracking-widest">Chuyển khoản</span>
                  </label>
                  <label className={`flex flex-col items-center justify-center p-6 bg-white border transition-all cursor-pointer text-center ${formData.paymentMethod === 'card' ? 'border-[#d4af37]' : 'border-transparent hover:border-[#d0c5af]'}`}>
                    <input
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className="hidden"
                      name="payment"
                      type="radio"
                    />
                    <svg className="w-8 h-8 mb-3 text-[#5f5e5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-[11px] uppercase tracking-widest">Thẻ tín dụng</span>
                  </label>
                  <label className={`flex flex-col items-center justify-center p-6 bg-white border transition-all cursor-pointer text-center ${formData.paymentMethod === 'cod' ? 'border-[#d4af37]' : 'border-transparent hover:border-[#d0c5af]'}`}>
                    <input
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className="hidden"
                      name="payment"
                      type="radio"
                    />
                    <svg className="w-8 h-8 mb-3 text-[#5f5e5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span className="text-[11px] uppercase tracking-widest">COD</span>
                  </label>
                </div>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#735c00] text-white py-5 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-[#554300] disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Hoàn tất đơn hàng'}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 md:p-12 space-y-10 sticky top-32">
              <h3 className="text-xl font-serif pb-6 border-b border-[#eeeeee]">Chi tiết đơn hàng</h3>
              
              {/* Item List */}
              <div className="space-y-8">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-6 items-start">
                    <div className="w-24 h-24 bg-[#f3f3f3] shrink-0 overflow-hidden">
                      <img
                        alt={item.product_name}
                        src={getImageUrl(item.thumbnail || item.product_image)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop';
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium">{item.product_name}</h4>
                      <p className="text-xs text-[#5f5e5e] mt-1 tracking-wide">
                        {item.variant_name || 'Vàng 18K'}
                      </p>
                      <p className="text-sm mt-4 font-serif">{formatPrice(item.unit_price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="space-y-4 pt-8 border-t border-[#eeeeee]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5f5e5e]">Tạm tính</span>
                  <span className="font-serif">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5f5e5e]">Thuế (VAT 10%)</span>
                  <span className="font-serif">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5f5e5e]">Phí vận chuyển</span>
                  <span className="font-serif text-[#5f5e5e]">
                    {shippingCost === 0 ? 'Miễn phí' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-serif pt-6 border-t border-[#eeeeee]">
                  <span className="text-[#1a1c1c]">Tổng cộng</span>
                  <span className="text-[#d4af37]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust Markers */}
              <div className="pt-10 grid grid-cols-1 gap-6">
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#5f5e5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[11px] uppercase tracking-[0.1em] text-[#5f5e5e]">Bảo mật thanh toán</span>
                </div>
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#5f5e5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-[11px] uppercase tracking-[0.1em] text-[#5f5e5e]">Chứng nhận GIA</span>
                </div>
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#5f5e5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <span className="text-[11px] uppercase tracking-[0.1em] text-[#5f5e5e]">Đóng gói quà tặng cao cấp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Checkout;