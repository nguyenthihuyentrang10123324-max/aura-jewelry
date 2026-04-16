import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../utils/api';
import { formatPrice } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [growthRate, setGrowthRate] = useState(null);

  useEffect(() => {
    const now = new Date();
    const localDate = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    const today = localDate(now);
    const weekAgo = localDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
    const twoWeeksAgo = localDate(new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000));

    Promise.all([
      orderAPI.getStats(),
      orderAPI.getAllOrders(),
      orderAPI.getRevenueByDate({ from_date: weekAgo, to_date: today, group_by: 'day' }),
      orderAPI.getRevenueByDate({ from_date: twoWeeksAgo, to_date: weekAgo, group_by: 'day' }),
    ])
      .then(([statsRes, ordersRes, revenueRes, prevRevenueRes]) => {
        // Stats
        if (statsRes.data.success) {
          const s = statsRes.data.data.stats;
          setStats(s);

          setStatusList([
            { label: 'Chờ xác nhận', count: s.pending_orders || 0, color: '#9CA3AF' },
            { label: 'Đang xử lý', count: s.processing_orders || 0, color: '#F59E0B' },
            { label: 'Đang giao', count: s.shipped_orders || 0, color: '#3B82F6' },
            { label: 'Đã giao', count: s.delivered_orders || 0, color: '#10B981' },
            { label: 'Đã hủy', count: s.cancelled_orders || 0, color: '#EF4444' },
          ]);
        }

        // Recent orders
        if (ordersRes.data.success) {
          setRecentOrders(ordersRes.data.data.orders.slice(0, 6));
        }

        // Chart data - last 7 consecutive days with actual dates
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dateStr = date.toISOString().split('T')[0];
          last7Days.push({
            date: dateStr,
            label: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
            revenue: 0,
          });
        }

        const revenueMap = {};
        if (revenueRes.data.success) {
          revenueRes.data.data.stats.forEach(row => {
            revenueMap[row.date] = Number(row.revenue) || 0;
          });
        }

        const chartWithRevenue = last7Days.map(d => ({
          day: d.label,
          date: d.date,
          revenue: revenueMap[d.date] || 0,
        }));

        setChartData(chartWithRevenue);

        // Growth rate
        if (revenueRes.data.success && prevRevenueRes.data.success) {
          const thisWeek = revenueRes.data.data.stats.reduce((sum, r) => sum + Number(r.revenue), 0);
          const lastWeek = prevRevenueRes.data.data.stats.reduce((sum, r) => sum + Number(r.revenue), 0);
          if (lastWeek > 0) {
            setGrowthRate(((thisWeek - lastWeek) / lastWeek * 100).toFixed(1));
          } else {
            setGrowthRate(thisWeek > 0 ? '100' : '0');
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
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

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (name) => {
    const gradients = [
      'linear-gradient(135deg, #F59E0B, #FCD34D)',
      'linear-gradient(135deg, #10B981, #6EE7B7)',
      'linear-gradient(135deg, #3B82F6, #93C5FD)',
      'linear-gradient(135deg, #8B5CF6, #C4B5FD)',
      'linear-gradient(135deg, #EF4444, #FCA5A5)',
    ];
    if (!name) return gradients[0];
    return gradients[name.charCodeAt(0) % gradients.length];
  };

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  const totalStatusCount = statusList.reduce((sum, s) => sum + s.count, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid #FDE68A', borderTopColor: '#F59E0B' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>Tổng quan</h1>
          <p className="text-sm" style={{ color: '#92400E' }}>Chào buổi sáng! Cập nhật hoạt động cửa hàng.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: '#D1FAE5', color: '#065F46' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: '#10B981' }}></span>
          Hệ thống hoạt động tốt
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Người dùng',
            value: stats?.total_users || 0,
            sub: 'Khách hàng',
            gradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            )
          },
          {
            label: 'Đơn hàng',
            value: stats?.total_orders || 0,
            sub: 'Đơn đã tạo',
            gradient: 'linear-gradient(135deg, #3B82F6, #93C5FD)',
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            )
          },
          {
            label: 'Doanh thu',
            value: formatPrice(stats?.total_revenue || 0),
            sub: 'Tổng thu nhập',
            gradient: 'linear-gradient(135deg, #10B981, #6EE7B7)',
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          {
            label: 'Sản phẩm',
            value: stats?.total_products || 0,
            sub: 'Sản phẩm',
            gradient: 'linear-gradient(135deg, #8B5CF6, #C4B5FD)',
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            )
          },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: '#92400E' }}>{card.label}</p>
                <p className="text-2xl font-bold" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>{card.value}</p>
                <p className="text-xs mt-1" style={{ color: '#92400E' }}>{card.sub}</p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: card.gradient }}
              >
                <div className="text-white opacity-90">{card.icon}</div>
              </div>
            </div>
            <div className="h-1 rounded-full" style={{ background: card.gradient, opacity: 0.3 }}></div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div
          className="xl:col-span-2 rounded-2xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold mb-0.5" style={{ color: '#1F2937' }}>Doanh thu 7 ngày</h3>
              <p className="text-xs" style={{ color: '#92400E' }}>Biểu đồ doanh thu theo ngày</p>
            </div>
            <div className="flex gap-1">
              {['7D', '30D', '12M'].map((t, i) => (
                <button
                  key={t}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={i === 0 ? { background: '#F59E0B', color: '#FFFFFF' } : { background: '#FEF3C7', color: '#92400E' }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Summary row */}
          <div className="flex items-center justify-between mb-5 px-1">
            <div>
              <p className="text-xs" style={{ color: '#92400E' }}>Tổng 7 ngày</p>
              <p className="text-lg font-bold" style={{ color: '#1F2937', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
                {formatPrice(chartData.reduce((sum, d) => sum + d.revenue, 0))}
              </p>
            </div>
            {growthRate !== null && growthRate !== undefined && (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{
                background: Number(growthRate) >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: Number(growthRate) >= 0 ? '#059669' : '#DC2626'
              }}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {Number(growthRate) >= 0
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                  }
                </svg>
                {Number(growthRate) >= 0 ? '+' : ''}{growthRate}% so với tuần trước
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="h-40 flex items-end gap-2 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="border-b w-full" style={{ borderColor: '#FDE68A', borderStyle: 'dashed', opacity: 0.6 }}></div>
              ))}
              <div className="border-b w-full" style={{ borderColor: '#FDE68A', borderStyle: 'dashed', opacity: 0.3 }}></div>
            </div>

            {chartData.map((d, i) => {
              const h = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
              const isToday = i === chartData.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar relative z-10">
                  <div className="w-full flex flex-col items-center">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover/bar:opacity-100 transition-all duration-200 mb-1 px-2 py-1 rounded-lg text-xs font-semibold text-white whitespace-nowrap pointer-events-none shadow-lg" style={{ background: isToday ? '#F59E0B' : '#374151', transform: 'translateY(-4px)' }}>
                      {d.revenue > 0 ? formatPrice(d.revenue) : 'Không có'}
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full rounded-t-lg transition-all duration-700 cursor-pointer group-hover/bar:opacity-80 relative overflow-hidden"
                      style={{
                        height: `${Math.max(h, d.revenue > 0 ? 4 : 0)}%`,
                        minHeight: d.revenue > 0 ? '4px' : '2px',
                        background: isToday
                          ? 'linear-gradient(180deg, #F59E0B 0%, #FCD34D 100%)'
                          : 'linear-gradient(180deg, #92400E 0%, #F59E0B 100%)',
                        boxShadow: isToday ? '0 4px 12px rgba(245,158,11,0.4)' : 'none',
                      }}
                    >
                      {d.revenue > 0 && (
                        <div className="absolute inset-0 opacity-20" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)' }}></div>
                      )}
                    </div>
                  </div>
                  {/* Day label */}
                  <span
                    className="text-xs font-medium"
                    style={{ color: isToday ? '#92400E' : '#D97706' }}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-3" style={{ borderTop: '1px solid #FEF3C7' }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg, #F59E0B, #FCD34D)' }}></div>
              <span className="text-xs" style={{ color: '#92400E' }}>Hôm nay</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg, #92400E, #F59E0B)' }}></div>
              <span className="text-xs" style={{ color: '#92400E' }}>Các ngày trước</span>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}
        >
          <h3 className="text-base font-semibold mb-0.5" style={{ color: '#1F2937' }}>Tình trạng đơn hàng</h3>
          <p className="text-xs mb-5" style={{ color: '#92400E' }}>Phân bổ theo trạng thái</p>

          <div className="space-y-4">
            {statusList.map((item, i) => {
              const width = totalStatusCount > 0 ? (item.count / totalStatusCount) * 100 : 0;
              return (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: '#374151' }}>{item.label}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-lg" style={{ background: '#FEF3C7', color: '#92400E' }}>{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: '#FEF3C7' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${width}%`, background: item.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {statusList.length === 0 && (
              <p className="text-sm text-center" style={{ color: '#92400E' }}>Chưa có đơn hàng nào</p>
            )}
          </div>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid #FDE68A' }}>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.08), transparent)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                <svg className="w-5 h-5" style={{ color: '#F59E0B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <div>
                <p className="text-xs" style={{ color: '#92400E' }}>Tăng trưởng</p>
                <p className="text-sm font-bold" style={{ color: '#1F2937' }}>
                  {growthRate !== null && growthRate !== undefined
                    ? (Number(growthRate) >= 0 ? '+' : '') + growthRate + '%'
                    : '—'}
                  <span className="text-xs font-normal" style={{ color: '#059669' }}> vs tuần trước</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid #FDE68A', boxShadow: '0 1px 8px rgba(146,64,14,0.06)' }}
      >
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #FDE68A' }}>
          <div>
            <h3 className="text-base font-semibold mb-0.5" style={{ color: '#1F2937' }}>Đơn hàng gần đây</h3>
            <p className="text-xs" style={{ color: '#92400E' }}>6 đơn hàng mới nhất</p>
          </div>
          <Link to="/admin/orders" className="text-sm font-medium flex items-center gap-1 transition-colors" style={{ color: '#F59E0B' }}>
            Xem tất cả
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="" style={{ background: '#FEF3C7' }}>
                {['Khách hàng', 'Mã đơn', 'Ngày', 'Tổng tiền', 'Trạng thái'].map((h, i) => (
                  <th key={i} className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#92400E' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const sc = getStatusColor(order.status);
                return (
                  <tr key={order.id} className="transition-colors" style={{ borderBottom: '1px solid #FEF9F0' }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: getAvatarGradient(order.user_name) }}>
                          <span className="text-xs font-bold text-white">{getInitials(order.user_name)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#1F2937' }}>{order.user_name || 'Khách vãng lai'}</p>
                          <p className="text-xs" style={{ color: '#92400E' }}>{order.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium px-2.5 py-1 rounded-lg inline-block" style={{ background: '#FEF3C7', color: '#92400E' }}>#{order.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#374151' }}>
                      {new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold" style={{ color: '#F59E0B', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', fontWeight: 'bold' }}>{formatPrice(order.total_price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: sc.bg, color: sc.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }}></span>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-base font-medium mb-1" style={{ color: '#374151' }}>Chưa có đơn hàng nào</p>
                    <p className="text-sm" style={{ color: '#92400E' }}>Đơn hàng sẽ xuất hiện khi có khách đặt.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
