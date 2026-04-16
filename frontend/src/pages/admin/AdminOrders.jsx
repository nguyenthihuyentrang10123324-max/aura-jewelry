import { useState, useEffect } from 'react';
import { orderAPI } from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const itemsPerPage = 8;

  const buildParams = () => {
    const p = {};
    if (filter !== 'all') p.status = filter;
    if (filterPayment !== 'all') p.payment_status = filterPayment;
    if (search.trim()) p.search = search.trim();
    if (dateFrom) p.from_date = dateFrom;
    if (dateTo) p.to_date = dateTo;
    p.page = currentPage;
    p.limit = itemsPerPage;
    return p;
  };

  useEffect(() => {
    setLoading(true);
    orderAPI.getAllOrders(buildParams())
      .then(res => {
        if (res.data.success) {
          setOrders(res.data.data.orders || []);
          setTotalCount(res.data.data.pagination?.total || 0);
        }
      })
      .catch(() => toast.error('Không tải được dữ liệu đơn hàng'))
      .finally(() => setLoading(false));
  }, [filter, filterPayment, search, dateFrom, dateTo, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [filter, filterPayment, search, dateFrom, dateTo]);

  const statusFilters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'shipped', label: 'Đang giao' },
    { key: 'delivered', label: 'Đã giao' },
    { key: 'cancelled', label: 'Đã hủy' },
  ];

  const paymentFilters = [
    { key: 'all', label: 'Tất cả TT' },
    { key: 'pending', label: 'Chưa thanh toán' },
    { key: 'paid', label: 'Đã thanh toán' },
    { key: 'failed', label: 'Thanh toán lỗi' },
  ];

  const getStatusStyle = (status) => {
    const map = {
      pending: { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
      confirmed: { bg: '#EDE9FE', text: '#7C3AED', dot: '#8B5CF6' },
      processing: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
      shipped: { bg: '#DBEAFE', text: '#1D4ED8', dot: '#3B82F6' },
      delivered: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
      cancelled: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
    };
    return map[status?.toLowerCase()] || map.pending;
  };

  const getStatusText = (status) => {
    const map = {
      pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý', shipped: 'Đang giao',
      delivered: 'Đã giao', cancelled: 'Đã hủy'
    };
    return map[status?.toLowerCase()] || status;
  };

  const getPaymentStatusStyle = (status) => {
    const map = {
      pending: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
      paid: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
      failed: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
    };
    return map[status?.toLowerCase()] || map.pending;
  };

  const getPaymentStatusText = (status) => {
    const map = { pending: 'Chưa thanh toán', paid: 'Đã thanh toán', failed: 'Thanh toán lỗi' };
    return map[status?.toLowerCase()] || status || '—';
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateStatus = async (id, status, e) => {
    e?.stopPropagation();
    try {
      await orderAPI.updateOrderStatus(id, { status });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      toast.success('Cập nhật thành công');
    } catch { toast.error('Cập nhật thất bại'); }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (name) => {
    const gs = [
      'linear-gradient(135deg, #F59E0B, #FCD34D)',
      'linear-gradient(135deg, #10B981, #6EE7B7)',
      'linear-gradient(135deg, #3B82F6, #93C5FD)',
      'linear-gradient(135deg, #8B5CF6, #C4B5FD)',
      'linear-gradient(135deg, #EF4444, #FCA5A5)',
    ];
    if (!name) return gs[0];
    return gs[name.charCodeAt(0) % gs.length];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid #FDE68A', borderTopColor: '#F59E0B' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>Đơn hàng</h1>
          <p className="text-sm mt-1" style={{ color: '#92400E' }}>{totalCount} đơn hàng</p>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}>
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#92400E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm mã đơn, tên, email, số điện thoại..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#92400E' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Payment status filter */}
        <select
          value={filterPayment}
          onChange={e => setFilterPayment(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
        >
          {paymentFilters.map(f => (
            <option key={f.key} value={f.key}>{f.label}</option>
          ))}
        </select>

        {/* Date from */}
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
        />

        {/* Date to */}
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#1F2937', outline: 'none' }}
        />

        {/* Clear all filters */}
        {(filter !== 'all' || filterPayment !== 'all' || search || dateFrom || dateTo) && (
          <button
            onClick={() => {
              setFilter('all');
              setFilterPayment('all');
              setSearch('');
              setDateFrom('');
              setDateTo('');
            }}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map(item => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200"
            style={filter === item.key
              ? { background: '#F59E0B', color: '#FFFFFF', boxShadow: '0 2px 8px rgba(245,158,11,0.25)' }
              : { background: '#FFFFFF', color: '#92400E', border: '1px solid #FDE68A' }
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {paginatedOrders.length === 0 ? (
        <div className="rounded-2xl p-20 text-center" style={{ background: '#FFFFFF', border: '1px solid #FDE68A' }}>
          <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#FDE68A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-base font-medium mb-1" style={{ color: '#374151' }}>
            {filter !== 'all' || filterPayment !== 'all' || search || dateFrom || dateTo ? 'Không tìm thấy đơn hàng' : 'Chưa có đơn hàng nào'}
          </p>
          <p className="text-sm" style={{ color: '#92400E' }}>
            {filter !== 'all' || filterPayment !== 'all' || search || dateFrom || dateTo ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm' : 'Đơn hàng sẽ xuất hiện khi có khách đặt.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedOrders.map(order => {
            const sc = getStatusStyle(order.status);
            const isExpanded = expandedId === order.id;
            return (
              <div
                key={order.id}
                className="rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  background: '#FFFFFF',
                  border: isExpanded ? '2px solid #F59E0B' : '1px solid #FDE68A',
                  boxShadow: isExpanded ? '0 4px 16px rgba(245,158,11,0.12)' : '0 1px 8px rgba(146,64,14,0.06)',
                }}
              >
                <div
                  className="px-6 py-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: getAvatarGradient(order.user_name) }}>
                        <span className="text-xs font-bold text-white">{getInitials(order.user_name)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-base font-bold" style={{ color: '#1F2937' }}>#{order.id}</span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium" style={{ background: sc.bg, color: sc.text }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }}></span>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: '#374151' }}>{order.user_name || order.name || 'Khách vãng lai'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#92400E' }}>Tổng tiền</p>
                        <p className="text-xl font-bold" style={{ color: '#F59E0B', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold' }}>{formatPrice(order.total_price)}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#92400E' }}>Ngày đặt</p>
                        <p className="text-sm" style={{ color: '#374151' }}>
                          {new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <svg
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        style={{ color: '#92400E' }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-6 pb-5 pt-0" style={{ borderTop: '1px solid #FDE68A' }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5" style={{ borderBottom: '1px solid #FEF9F0' }}>
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#92400E' }}>Khách hàng</p>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: getAvatarGradient(order.user_name) }}>
                            <span className="text-[10px] font-bold text-white">{getInitials(order.user_name)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#1F2937' }}>{order.user_name || order.name || 'N/A'}</p>
                            <p className="text-xs" style={{ color: '#92400E' }}>{order.email || '—'}</p>
                            {order.phone && <p className="text-xs" style={{ color: '#92400E' }}>{order.phone}</p>}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#92400E' }}>Địa chỉ giao hàng</p>
                        <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{order.address || order.shipping_address || 'Chưa có'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#92400E' }}>Cập nhật trạng thái</p>
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value, e)}
                          onClick={e => e.stopPropagation()}
                          className="w-full px-3 py-2 text-sm rounded-xl"
                          style={{ border: '1px solid #FDE68A', background: '#FEF3C7', color: '#1F2937', outline: 'none' }}
                        >
                          {statusFilters.slice(1).map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-5">
                      <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#92400E' }}>Sản phẩm đã đặt</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                            <img
                              src={item.image || 'https://via.placeholder.com/100'}
                              alt={item.product_name}
                              className="w-14 h-14 object-cover rounded-lg"
                              style={{ background: '#FDE68A' }}
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop'; }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1" style={{ color: '#1F2937' }}>{item.product_name}</p>
                              <p className="text-xs mt-0.5" style={{ color: '#92400E' }}>{item.variant || item.size || 'Standard'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold" style={{ color: '#F59E0B', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold' }}>{formatPrice(item.price)}</p>
                              <p className="text-xs" style={{ color: '#92400E' }}>x{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #FDE68A' }}>
          <p className="text-xs" style={{ color: '#92400E' }}>
            {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalCount)} / {totalCount}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="p-2 rounded-lg transition-colors disabled:opacity-30" style={{ color: '#92400E' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) page = i + 1;
              else if (currentPage <= 3) page = i + 1;
              else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
              else page = currentPage - 2 + i;
              return (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                  style={currentPage === page ? { background: '#F59E0B', color: '#FFF' } : { color: '#92400E' }}>
                  {page}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="p-2 rounded-lg transition-colors disabled:opacity-30" style={{ color: '#92400E' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
