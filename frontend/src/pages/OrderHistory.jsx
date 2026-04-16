import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { orderAPI } from '../utils/api';
import { formatPrice } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    orderAPI.getOrders()
      .then(res => {
        if (res.data.success) setOrders(res.data.data.orders);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-[#166534]/10 text-[#166534] border border-[#166534]/20';
      case 'shipped': return 'bg-[#1E40AF]/10 text-[#1E40AF] border border-[#1E40AF]/20';
      case 'processing': return 'bg-[#854D0E]/10 text-[#854D0E] border border-[#854D0E]/20';
      case 'confirmed': return 'bg-[#6B21A8]/10 text-[#6B21A8] border border-[#6B21A8]/20';
      case 'cancelled': return 'bg-[#991B1B]/10 text-[#991B1B] border border-[#991B1B]/20';
      case 'pending':
      default: return 'bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status || 'Không xác định';
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method?.toLowerCase()) {
      case 'cod': return 'Thanh toán khi nhận hàng (COD)';
      case 'bank_transfer': return 'Chuyển khoản ngân hàng';
      case 'vnpay': return 'VNPAY';
      case 'momo': return 'Ví MoMo';
      case 'zalopay': return 'ZaloPay';
      default: return method || 'Không xác định';
    }
  };

  const statusFilters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'shipped', label: 'Đang giao' },
    { key: 'delivered', label: 'Đã giao' },
    { key: 'cancelled', label: 'Đã hủy' }
  ];

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status?.toLowerCase() === filter);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="w-12 h-12 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1A1A] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] bg-[#B8860B]/[0.02] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-[#B8860B]/[0.02] rounded-full blur-3xl"></div>
      </div>

      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-6 md:px-12 relative">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8860B]">Tài khoản</span>
            <span className="h-px flex-1 max-w-[60px] bg-[#E8E4DF]"></span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-center tracking-tight leading-[1.05]">
            Đơn hàng của bạn
          </h1>
          <p className="text-center text-[#6B6B6B] mt-6 max-w-lg mx-auto leading-relaxed text-base">
            Theo dõi các tác phẩm trang sức đang được chế tác và vận chuyển dành riêng cho bạn
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 pb-32 px-6 md:px-12 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(26,26,26,0.05)] overflow-hidden lg:sticky lg:top-40">
                <div className="h-[3px] bg-gradient-to-r from-[#B8860B] via-[#D4A84B] to-[#B8860B]"></div>
                <div className="p-10">
                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center mb-10 pb-10 border-b border-[#E8E4DF]">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F5F3F0] to-[#E8E4DF] flex items-center justify-center mb-5 border-2 border-[#B8860B]/20 shadow-inner">
                      <span className="font-serif text-4xl text-[#B8860B] tracking-wide">{initials}</span>
                    </div>
                    <h3 className="font-serif text-2xl mb-1">{user?.name}</h3>
                    <p className="text-sm text-[#6B6B6B]">{user?.email}</p>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2 mb-8">
                    <Link
                      to="/profile"
                      className="flex items-center gap-4 p-4 rounded-lg text-[#6B6B6B] hover:bg-[#F5F3F0] hover:text-[#1A1A1A] transition-all group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#F5F3F0] flex items-center justify-center group-hover:bg-[#B8860B]/10 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em]">Hồ sơ</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-4 p-4 rounded-lg bg-[#B8860B] text-white transition-all group"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em]">Đơn hàng</span>
                    </Link>
                  </nav>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 p-4 border border-[#E8E4DF] text-[#6B6B6B] hover:border-[#BA1A1A] hover:text-[#BA1A1A] hover:bg-[#BA1A1A]/5 rounded-lg transition-all font-mono text-[10px] uppercase tracking-[0.15em]"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">

              {/* Filter Tabs */}
              <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(26,26,26,0.05)] overflow-hidden">
                <div className="h-[3px] bg-gradient-to-r from-[#B8860B] via-[#D4A84B] to-[#B8860B]"></div>
                <div className="overflow-x-auto">
                  <div className="flex min-w-max">
                    {statusFilters.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setFilter(item.key)}
                        className={`px-6 py-5 font-mono text-[10px] uppercase transition-all whitespace-nowrap ${
                          filter === item.key
                            ? 'text-[#B8860B] border-b-2 border-[#B8860B] bg-[#B8860B]/5'
                            : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F3F0]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(26,26,26,0.05)] overflow-hidden">
                  <div className="h-[3px] bg-gradient-to-r from-[#B8860B] via-[#D4A84B] to-[#B8860B]"></div>
                  <div className="py-24 px-10 text-center">
                    {/* Decorative element */}
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#F5F3F0] flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#E8E4DF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-3xl mb-4">Không có đơn hàng nào</h3>
                    <p className="text-[#6B6B6B] mb-10 max-w-sm mx-auto leading-relaxed">
                      {filter === 'all'
                        ? 'Chưa có đơn hàng nào được tạo. Hãy bắt đầu khám phá bộ sưu tập của chúng tôi.'
                        : <>Không có đơn hàng với trạng thái "{getStatusText(filter)}".</>}
                    </p>
                    <Link
                      to="/products"
                      className="inline-block px-10 py-4 bg-[#B8860B] text-white font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-[#D4A84B] rounded-md transition-all shadow-sm"
                    >
                      Khám phá bộ sưu tập
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`bg-white rounded-lg shadow-[0_4px_20px_rgba(26,26,26,0.05)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(26,26,26,0.08)] ${
                        expandedOrder === order.id ? 'shadow-[0_8px_30px_rgba(26,26,26,0.1)]' : ''
                      }`}
                    >
                      {/* Gold Gradient Top */}
                      <div className={`h-[3px] transition-all ${expandedOrder === order.id ? 'bg-gradient-to-r from-[#B8860B] via-[#D4A84B] to-[#B8860B]' : 'bg-gradient-to-r from-[#E8E4DF] via-[#E8E4DF] to-[#E8E4DF]'}`}></div>

                      {/* Order Header */}
                      <div
                        className="p-8 cursor-pointer hover:bg-[#FAFAF8]/50 transition-colors"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          {/* Order Info */}
                          <div className="flex flex-wrap items-center gap-8">
                            <div>
                              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] block mb-2">Mã đơn hàng</span>
                              <span className="font-serif text-2xl tracking-wide text-[#1A1A1A]">#{order.id}</span>
                            </div>
                            <div>
                              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] block mb-2">Ngày đặt</span>
                              <span className="text-base">
                                {new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                              </span>
                            </div>
                            <div>
                              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] block mb-2">Tổng cộng</span>
                              <span className="font-serif text-2xl text-[#B8860B]">{formatPrice(order.total_price)}</span>
                            </div>
                          </div>

                          {/* Status & Expand */}
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded-full ${getStatusStyle(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                            <svg
                              className={`w-5 h-5 text-[#6B6B6B] transition-all duration-300 ${
                                expandedOrder === order.id ? 'rotate-180' : ''
                              }`}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Product Preview */}
                      <div className="px-8 pb-6 border-t border-[#E8E4DF]/50">
                        <div className="flex items-center gap-3 pt-5 mb-4">
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B]">Sản phẩm</span>
                          <span className="h-px flex-1 max-w-[40px] bg-[#E8E4DF]"></span>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {(order.items || []).slice(0, 4).map((item, index) => (
                            <div key={index} className="w-20 h-20 bg-[#F5F3F0] rounded-lg overflow-hidden">
                              <img
                                src={item.image_url || item.thumbnail || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop'}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop';
                                }}
                              />
                            </div>
                          ))}
                          {(order.items || []).length > 4 && (
                            <div className="w-20 h-20 bg-[#F5F3F0] rounded-lg flex items-center justify-center">
                              <span className="font-mono text-sm text-[#6B6B6B]">+{order.items.length - 4}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedOrder === order.id && (
                        <div className="px-8 pb-8 border-t border-[#E8E4DF] bg-[#FAFAF8]/50">
                          {/* Shipping & Payment */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-8 border-b border-[#E8E4DF]">
                            <div>
                              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8860B] mb-4">Thông tin giao hàng</h4>
                              <p className="font-serif text-lg mb-1">{order.customer_name || user?.name}</p>
                              <p className="text-sm text-[#6B6B6B]">{order.customer_phone || user?.phone || 'N/A'}</p>
                              <p className="text-sm text-[#6B6B6B] mt-1">{order.shipping_address || user?.address || 'N/A'}</p>
                            </div>
                            <div>
                              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8860B] mb-4">Phương thức thanh toán</h4>
                              <p className="text-base">{getPaymentMethodText(order.payment_method)}</p>
                              <p className="text-sm text-[#6B6B6B] mt-1">
                                Trạng thái: <span className="text-[#1A1A1A]">{order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                              </p>
                            </div>
                          </div>

                          {/* Items List */}
                          <div className="py-8 border-b border-[#E8E4DF]">
                            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8860B] mb-6">Chi tiết đơn hàng</h4>
                            <div className="space-y-4">
                              {(order.items || []).map((item, index) => (
                                <div key={index} className="flex items-center gap-5 bg-white rounded-lg p-5 shadow-sm">
                                  <div className="w-16 h-16 bg-[#F5F3F0] rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={item.image_url || item.thumbnail || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop'}
                                      alt={item.product_name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop';
                                      }}
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <p className="font-serif text-base mb-1">{item.product_name}</p>
                                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#6B6B6B]">
                                      {item.variant_name || item.size || 'Standard'}
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="font-serif text-base text-[#B8860B]">{formatPrice(item.unit_price)}</p>
                                    <p className="font-mono text-[10px] text-[#6B6B6B]">x{item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="py-8 space-y-3 max-w-xs ml-auto">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#6B6B6B]">Tạm tính</span>
                              <span className="font-serif">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#6B6B6B]">Phí vận chuyển</span>
                              <span className="font-serif">{order.shipping_fee === 0 ? 'Miễn phí' : formatPrice(order.shipping_fee)}</span>
                            </div>
                            {order.discount_amount > 0 && (
                              <div className="flex justify-between text-sm text-[#166534]">
                                <span>Giảm giá</span>
                                <span className="font-serif">-{formatPrice(order.discount_amount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-lg pt-3 border-t border-[#E8E4DF]">
                              <span className="font-serif">Tổng cộng</span>
                              <span className="font-serif text-[#B8860B]">{formatPrice(order.total_price)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                            <Link
                              to={`/orders/${order.id}`}
                              className="px-8 py-3.5 font-mono text-[10px] uppercase tracking-[0.15em] border border-[#E8E4DF] hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-md transition-all text-center"
                            >
                              Xem chi tiết
                            </Link>
                            {order.status === 'delivered' && (
                              <button className="px-8 py-3.5 font-mono text-[10px] uppercase tracking-[0.15em] bg-[#B8860B] text-white hover:bg-[#D4A84B] rounded-md transition-all shadow-sm">
                                Đánh giá sản phẩm
                              </button>
                            )}
                            {['pending', 'processing'].includes(order.status) && (
                              <button className="px-8 py-3.5 font-mono text-[10px] uppercase tracking-[0.15em] border border-[#991B1B] text-[#991B1B] hover:bg-[#991B1B] hover:text-white rounded-md transition-all">
                                Hủy đơn hàng
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistory;
