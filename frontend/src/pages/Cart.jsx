import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/helpers';

const Cart = () => {
  const { cart, updateCart, removeFromCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] text-[#1a1c1c]">
      <Header />
      <main className="pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex-1">
        {/* Cart Title */}
        <header className="mb-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-[#1a1c1c] mb-4">
            Giỏ Hàng Của Bạn
          </h1>
          <div className="w-12 h-[1px] bg-[#735c00] mx-auto"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Cart Items Section */}
          <div className="lg:col-span-8">
            {cart.items.length === 0 ? (
              <div className="text-center py-20 bg-white p-16 relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#735c00]"></div>
                <svg className="w-16 h-16 text-[#e2e2e2] mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="font-serif text-2xl text-[#1a1c1c] mb-4">Giỏ hàng trống</h2>
                <p className="text-[#4d4635] font-light mb-8">Khám phá bộ sưu tập của chúng tôi để tìm kiếm những tuyệt tác kim hoàn.</p>
                <Link 
                  to="/products" 
                  className="inline-block px-10 py-4 bg-[#735c00] text-white font-sans font-medium tracking-[0.15em] uppercase text-sm hover:bg-[#554300] hover:-translate-y-0.5 transition-all duration-200"
                >
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              <div className="space-y-0">
                {/* Column Headers */}
                <div className="hidden md:grid grid-cols-6 pb-6 border-b border-[#d0c5af]/20 text-[11px] uppercase tracking-[0.2em] text-[#4d4635] font-bold">
                  <div className="col-span-3">Sản phẩm</div>
                  <div className="text-center">Đơn giá</div>
                  <div className="text-center">Số lượng</div>
                  <div className="text-right">Thành tiền</div>
                </div>

                {/* Cart Items */}
                {cart.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="grid grid-cols-1 md:grid-cols-6 items-center gap-8 md:gap-4 py-12 border-b border-[#d0c5af]/10"
                  >
                    {/* Product Info */}
                    <div className="col-span-3 flex items-center space-x-6">
                      <div className="w-32 h-32 bg-white overflow-hidden">
                        <img 
                          src={getImageUrl(item.thumbnail || item.product_image)} 
                          alt={item.product_name} 
                          className="w-full h-full object-cover grayscale-[0.1] hover:scale-105 transition-transform duration-700" 
                          onError={(e) => { 
                            e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop'; 
                          }} 
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif text-[#1a1c1c] mb-1">{item.product_name}</h3>
                        <p className="text-xs text-[#4d4635] uppercase tracking-widest font-medium">
                          {item.variant_name || 'Vàng 18K'}
                        </p>
                        <button 
                          onClick={() => removeFromCart(item.product_id)} 
                          className="mt-4 text-[10px] uppercase tracking-widest text-[#4d4635] hover:text-[#ba1a1a] transition-colors flex items-center"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Gỡ bỏ
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="md:text-center text-sm font-medium text-[#1a1c1c]">
                      {formatPrice(item.unit_price)}
                    </div>

                    {/* Quantity */}
                    <div className="flex justify-start md:justify-center">
                      <div className="flex items-center border border-[#d0c5af]/30 h-10 px-2 bg-white">
                        <button 
                          onClick={() => updateCart(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#4d4635] hover:text-[#735c00] transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCart(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#4d4635] hover:text-[#735c00] transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right text-sm font-bold text-[#735c00]">
                      {formatPrice(item.unit_price * item.quantity)}
                    </div>
                  </div>
                ))}

                {/* Continue Shopping */}
                <div className="mt-12">
                  <Link 
                    to="/products" 
                    className="inline-flex items-center group text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a1c1c] hover:text-[#735c00] transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Tiếp Tục Mua Sắm
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Summary & Checkout Section */}
          <div className="lg:col-span-4 space-y-8">
            {/* Order Summary */}
            <div className="bg-white p-8 md:p-10 relative shadow-[0_20px_40px_-20px_rgba(26,28,28,0.04)]">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#735c00]"></div>
              
              <h2 className="text-xl font-serif text-[#1a1c1c] mb-8 tracking-tight">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4d4635]">Tạm tính</span>
                  <span className="text-[#1a1c1c]">{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4d4635]">Thuế (VAT 10%)</span>
                  <span className="text-[#1a1c1c]">{formatPrice(cart.total * 0.1)}</span>
                </div>
                <div className="pt-6 border-t border-[#d0c5af]/20 flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest text-[#1a1c1c]">Tổng cộng</span>
                  <span className="text-2xl font-light text-[#735c00]">{formatPrice(cart.total * 1.1)}</span>
                </div>
              </div>

              {/* Free Shipping Badge */}
              <div className="mt-10 mb-8 p-4 bg-[#f3f3f3] text-center">
                <p className="text-[11px] uppercase tracking-widest text-[#d4af37] font-bold flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Giao hàng miễn phí toàn quốc
                </p>
              </div>

              <Link 
                to="/checkout" 
                className="block w-full bg-[#735c00] hover:bg-[#554300] text-white py-5 text-[11px] uppercase tracking-[0.3em] font-bold transition-all duration-500 text-center shadow-[0_20px_40px_-20px_rgba(26,28,28,0.04)]"
              >
                Tiến Hành Thanh Toán
              </Link>

              {/* Payment Methods */}
              <div className="mt-8 flex justify-center space-x-4 opacity-40 grayscale">
                <span className="text-[#4d4635] text-xs font-bold">VISA</span>
                <span className="text-[#4d4635] text-xs font-bold">MASTERCARD</span>
                <span className="text-[#4d4635] text-xs font-bold">PAYPAL</span>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center p-6 bg-white border border-[#d0c5af]/10">
                <div className="w-10 h-10 flex items-center justify-center bg-[#f3f3f3] text-[#735c00] mr-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1a1c1c]">Bảo mật thanh toán</h4>
                  <p className="text-[10px] text-[#4d4635]">Mã hóa SSL 256-bit chuẩn quốc tế</p>
                </div>
              </div>

              <div className="flex items-center p-6 bg-white border border-[#d0c5af]/10">
                <div className="w-10 h-10 flex items-center justify-center bg-[#f3f3f3] text-[#735c00] mr-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1a1c1c]">Chứng nhận GIA</h4>
                  <p className="text-[10px] text-[#4d4635]">Đảm bảo giá trị kim cương trọn đời</p>
                </div>
              </div>

              <div className="flex items-center p-6 bg-white border border-[#d0c5af]/10">
                <div className="w-10 h-10 flex items-center justify-center bg-[#f3f3f3] text-[#735c00] mr-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1a1c1c]">Đóng gói quà tặng</h4>
                  <p className="text-[10px] text-[#4d4635]">Hộp nhung và thiệp tay cao cấp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;